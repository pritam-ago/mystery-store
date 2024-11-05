import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore"; 
import { db } from "../config"; 


export const updateCartQuantity = async (userId, itemId, newQuantity) => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    cart: arrayUnion({ id: itemId, quantity: newQuantity }) 
  });
};


export const removeFromCart = async (userId, itemId) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  const cart = userDoc.data()?.cart || []; 

  const updatedCart = cart.filter(item => item.id !== itemId);

  await updateDoc(userDocRef, {
    cart: updatedCart 
  });
};
