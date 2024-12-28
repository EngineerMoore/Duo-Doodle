import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Homepage from "./components/Homepage"

const App = () => {

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
        <Route path="/" element={<Homepage />} />
      </Routes>
      
    </>
  )
}

export default App
