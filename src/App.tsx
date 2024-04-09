import { useEffect, useState } from "react";
import "./App.css";
import Knob from "./components/Knob.tsx";



const App = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);


  let sequenceStart = 0;
  const sequence = [false, false, false, false, false, false, false, false];

  const myInterval = setInterval(myTimer, 1000);

  function myTimer() {
    const date = new Date();
  }

  function myStopFunction() {
    clearInterval(myInterval);
  }


  return (
    <main className="box">
      <div className="tempo-box">{bpm}</div>
      <section className="drum-line">
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
        <Knob size={100} />
      </section>
      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
          if (!isPlaying) {
            myStopFunction()
          }
          console.log(isPlaying);
        }}
      >
        Play
      </button>
    </main>
  );
};

export default App;
