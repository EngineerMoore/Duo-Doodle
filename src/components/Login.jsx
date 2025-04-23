import{ useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ token, setToken }) => {
  const [ email, setEmail ] = useState(``);
  const [ password, setPassword ] = useState(``);
  const [ loginErr, setLoginErr ] = useState(``);
  const navigate = useNavigate();

  const logIn = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`https://duo-doodle-server.onrender.com/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "applicaton/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      });
      const result = await response.json();
      const accessToken = result.token;
      result.token? setToken(accessToken) : setLoginErr(result.message);
      if(token){
        localStorage.setItem(`token`, accessToken);
        navigate("/play");
      }
    }catch(e){console.error(e.message)};
  }
  return (
    <>
      <form onSubmit={logIn}>
        <h2>Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log In</button>
        <p>{loginErr}</p>
      </form>
      <Link to="/register">Don't have an account? Create an Account</Link>
    </>
  )
}
export default Login