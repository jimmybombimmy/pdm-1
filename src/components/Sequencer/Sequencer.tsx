import Knob from "../Knob/Knob";

import SequenceHitInfoInterface from "../../Interfaces/SequencerInterfaces";

const sequenceHitInfo = {
  on: false,
  probability: 100,
};

interface SequenceProps {
  sequence: Array<Array<SequenceHitInfoInterface>>;
  drumLine: Array<SequenceHitInfoInterface>;
  drumNum: number;
  getDrums: Object;
  counter: number;
}

export default function Sequencer({sequence, drumLine, drumNum, getDrums, counter}: SequenceProps) {

  function onStepCountChange({ target }: any) {
    let valueDiff = target.value - drumLine.length;

    let sequenceCopy = [...drumLine];
    if (target.value >= 2 && target.value <= 16) {
      if (valueDiff > 0) {
        for (let i = 0; i < valueDiff; i++) {
          sequenceCopy.push(sequenceHitInfo);
        }
        sequence.current[drumNum] = sequenceCopy;
      } else if (valueDiff < 0) {
        valueDiff = valueDiff * -1;
        for (let i = 0; i < valueDiff; i++) {
          sequenceCopy.pop();
        }
        sequence.current[drumNum] = sequenceCopy;
      }
    }
  }

  return (
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
    {drumLine.map((knob: any, i: number) => {
      return (
        <Knob
          size={100}
          playSound={counter % drumLine.length == i ? true : false}
          isPlaying
          drumLine={drumLine}
          sampleNumber={i}
          key={`knob${i}`}
          sequence={sequence}
          drumNum={drumNum}
        />
      );
    })}
  </section>
  )
}