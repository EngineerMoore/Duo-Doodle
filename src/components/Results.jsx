import { useNavigate } from "react-router-dom";

const Results = ({ correctAnswer, wrongAnswers }) => {
  const navigate = useNavigate();

  return (
    <div className="holographic-background">
      <div className="results-container">
        <h1>Results</h1>
        <p>
          <strong>Correct Answer:</strong> {correctAnswer}
        </p>
        <h2>Wrong Attempts:</h2>
        <ul>
          {wrongAnswers.map((answer, index) => (
            <li key={index}>{answer}</li>
          ))}
        </ul>
        <button onClick={() => navigate("/play")}>Play Again</button>
      </div>
    </div>
  );
};

export default Results;
