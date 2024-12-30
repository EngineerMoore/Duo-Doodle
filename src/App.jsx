import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import Homepage from "./components/Homepage"
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Play from "./components/Play";

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
        <Route peth="/play" element={<Play />} />
      </Routes>
      
    </>
  )
}

export default App
