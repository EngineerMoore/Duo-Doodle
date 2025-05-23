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
          "Content-Type": "application/json"
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
        <label for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log In</button>
        <p>{loginErr}</p>
      </form>
      <p className="auth-redirect-wrap">
        <Link to="/register" className="auth-redirect">Don't have an account? Create an Account</Link>
      </p>
    </>
  )
}
export default Login