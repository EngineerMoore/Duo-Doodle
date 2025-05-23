import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Homepage from "./components/Homepage"
import Register from "./components/Register";
import Login from "./components/Login";
import Play from "./components/Play";
import Results from "./components/Results";


const App = () => {
  const [token, setToken] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);

  return (
    <>
      <header>
        <Link to="/" className="navigation-heading"><h1 className="font-effect-shadow-multiple">Duo-Doodle</h1></Link>
        <nav className="navigation-flex">
          <Link to="/register" className="nav-link">Create An Account</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Homepage token={token} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login token={token} setToken={setToken}/>} />
        <Route path="/play" element={
          <Play
            setCorrectAnswer={ setCorrectAnswer }
            correctAnswer={ correctAnswer }
            setWrongAnswers={ setWrongAnswers }
            wrongAnswers={ wrongAnswers }
          />} />
        <Route path="/results" element={<Results correctAnswer={ correctAnswer } wrongAnswers={ wrongAnswers }/>} />
      </Routes>
      
    </>
  )
}

export default App
