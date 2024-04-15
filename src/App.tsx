import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

import "./App.css";
import Knob from "./components/Knob/Knob.tsx";
import Sequencer from "./components/Sequencer/Sequencer.tsx";
import SequenceHitInfoInterface from "./Interfaces/SequencerInterfaces.tsx";

import drums_909 from "../src/assets/909 samples/drums_909.js";

let multiPlayer = new Tone.Players({0: drums_909.kick1_909, 1: drums_909.snare1_909, 2: drums_909.snare2_909, 3: drums_909.clap1_909, 4: drums_909.rim1_909, 5: drums_909.tomlo1_909, 6: drums_909.tommid1_909, 7: drums_909.tomhi1_909, 8: drums_909.closedhat1_909, 9: drums_909.openhat1_909, 10: drums_909.rim1_909, 11: drums_909.crash1_909}).toDestination();

let firstBeatPlayed = false;

const sequenceHitInfo = {
  on: false,
  probability: 100,
};

function chanceToPlay(on: boolean, prob: number) {
  const random = Math.random() * 100;
  if (prob >= random && on == true) {
    // return player.start(0);
    return true
  }
}

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0); // make this just continually rise and use modulo to determine the steps of each drum
  const sequence = useRef<Array<SequenceHitInfoInterface>>(
    Array(12).fill(Array(8).fill({ ...sequenceHitInfo }))
  );
  // console.log(sequence);

  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) {
        setCounter(0);
        firstBeatPlayed = true;
        sequence.current.map((line: any, i: number) => {
          console.log("iiiiiii", i, line)
          if (chanceToPlay(line[0].on, line[0].probability)) {
            return multiPlayer.player(String(i)).start();
          }

        });
        
      }

      myInterval = setInterval(myTimer, 60000 / bpm / 4);

      function myTimer() {
        // const date = new Date();
        setCounter(counter + 1);
        let counterCopy = counter + 1;



        // if (counter >= sequence.current.length - 1 || counter == -1) {
          sequence.current.map((line: any, i: number) => {
            // console.log(i)
            // console.log("ying",line, i)
            // setCounter(0);
            // counterCopy = 0;
            if (chanceToPlay(
              line[counterCopy % line.length].on,
              line[counterCopy % line.length].probability
            )) {
              return multiPlayer.player(String(i)).start();
            }
          });
        // } else {
        //   sequence.current.map((line) => {
        //     setCounter(counter + 1);
        //     counterCopy = counter + 1;
        //   });
        // }
        // chanceToPlay(
        //   sequence[counterCopy].on,
        //   sequence[counterCopy].probability
        // );
      }
    } else {
      clearInterval(myInterval);
      setCounter(-1);
      firstBeatPlayed = false;
    }

    return () => clearInterval(myInterval);
  }, [isPlaying, counter]);

  function onTempoChange(e: any) {
    if (e.target.value >= 60 || e.target.value <= 200) {
      setBpm(e.target.value);
    }
  }

  function setSample({ target }: { target: { value: string } }) {
    multiPlayer = new Tone.Player(drums_909[target.value]).toDestination();
  }

  function getDrums() {
    let allDrums = Object.keys(drums_909);
    return (
      <select
        name="drums"
        id="drums"
        defaultValue="kick1_909"
        onChange={setSample}
      >
        {allDrums.map((drum) => {
          return (
            <option key={drum} value={drum}>
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
        {sequence.current.map((drumLine: any, i: number) => {
          // console.log("corrd", drumLine);
          return (
            <Sequencer
              sequence={sequence}
              drumLine={drumLine}
              drumNum={i}
              getDrums={getDrums}
              counter={counter}
            />
          );
        })}
      </div>
      {/*  */}
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
