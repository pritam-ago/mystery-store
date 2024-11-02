// src/components/CartPage.js
import React, { useEffect, useState } from "react";
import { db } from "../config"; // Your Firebase config
import { doc, getDoc } from "firebase/firestore";
import CartItemCard from "./CartItemCard"; // Import CartItemCard
import BackButton from "./BackButton";

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  // Function to fetch updated cart data
  const refreshCart = async () => {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      setCartItems(userDoc.data().cart || []);
    }
  };

  // Fetch cart items initially and every time userId changes
  useEffect(() => {
    refreshCart();
  }, [userId]);

  // Calculate total price whenever cartItems change
  useEffect(() => {
    const calculateTotalPrice = async () => {
      let total = 0;

      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          total += productData.price * item.quantity; // Calculate total based on quantity
        }
      }
      setTotalPrice(total);
    };

    calculateTotalPrice(); // Calculate total price when cartItems change
  }, [cartItems]); // Dependency on cartItems

  return (
    <div className="cart-page">
      <BackButton/>
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItemCard key={item.id} userId={userId} item={item} refreshCart={refreshCart} />
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      
        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      
    </div>
  );
};

export default CartPage;
