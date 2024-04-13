import { useEffect, useState} from "react";
import * as Tone from "tone";

import "./App.css";
import Knob from "./components/Knob.tsx";

import drums_909 from "../src/assets/909 samples/drums_909.js"

let player = new Tone.Player(drums_909.kick1_909).toDestination();

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
  const [sequence, setSequence] = useState(
    Array(8).fill({ ...sequenceHitInfo })
  );


  
  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) {
        setCounter(0);
        firstBeatPlayed = true;
        chanceToPlay(sequence[0].on, sequence[0].probability);
      }

      myInterval = setInterval(myTimer, 60000 / bpm / 4);

      function myTimer() {
        // const date = new Date();
        let counterCopy: number;
        if (counter >= sequence.length - 1 || counter == -1) {
          setCounter(0);
          counterCopy = 0;
        } else {
          setCounter(counter + 1);
          counterCopy = counter + 1;
        }
        chanceToPlay(
          sequence[counterCopy].on,
          sequence[counterCopy].probability
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
      setBpm(e.target.value);
    }
  }

  function onStepCountChange({ target }: any) {
    let valueDiff = target.value - sequence.length;

    let sequenceCopy = [...sequence];
    if (target.value >= 2 && target.value <= 16) {
      if (valueDiff > 0) {
        for (let i = 0; i < valueDiff; i++) {
          sequenceCopy.push(sequenceHitInfo);
        }
        setSequence(sequenceCopy);
      } else if (valueDiff < 0) {
        valueDiff = valueDiff * -1;
        for (let i = 0; i < valueDiff; i++) {
          sequenceCopy.pop();
        }
        setSequence(sequenceCopy);
      }
    }
  }

  function setSample({ target }: { target: { value: string } }) {
    player = new Tone.Player(drums_909[target.value]).toDestination();
  }

  function getDrums() {

    let allDrums = Object.keys(drums_909)
    return (
      <select name="drums" id="drums" defaultValue="kick1_909" onChange={setSample}>
      {allDrums.map((drum) => {
        return <option key={drum} value={drum}>{drum}</option>
      })}
      </select>
    )
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
      <section className="drum-line">
        <div className="drum-line-info">
          <h3>Step Count:</h3> 
          {" "}
          <input
            type="number"
            min="2"
            max="16"
            defaultValue="8"
            onChange={onStepCountChange}
          ></input>
          <h3>Sample:</h3>
            {getDrums()}
        </div>
        {sequence.map((knob, i) => {
          return (
            <Knob
              size={100}
              playSound={counter == i ? true : false}
              isPlaying
              sampleInfo={sequence}
              sampleNumber={i}
              key={`knob${i}`}
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
