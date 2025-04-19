import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "./../styles/ResultsPage.css"; // Add this CSS file for styling

const Results = ({ correctAnswer }) => {
  // const location = useLocation();
  const navigate = useNavigate();

  // const { correctAnswer, wrongAnswers } = location.state || {
  //   correctAnswer: "Cat",
  //   wrongAnswers: ["Hole", "BlackHole", "Animal", "Kitten"],
  // };



  return (
    <div className="holographic-background">
      <div className="results-container">
        <h1>Results</h1>
        <p>
          <strong>Correct Answer:</strong> {correctAnswer}
        </p>
        <h2>Wrong Attempts:</h2>
        <ul>
          {/* {wrongAnswers.map((answer, index) => (
            <li key={index}>{answer}</li>
          ))} */}
        </ul>
        <button onClick={() => navigate("/play")}>Play Again</button>
      </div>
    </div>
  );
};

export default Results;
