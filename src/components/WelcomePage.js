// src/components/WelcomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Our Shop</h1>
      <p>Your gateway to the best shopping experience!</p>
      <div className="button-container">
        <Link to="/login" className="btn login-btn">Login</Link>
        <Link to="/signup" className="btn signup-btn">Signup</Link>
      </div>
    </div>
  );
}

export default WelcomePage;
