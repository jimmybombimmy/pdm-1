import "./App.css";
import { useState } from "react";

let isDragging = false;
let tempY = [0, 0];

function App() {
  const [knobOn, setKnobOn] = useState(false);
  const [knobTurn, setKnobTurn] = useState(0);
  const [knobPrev, setKnobPrev] = useState(0);

  function handleClick() {
    setKnobOn(!knobOn);
    
  }

  function handleMouseDown(e: any) {
    tempY[0] = e.screenY;
    isDragging = true;
    setKnobPrev(knobTurn);
  }

  function handleMouseUp() {
    isDragging = false;
    
  }

  function knobPosition() {
    let value = Math.ceil((tempY[0] - tempY[1]) / 2 + knobPrev)
    if (value > 100) {
      value = 100
    }
    if (value < 0) {
      value = 0
    }
    setKnobTurn(value)
  }

  function handleMouseMove(e: any) {
    if (isDragging == true) {
      tempY[1] = e.screenY;
      knobPosition()
      if (knobTurn > 100) setKnobTurn(100);
      if (knobTurn < 0) setKnobTurn(0);
    }
  }

  return (
    <main
      className="box"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="circle circle-outer" style={{rotate: `${(knobTurn * 2.9) - 145}deg`}}>
        <p className="line"></p>
        <button
          className="circle circle-inner"
          style={{ backgroundColor: knobOn ? "#7cd3fc" : "lightgrey" } }onClick={handleClick}
        >
        </button>
      </div>
      <p className="knobInfo">{knobTurn}%</p>
      
    </main>
  );
}

export default App;
