import { useState, useEffect } from "react";
import useMousePosition from "../hooks/useMousePosition";

import "./Knob.css";
import "../App.css";

let tempY = [0, 0];

interface KnobProps {
  size: 100 | 200;
  playSound: boolean;
  isPlaying: boolean
}

let startingPosition: number;

const Knob: React.FC<KnobProps> = ({ size, playSound, isPlaying }) => {
  const [knobOn, setKnobOn] = useState(false);
  const [knobTurn, setKnobTurn] = useState(100);
  const [knobPrev, setKnobPrev] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [knobColor, setKnobColor] = useState("lightgrey");
  const { position, mouseDown } = useMousePosition();

  function knobPosition() {
    let value = Math.ceil((tempY[0] - tempY[1]) / 2 + knobPrev);

    if (value > 100) {
      value = 100;
      tempY[0] = tempY[1] + (200 - (knobPrev * 2));
    } else if (value < 0) {
      value = 0;
      tempY[0] = tempY[1] - (knobPrev * 2)
    } 
    setKnobTurn(value);
  }

  useEffect(() => {
    const updateMousePos1 = (e: any) => {
      startingPosition = e.clientY;
        tempY[1] = e.clientY;
    };

    let mouseDragInterval: any;

    if (mouseDown && isDragging) {
      tempY[0] = startingPosition;
      mouseDragInterval = setInterval(() => {
        knobPosition();
      }, 100);
    } else {
      setIsDragging(false);
      clearInterval(mouseDragInterval);
    }

    window.addEventListener("mousemove", updateMousePos1);

    return () => {
      clearInterval(mouseDragInterval);
      window.removeEventListener("mousemove", updateMousePos1);
    };
  }, [mouseDown]);

  useEffect(() => {
    if (knobOn) {
      if (playSound == true && isPlaying == true) {
        setKnobColor("pink")
        setTimeout(() => {
          setKnobColor("#7cd3fc")
        }, 100)
      } else {
        setKnobColor("#7cd3fc")
      }
    } else {
      if (playSound == true && isPlaying == true) {
        setKnobColor("grey")
        setTimeout(() => {
          setKnobColor("lightgrey")
        }, 100)
      } else {
        setKnobColor("lightgrey")
      }
    }
    
  }, [playSound, knobOn])

  function handleClick() {
    setKnobOn(!knobOn);
  }

  function handleMouseDown() {
    setIsDragging(true);
    tempY[0] == position.y;
    setKnobPrev(knobTurn);
  }

  return (
    <main
      className={`button-box circle${size}`}
      onMouseDown={handleMouseDown}
    >
      <div
        className={` circle circle-outer`}
        style={{ rotate: `${knobTurn * 2.9 - 145}deg` }}
      >
        <p className="line"></p>
        <button
          className="circle circle-inner"
          style={{ backgroundColor: knobColor}}
          onClick={handleClick}
        ></button>
      </div>
      <p className="knobInfo">{knobTurn}%</p>
    </main>
  );
};

export default Knob;
