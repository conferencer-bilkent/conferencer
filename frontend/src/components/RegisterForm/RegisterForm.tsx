import React from 'react';
import "./RegisterForm.css";
import { FaUser, FaLock, FaRegUser } from "react-icons/fa";

const RegisterForm: React.FC = () => {
  return (
    <div className="wrapper">
      <form action="">
        <div className="name-row">
          <div className="input-box">
            <input type="text" placeholder="First Name" required />
            <FaRegUser className="icon" />
          </div>

          <div className="input-box">
            <input type="text" placeholder="Last Name" required />
            <FaRegUser className="icon" />
          </div>
        </div>

        <div className="input-box">
          <input type="email" placeholder="Email" required />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock className="icon" />
        </div>

        <div className="button-row">
            <button type="submit" className="text-button">Register</button>
            <button type="button" className="image-button google-button">Google Login</button>
            <button type="button" className="image-button orcid-button">Orcid Login</button>
        </div>

        <div className="register-link">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
