// src/firestoreUtils.js
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore"; // Import necessary Firestore functions
import { db } from "../config"; // Your firebase config

// Function to update the quantity of a specific item in the cart
export const updateCartQuantity = async (userId, itemId, newQuantity) => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    cart: arrayUnion({ id: itemId, quantity: newQuantity }) // Ensure this stores the document reference ID
  });
};

// Function to remove an item from the cart
export const removeFromCart = async (userId, itemId) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  const cart = userDoc.data()?.cart || []; // Safely get cart or default to empty array

  const updatedCart = cart.filter(item => item.id !== itemId); // Remove the item from the cart

  await updateDoc(userDocRef, {
    cart: updatedCart // Update Firestore with the new cart
  });
};
