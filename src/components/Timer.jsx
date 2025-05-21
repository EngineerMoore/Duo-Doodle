import { useState, useRef, useEffect } from "react";
import { socket } from "../socket";

const Timer = () => {
  const [timer, setTimer] = useState('2:30');

  const Ref = useRef(null);


  useEffect(() => {
    let timeRemaining = 150;

    const timeDecrement = () => {
      if (timeRemaining <= 0) {
        setTimer('0:00');
        clearInterval(startTimer);
        return;
      }

      if (timeRemaining <= 30) {
        const addAlert = () => {
          const timerElement = document.querySelector('.timer');
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

    }

    const startTimer = setInterval(timeDecrement, 1000);

    return () => clearInterval(startTimer);

    }, [])

      if (timer === '0:00') {
    socket.emit('renderResults');
  };


  return <p className="timer">{timer}</p>
}
export default Timer;