import React, { useState } from 'react';
import "./RegisterForm.css";
import { FaUser, FaLock, FaRegUser } from "react-icons/fa";

const RegisterForm: React.FC = () => {
  const [name, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestData = { name, surname, email, password };

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setMessage("User registered successfully");
      } else {
        const errorData = await response.json();
        setMessage(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Error occurred during registration: ${error}`);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <div className="name-row">
          <div className="input-box">
            <input
              type="text"
              placeholder="First Name"
              required
              value={name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <FaRegUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Last Name"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <FaRegUser className="icon" />
          </div>
        </div>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="button-row">
            <button type="submit" className="text-button">Register</button>
            <button type="button" className="image-button google-button">Google Login</button>
            <button type="button" className="image-button orcid-button">Orcid Login</button>
        </div>

        {message && <div className="message">{message}</div>}
        
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
