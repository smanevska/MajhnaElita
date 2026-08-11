import {useState} from "react";
import {Link, useNavigate } from "react-router";
import logo from "../assets/Logo.png";
import {apiFetch} from "../api/api";

export default function Register(){

  const navigate = useNavigate();//Used to move the user to another page after login

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  function change(e){
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function register() {
    //Check required fields
    if (
      !user.first_name ||
      !user.last_name ||
      !user.email ||
      !user.password
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    //Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    //check password rules
    if (user.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (user.password !== user.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    try{
      console.log("Sending:", user);

      const response = await apiFetch(
        "/users/register",
        {
          method: "POST",
          body: JSON.stringify({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password
          })
        }
      );

      console.log("Status:", response.status);
      const data = await response.json();
      console.log("Response:", data);

      if (data.success){
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error){
      console.error("REGISTER ERROR:", error);
      alert("Unable to connect to the server.");
    }
  }

  return(
    <div className="auth-container">

      <div className="auth-left">
        <div className="brand">
          <img src={logo} alt="mElita logo" />
        </div>
        <h1>Join the MajhnaElita community</h1>
        <p>
          Continue giving kids' items a second life.
        </p>
      </div>
      <div className="auth-right">
        <div className="form-box">
          <h2>Create Account</h2>
          <p className="subtitle">
            Join thousands of parents
          </p>

          <div className="form-row">

            <div className="field">
              <label>First Name</label>
              <input
                name="first_name"
                placeholder="Jane"
                onChange={change}
              />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input
                name="last_name"
                placeholder="Davies"
                onChange={change}
              />
            </div>

          </div>
          <div className="field">
            <label>Email</label>
            <input
              name="email"
              placeholder="jane@gmail.com"
              onChange={change}
            />
          </div>

          <div className="field">

            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              onChange={change}
            />

          </div>
          <div className="field">
            <label>Confirm Password</label>

            <input
              name="confirm_password"
              type="password"
              placeholder="Repeat password"
              onChange={change}
            />
          </div>

          <button onClick={register}>
            Create Account
          </button>
          <p className="switch">
            Already have an account?{" "}
            <Link to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}