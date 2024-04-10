import { useEffect, useState, useRef } from "react";
import * as Tone from 'tone'


import "./App.css";
import Knob from "./components/Knob.tsx";

import kick from "./assets/909 samples/BD 909 A Clean.wav"
const player = new Tone.Player(kick).toDestination()

let firstBeatPlayed = false

const sequenceHitInfo = {
  on: false,
  probability: 100,
}

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0)
  const sequence = useRef(Array(8).fill({...sequenceHitInfo}))

  useEffect (() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) { 
        setCounter(0)
        firstBeatPlayed = true
        player.start(0)
      }

      myInterval = setInterval(myTimer, 500);
      
      function myTimer() {
        player.start(0)
        // const date = new Date();
        if (counter >= sequence.current.length - 1 || counter == -1) {
          setCounter(0);
        } else {
          setCounter(counter+1);
        }
      }
    } else {
      clearInterval(myInterval);
      setCounter(-1);
      firstBeatPlayed = false
    }

    return () => clearInterval(myInterval)
  }, [isPlaying, counter]);


  return (
    <main className="box">
      <div className="tempo-box">{bpm}</div>
      <section className="drum-line">
        {sequence.current.map((knob, i) => {
          return <Knob size={100} playSound={counter == i ? true :  false} isPlaying sampleInfo={sequence.current} sampleNumber={i}/>
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
