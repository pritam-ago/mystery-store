import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config"; // Import Firebase auth and database
import { updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons
import "./styles/ProfilePage.css";

const ProfilePage = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserDetails(userSnap.data());
        setUpdatedDetails(userSnap.data()); // Initialize with current data
      } else {
        console.error("User not found");
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Edit profile function
  const handleEditProfile = async () => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, updatedDetails);
      setUserDetails(updatedDetails);
      setEditing(false);
      await handleChangePassword();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Update password function
  const handleChangePassword = async () => {
    if (!newPassword) {
      return alert("Please enter a new password");
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword(""); // Clear the password input after successful update
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the welcome page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {userDetails ? (
        <div className="profile-info">
          {editing ? (
            <div className="edit-profile">
              <input
                type="text"
                value={updatedDetails.name || ""}
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="email"
                value={updatedDetails.email || ""}
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                value={updatedDetails.age || ""}
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, age: e.target.value })}
                placeholder="Age"
              />
              <input
                type="text"
                value={updatedDetails.address || ""}
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, address: e.target.value })}
                placeholder="Address"
              />
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span onClick={() => setShowPassword(!showPassword)} className="password-eye-icon">
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
              <div className="button-group">
                <button onClick={handleEditProfile}>Save Changes</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Age:</strong> {userDetails.age}</p>
              <p><strong>Address:</strong> {userDetails.address}</p>
              <div className="button-group">
                <button onClick={() => setEditing(true)}>Edit Profile</button>
              </div>
            </div>
          )}
          {!editing && (
            <div className="button-group">
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
