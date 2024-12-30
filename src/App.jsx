import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Homepage from "./components/Homepage"
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Play from "./components/Play";
import Artist from "./components/Artist";
import Guess from "./components/Guess";
import Results from "./components/Results";

/* TODO: /profile -> /profile:username
use find to search all pages and correct */
const App = () => {
  const [ token, setToken ] = useState(``);

  return (
    <>
      <header>
        <Link to="/"><h1>Duo-Doodle</h1></Link>
        <nav>
          <Link to="/register">Create An Account</Link>
          <Link to="/login">Login</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Homepage token={token} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login token={token} setToken={setToken}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/play" element={<Play />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/guess" element={<Guess />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      
    </>
  )
}

export default App
