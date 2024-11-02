// src/components/Signup.js
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../config"; // Your Firestore config
import "./styles/Signup.css";
import BackButton from "./BackButton";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      // Create a new user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        age,
        gender,
        address,
      });

      // Redirect to Welcome page on successful signup
      window.location.href = "/"; // or use your navigate function
    } catch (err) {
      setError(err.message);
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="signup-container">
      <BackButton/>
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup} className="signup-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          maxLength={20}
        />
        <label>Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
          required
        />
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="" disabled>Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          required
        />
        <button type="submit" className="signup-btn">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
