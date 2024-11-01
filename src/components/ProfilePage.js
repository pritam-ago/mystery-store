// src/components/Profile.js
import React, { useEffect, useState } from "react";
import { db } from "../config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase auth
import "./styles/ProfilePage.css";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userEmail = auth.currentUser ? auth.currentUser.email : null; // Get current user email

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading
      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(userQuery);
        console.log("Query Snapshot:", querySnapshot);

        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
        } else {
          console.log("No user found with this email");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (userEmail) fetchUserData();
  }, [userEmail]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Age:</strong> {userData.age}</p>
      <p><strong>Gender:</strong> {userData.gender}</p>
      <p><strong>Address:</strong> {userData.address}</p>
    </div>
  );
}

export default ProfilePage;
