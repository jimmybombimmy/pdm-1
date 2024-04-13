import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

import "./App.css";
import Knob from "./components/Knob.tsx";

import kick from "./assets/909 samples/BD 909 A Clean.wav";
const player = new Tone.Player(kick).toDestination();

let firstBeatPlayed = false;

const sequenceHitInfo = {
  on: false,
  probability: 100,
};

function chanceToPlay(on: boolean, prob: number) {
  const random = Math.random() * 100;
  if (prob >= random && on == true) {
    return player.start(0);
  }
}

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const sequence = useRef(Array(12).fill({ ...sequenceHitInfo }));

  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) {
        setCounter(0);
        firstBeatPlayed = true;
        chanceToPlay(sequence.current[0].on, sequence.current[0].probability);
      }

      myInterval = setInterval(myTimer, 60000 / bpm / 4);

      function myTimer() {
        // const date = new Date();
        let counterCopy: number;
        if (counter >= sequence.current.length - 1 || counter == -1) {
          setCounter(0);
          counterCopy = 0;
        } else {
          setCounter(counter + 1);
          counterCopy = counter + 1;
        }
        chanceToPlay(
          sequence.current[counterCopy].on,
          sequence.current[counterCopy].probability
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
    
    if (e.target.value >= 60 || e.target.value <= 200) {
      setBpm(e.target.value)
    }
  }

  return (
    <main className="box">
      <div className="tempo-box">
        <h3 className="tempo-text">Tempo:</h3>
        {" "}
        <input type="number" min="60" max="200" defaultValue="120" onChange={onTempoChange}></input>
      </div>
      <section className="drum-line">
        {sequence.current.map((knob, i) => {
          return (
            <Knob
              size={100}
              playSound={counter == i ? true : false}
              isPlaying
              sampleInfo={sequence.current}
              sampleNumber={i}
            />
          );
        })}
      </section>
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
