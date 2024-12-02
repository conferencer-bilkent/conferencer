import React from 'react';
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm: React.FC = () => {
  return (
    <div className="wrapper">
      <form action="">
        <div className="input-box">
          <input type="email" placeholder="Email" required />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input type="password" placeholder="Password" required />
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
            <button type="button" className="image-button google-button">Google Login</button>
            <button type="button" className="image-button orcid-button">Orcid Login</button>
        </div>

        <div className="register-link">
          <p>
            Don't you have an account? <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
