import { useState, useEffect } from "react";
import { socket } from "../socket";

const Timer = () => {
  const [timer, setTimer] = useState('2:30');
  const [alert, setAlert] = useState('off');

  useEffect(() => {
    let timeRemaining = 150;

    const timeDecrement = () => {

      timeRemaining--;

      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;

      const clock = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
      setTimer(clock);

      if (timeRemaining <= 0) {
        socket.emit('renderResults');
        clearInterval(startTimer);
      } else if (timeRemaining <= 30) {
        setAlert('on');
      }

    }

    const startTimer = setInterval(timeDecrement, 1000);

    return () => clearInterval(startTimer);

  }, [])

  return <p className='timer' id={alert === 'on' ? 'timer-alert' : ''}>{timer}</p>
}
export default Timer;