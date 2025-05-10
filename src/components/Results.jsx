import { useNavigate } from "react-router-dom";

const Results = ({ correctAnswer, wrongAnswers }) => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="results-heading">Results</h1>
      <div className="results">
        <h2>Correct Answer</h2>
        <h3 id="correct">{correctAnswer}</h3>
        <h2>Wrong Attempts</h2>
        <ul className="wrong-results">
          {wrongAnswers.map((answer, index) => (
            <li key={index}>{answer}</li>
          ))}
        </ul>
        <button onClick={() => navigate("/play")}>Play Again</button>
      </div>
    </>
  );
};

export default Results;
