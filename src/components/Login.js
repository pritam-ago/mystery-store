// src/components/Login.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth
import "./styles/Login.css";
import BackButton from "./BackButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history("/home"); // Redirect to Home page on successful login
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <BackButton/>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            maxLength={20}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="eye-icon"
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;
