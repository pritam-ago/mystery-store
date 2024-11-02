// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button onClick={handleBack} style={styles.button}>
      ← Back
    </button>
  );
};

const styles = {
  button: {
    position: 'fixed', // Always stay at the top-left corner
    top: '20px',
    left: '20px',
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007bff', // Primary blue color
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 1000, // Keep it above other content
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  }
};

// Hover effect
styles.button[':hover'] = {
  backgroundColor: '#0056b3',
};

export default BackButton;
