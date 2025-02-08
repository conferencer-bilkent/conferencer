import React, { useState } from 'react';
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import Topbar from '../../global/TopBar';
//check Topbar for theme change use
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200 && data.token) {
          setMessage("Login successful!");
          console.log("Token:", data.token);
      } else if (response.status === 401) {
        setMessage("Incorrect email or password.");
      } else {
        setMessage("Unknown error occurred. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div>
      <Topbar></Topbar>
        <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <div className="button-row">
          <button type="submit" className="text-button">Login</button>
          <button type="button" className="image-button google-button">
            Google Login
          </button>
          <button type="button" className="image-button orcid-button">
            Orcid Login
          </button>
        </div>

        <div className="register-link">
          <p>
            Don't you have an account? <a href="/register">Register</a>
          </p>
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
    </div>
    
  );
};

export default LoginForm;