import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { socket } from "../socket";
import DrawTools from "./DrawTools";
import Guess from "./Guess";
import Canvas from "./Canvas";

const Play = ({correctAnswer, setCorrectAnswer}) => {
  const canvasRef = useRef(null);
  const Ref = useRef(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [fillColorChecked, setFillColorChecked] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [renderColor, setRenderColor] = useState(`#000`);
  const [player, setPlayer] = useState('artist');
  const [timer, setTimer] = useState(`2:00`);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('artist', () => {
      setPlayer('artist');
    });

    socket.on('guesser', () => {
      setPlayer('guesser')
    })

    return () => {
      socket.off('artist');
      socket.off('guesser');
      }
  }, [])

  useEffect(() => {
    let timeRemaining = 360;

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

    }

    const startTimer = setInterval(timeDecrement, 1000);

    return () => clearInterval(startTimer);
  }, []);

  if (timer === '0:00') {
    navigate("/results")
  };

  return (
    <>
      <h1>{
        player === 'artist' ?
        'Your turn to draw!':
        'Guess the drawing' 
      }</h1>
      <h2>{
        player === 'artist' ?
        'Topic: ' + correctAnswer:
        '' 
      }</h2>
      <div className="play-container">
      <Canvas
        selectedTool={ selectedTool }
        fillColorChecked={ fillColorChecked }
        brushWidth={ brushWidth }
        renderColor={ renderColor }
        canvasRef={ canvasRef }
        setSelectedTool={ setSelectedTool }
        setFillColorChecked={ setFillColorChecked }
        setBrushWidth={ setBrushWidth }
        setRenderColor={ setRenderColor }
      />
      { player === 'artist' ?      
        <DrawTools
          selectedTool={ selectedTool }
          setSelectedTool={ setSelectedTool }
          setFillColorChecked={ setFillColorChecked }
          setBrushWidth={ setBrushWidth }
          setRenderColor={ setRenderColor }
          // ctxRef={ ctxRef }
          canvasRef={ canvasRef }
        /> :
        <Guess />
      }
      </div>
      <p className="timer">{timer}</p>

    </>
  )
}
export default Play