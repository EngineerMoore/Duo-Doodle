import React, { useEffect, useRef, useState } from "react";

const Guess = ({ selectedTool, fillColorChecked, brushWidth, renderColor, ctxRef }) => {
  const [guess, setGuess] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);

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
