import React, { useEffect, useRef, useState } from "react";

const Guess = ({ selectedTool, fillColorChecked, brushWidth, renderColor, ctxRef }) => {
  const [guess, setGuess] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const guesses = [];
  const handleGuessSubmit = (e) => {

    // show characters as guess is placed in input (b4 submit)
    // on submit
      // if guess doesn't match answer
        // add to wrong answer array 
        // show guess on screen
      // else:
        // emit 'renderResults' (will trigger wrong answers emission)
    guesses.push(guess);
    const guessUL = document.querySelector('.guesses');
    const li = document.createElement('li');
    li.innerText = guess
    guessUL.append(li);
    setGuess('');

    // console.log(guesses);
    // if (guess.trim() === "") return;

    // if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
    //   alert("Correct!");
    // } else {
    //   setWrongAnswers((prev) => [...prev, guess]);
    // }
    // setGuess("");
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
          <button onClick={(e) => handleGuessSubmit(e)}>Submit Guess</button>
          <ul className="guesses"><li>Hi</li></ul>
        </div>
      </div>
    </div>
  );
};

export default Guess;
