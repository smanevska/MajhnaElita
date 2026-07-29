import { useState} from "react";
import {useNavigate, Link} from "react-router";
import logo from "../assets/Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });// Stores login form values
//Updates the input value when the user types
  function change(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
//Sends login data to the backend
  async function login() {
    const response = await fetch("http://88.200.63.148:30170/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();// Convert response from backend into JavaScript object

    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");//redirect user to dashboard page
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="brand">
          <img src={logo} alt="mElita logo" />
        </div>
        <h1>Welcome back to the MajhnaElita community</h1>
        <p>Continue giving kids' items a second life.</p>
      </div>
    {/* Login form */}
      <div className="auth-right">
        <div className="form-box">
          <h2>Log in</h2>
          <p className="subtitle">Welcome back, please enter your details</p>
        {/* Email input */}
          <div className="field">
            <label>Email</label>
            <input name="email" placeholder="jane@gmail.com" onChange={change} />
          </div>
        {/* Password input */}
          <div className="field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min 8 characters"
              onChange={change}
            />
          </div>

          <button onClick={login}>Log in</button>
        {/*Link to registration page */}
          <p className="switch">
            No account? <Link to="/">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}