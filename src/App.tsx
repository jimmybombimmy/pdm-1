import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

import "./App.css";
import Sequencer from "./components/Sequencer/Sequencer.tsx";
import SequenceHitInfoInterface from "./Interfaces/SequencerInterfaces.tsx";

import samples from "./assets/samples/samples.js";

const drumList = [
  { name: "kick1_909", path: samples.kick1_909 },
  { name: "snare1_909", path: samples.snare1_909 },
  { name: "snare2_909", path: samples.snare2_909 },
  { name: "clap1_909", path: samples.clap1_909 },
  { name: "rim1_909", path: samples.rim1_909 },
  { name: "tomlo1_909", path: samples.tomlo1_909 },
  { name: "tommid1_909", path: samples.tommid1_909 },
  { name: "tomhi1_909", path: samples.tomhi1_909 },
  { name: "closedhat1_909", path: samples.closedhat1_909 },
  { name: "openhat1_909", path: samples.openhat1_909 },
  { name: "ride1_909", path: samples.ride1_909 },
  { name: "crash1_909", path: samples.crash1_909 },
];

function drumListToPlayer() { 
  const numberedPaths: {[key: number]: string} = {};
  
  for (let i = 0; i < drumList.length; i++) {
    numberedPaths[i] = drumList[i].path
  }

  return numberedPaths
}

let multiPlayer: Tone.Players = new Tone.Players(drumListToPlayer()).toDestination();

let firstBeatPlayed = false;

const sequenceHitInfo = {
  on: false,
  probability: 100,
};

function chanceToPlay(on: boolean, prob: number) {
  const random = Math.random() * 100;
  if (prob >= random && on == true) {
    return true;
  }
}

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0); // make this just continually rise and use modulo to determine the steps of each drum
  const sequence: React.MutableRefObject<SequenceHitInfoInterface[][]> = useRef(
    Array(12).fill(Array(8).fill({ ...sequenceHitInfo }))
  );

  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) {
        setCounter(0);
        firstBeatPlayed = true;
        sequence.current.map(
          (drumLine: SequenceHitInfoInterface[], i: number) => {
            if (chanceToPlay(drumLine[0].on, drumLine[0].probability)) {
              return multiPlayer.player(String(i)).start();
            }
          }
        );
      }

      myInterval = setInterval(myTimer, 60000 / bpm / 4);

      function myTimer() {
        setCounter(counter + 1);
        let counterCopy = counter + 1;
        sequence.current.map(
          (drumLine: SequenceHitInfoInterface[], i: number) => {
            if (
              chanceToPlay(
                drumLine[counterCopy % drumLine.length].on,
                drumLine[counterCopy % drumLine.length].probability
              )
            ) {
              return multiPlayer.player(String(i)).start();
            }
          }
        );
      }
    } else {
      clearInterval(myInterval);
      setCounter(-1);
      firstBeatPlayed = false;
    }

    return () => clearInterval(myInterval);
  }, [isPlaying, counter]);

  function onTempoChange(e: any) {
    if (Number(e.target.value >= 60) || e.target.value <= 200) {
      setBpm(e.target.value);
    }
  }

  function getDrums(n: number) {
    let allDrums = Object.keys(samples);
    return (
      <select
        name="drums"
        id="drums"
        defaultValue={drumList[n].name}
        onChange={(e) => {
          drumList[n].path = drumList[n].path.replace(drumList[n].name, e.target.value)
          drumList[n].name = e.target.value;
          multiPlayer = new Tone.Players(drumListToPlayer()).toDestination();
        }}
      >
        {allDrums.map((drum, i: number) => {
          return (
            <option key={drum + i} value={drum}>
              {drum}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <main className="box">
      <div className="tempo-box">
        <h3 className="tempo-text">Tempo:</h3>{" "}
        <input
          type="number"
          min="60"
          max="200"
          defaultValue="120"
          onChange={onTempoChange}
        ></input>
      </div>
      <div>
        {sequence.current.map(
          (drumLine: SequenceHitInfoInterface[], i: number) => {
            return (
              <Sequencer
                sequence={sequence}
                drumLine={drumLine}
                drumNum={i}
                getDrums={getDrums}
                counter={counter}
              />
            );
          }
        )}
      </div>
      <button
        onClick={async () => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
    </main>
  );
};

export default App;
