import { useState, useRef, useEffect } from "react";
import Canvas from "./Canvas";
// import "./../styles/DrawingSubmission.css";

const Artist = () => {
  const Ref = useRef(null);
  const [timer, setTimer] = useState(`2:00`);

  useEffect(() => {
    let timeRemaining = 120;

    const timeDecrement = () => {
      if (timeRemaining <= 0) {
        setTimer(`0:00`);
        clearInterval(startTimer);
        return;
      }

      if (timeRemaining <= 30) {
        const addAlert = () => {
          const timerElement = document.querySelector(`.timer`);
          timerElement.id = "timer-alert";
          Ref.current = timerElement.id;
        };
        if (!Ref.current) addAlert();
      }

      timeRemaining--;

      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;

      const clock = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
      setTimer(clock);
    };

    const startTimer = setInterval(timeDecrement, 1000);

    return () => clearInterval(startTimer);
  }, []);

  return (
    <div className="holographic-background">
      <div className="drawing-container">
        <h1>Your Turn to Draw!</h1>
        <h2>Topic: Cat</h2>
        <Canvas />
        <p className="timer">{timer}</p>
      </div>
    </div>
  );
};

export default Artist;