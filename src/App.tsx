import { useEffect, useState } from "react";
import "./App.css";
import Knob from "./components/Knob.tsx";

// let counter = 0;
let firstBeatPlayed = false

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0)
  

  //Do I even need this now?
  const sequence = [true, false, false, false, false, false, false, false];


  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      if (!firstBeatPlayed) {
        setCounter(0)
        firstBeatPlayed = true
      }
      myInterval = setInterval(myTimer, 1000);
      function myTimer() {
        // const date = new Date();
        if (counter >= sequence.length - 1 || counter == -1) {
          sequence[counter] = false;
          setCounter(0);
          sequence[counter] = true; 
        } else {
          sequence[counter] = false;
          setCounter(counter+1);
          sequence[counter] = true;
        }
      }
    } else {
      sequence[counter] = false
      clearInterval(myInterval);
      setCounter(-1);
      sequence[counter] = true
      firstBeatPlayed = false
    }

    return () => clearInterval(myInterval)
  }, [isPlaying, counter]);


  return (
    <main className="box">
      <div className="tempo-box">{bpm}</div>
      <section className="drum-line">
        {sequence.map((knob, i) => {
          return <Knob size={100} playSound={counter == i ? true :  false} isPlaying />
        })}

      </section>
      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
    </main>
  );
};

export default App;
