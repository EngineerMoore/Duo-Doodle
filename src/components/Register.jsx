import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName ] = useState(``);
  const [lastName, setLastName ] = useState(``);
  const [username, setUsername ] = useState(``);
  const [email, setEmail ] = useState(``);
  const [password, setPassword ] = useState(``);
  const [registerErr, setRegisterErr] = useState(``);
  const navigate = useNavigate();


  const createAccount = async (e) => {
    e.preventDefault();
    console.log(`${firstName} ${lastName} + ${username} + ${email} + ${password}`);
    try {
      const response = await fetch(`https://duo-doodle-server.onrender.com/api/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
        })
      })
      const result = await response.json();
      console.log(result);
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      switch (!result.token){
        case true:
          setRegisterErr(result.message);
          break;
        default:
          navigate(`/profile`);
      }
    }catch(e){console.error(e.message)};
  }

  return (
    <>
      <form onSubmit={createAccount}>
        <h2>Create an account</h2>
        <input
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
        // TODO: type="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Sign Up</button>
      </form>
      <p>{registerErr}</p>
      <Link to="/login">Already have an account? Log in</Link>
    </>
  )
}
export default Register