import { useState } from "react";
import { socket } from "../socket"

const Guess = ({ wrongAnswers, setWrongAnswers, correctAnswer }) => {
  const [guess, setGuess] = useState("");

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const correctGuess = guess.toLowerCase() === correctAnswer.toLowerCase() 
    if (!correctGuess) {
      const newAnswersArr = [...wrongAnswers, guess]
      setWrongAnswers(newAnswersArr)
      socket.emit('wrong', newAnswersArr)
      setGuess('');
    } else {
      socket.emit('renderResults')
    }
  };

  return (
    <div className="guesser-container">
      <form className="guess-form">
        <input id ="guess-input"
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
        />
        <button onClick={(e) => handleGuessSubmit(e)}>Submit Guess</button>
      </form>
      <ul className="guesses">{wrongAnswers.map(wrongAnswer => (
        <li key={wrongAnswer}>{wrongAnswer}</li>
      ))}</ul>
    </div>
  );
};

export default Guess;
