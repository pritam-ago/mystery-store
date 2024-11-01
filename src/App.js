import React, { useEffect, useState } from "react";
import { auth } from "./config"; // Import your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import CartPage from "./components/CartPage";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

function App() {

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Get the current user's ID
      } else {
        setUserId(null); // User is signed out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (

    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage userId={userId}/>} />
        <Route path="/profile" element={<ProfilePage userId={userId}/>}/>
        <Route path="/cart" element={<CartPage userId={userId} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
