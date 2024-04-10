import { useEffect, useState } from "react";
import "./App.css";
import Knob from "./components/Knob.tsx";

let counter = 0;

const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  const sequence = [true, false, false, false, false, false, false, false];

  useEffect(() => {
    let myInterval = 0;
    if (isPlaying) {
      myInterval = setInterval(myTimer, 1000);
      function myTimer() {
        console.log("counter start", sequence, counter);
        // const date = new Date();
        if (counter >= sequence.length - 1) {
          sequence[counter] = false;
          counter = 0;
          sequence[counter] = true;
        } else {
          sequence[counter] = false;
          counter++;
          sequence[counter] = true;
        }
      }
    } else {
      sequence[counter] = false
      clearInterval(myInterval);
      counter = 0;
      sequence[counter] = true
    }

    return () => clearInterval(myInterval)
  }, [isPlaying]);

  return (
    <main className="box">
      <div className="tempo-box">{bpm}</div>
      <section className="drum-line">
        <Knob size={100} play={sequence[0]} />
        <Knob size={100} play={sequence[1]} />
        <Knob size={100} play={sequence[2]} />
        <Knob size={100} play={sequence[3]} />
        <Knob size={100} play={sequence[4]} />
        <Knob size={100} play={sequence[5]} />
        <Knob size={100} play={sequence[6]} />
        <Knob size={100} play={sequence[7]} />
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
