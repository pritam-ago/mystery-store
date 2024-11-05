import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config"; 
import { updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./styles/ProfilePage.css";
import BackButton from "./BackButton";

const ProfilePage = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserDetails(userSnap.data());
        setUpdatedDetails(userSnap.data());
      } else {
        console.error("User not found");
      }
    };

    fetchUserDetails();
  }, [userId]);


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


  const handleChangePassword = async () => {
    if (!newPassword) {
      return alert("Please enter a new password");
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword(""); 
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="profile-page">
      <BackButton/>
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
