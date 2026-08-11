import { useState} from "react";
import {useNavigate, Link} from "react-router";
import logo from "../assets/Logo.png";
import {apiFetch} from "../api/api";

export default function Login() {
  const navigate=useNavigate();
  const [data, setData]= useState({ email: "", password: "" });// Stores login form values
  const [error,setError] =useState("");
  const [loading,setLoading]= useState(false);
  //Updates the input value when the user types
  function change(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
//Sends login data to the backend
 async function login(){
    setError("");
    if(!data.email || !data.password){
        setError("Email and password are required.");
        return;
    }
    try{
        setLoading(true);
        const response = await apiFetch("/users/login",{
            method:"POST",
            body:JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success){
            localStorage.setItem(
                "token",
                result.token
            );
            navigate("/dashboard");
        }else{
            setError(result.message);
        }
    }catch(error){
        setError("Cannot connect to server.");
    }
    finally{
        setLoading(false);
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