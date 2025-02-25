import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "./Canvas";
// import "./../styles/GuesserPage.css"; 



const Guess = ({ selectedTool, fillColorChecked, brushWidth, renderColor, ctxRef }) => {
  const canvasRef = useRef(null);
  const [guess, setGuess] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(""); 
  const [timer, setTimer] = useState(40); 
  const [drawing, setDrawing ] = useState();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");

    
  //   socket.on("drawing-data", (data) => {
  //     const { x, y, type } = data;
  //     if (type === "start") {
  //       context.beginPath();
  //       context.moveTo(x, y);
  //     } else if (type === "draw") {
  //       context.lineTo(x, y);
  //       context.stroke();
  //     }
  //   });

    
  //   return () => {
  //     socket.off("drawing-data");
  //   };
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      navigate("/results", {
        state: {
          correctAnswer,
          wrongAnswers,
        },
      });
    }

    return () => clearInterval(interval);
  }, [timer, navigate, correctAnswer, wrongAnswers]);

  const handleGuessSubmit = () => {
    if (guess.trim() === "") return;

    if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
      alert("Correct!");
    } else {
      setWrongAnswers((prev) => [...prev, guess]);
    }
    setGuess("");
  };

  return (
    <div className="holographic-background">
      <div className="guesser-container">
        <h1>Guess the Drawing</h1>
        {/* <canvas ref={canvasRef} width={500} height={400} style={{ border: "1px solid black" }}></canvas> */}
        <Canvas
          selectedTool={ selectedTool }
          fillColorChecked={ fillColorChecked }
          brushWidth={ brushWidth }
          renderColor={ renderColor }
          ctxRef={ ctxRef }
          canvasRef={ canvasRef }
        />
        <p>Time Remaining: {timer} seconds</p>
        <div>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
          />
          <button onClick={handleGuessSubmit}>Submit Guess</button>
        </div>
      </div>
    </div>
  );
};

export default Guess;
