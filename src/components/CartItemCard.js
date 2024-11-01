// src/components/CartItemCard.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../config";
import "./styles/CartItemCard.css"; 


const CartItemCard = ({ userId, item, refreshCart }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productRef = doc(db, "products", item.id);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct(productSnap.data());
      } else {
        console.error("Product details not found");
      }
    };

    fetchProductDetails();
  }, [item.id]);

  // Update the quantity in Firestore and local state
  const updateCartQuantity = async (newQuantity) => {
    if (!userId || newQuantity < 1) return;

    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    const currentCart = userSnap.data()?.cart || [];

    const updatedCart = currentCart.map(cartItem =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
    );

    await updateDoc(userDocRef, { cart: updatedCart });
    setQuantity(newQuantity);
    refreshCart();
  };

  // Increase quantity
  const increaseQuantity = () => updateCartQuantity(quantity + 1);

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateCartQuantity(quantity - 1);
    } else {
      removeFromCart();
    }
  };

  // Remove item from cart and refresh list
  const removeFromCart = async () => {
    const userDocRef = doc(db, "users", userId);
    const cartItem = { id: item.id, quantity }; // Ensure correct object structure

    await updateDoc(userDocRef, {
      cart: arrayRemove(cartItem)
    });

    refreshCart(); // Refresh cart list in parent component
  };

  if (!product) return null;

  return (
    <div className="cart-item-card">
      <img src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3 className="cart-item-title">{product.name}</h3>
        <p className="cart-item-description">{product.description}</p>
        <p className="cart-item-price">Price: ${product.price.toFixed(2)}</p>
        <span className="cart-item-category">{product.category}</span>

        <div className="cart-item-quantity">
          <button onClick={decreaseQuantity} className="quantity-btn">-</button>
          <span className="quantity">{quantity}</span>
          <button onClick={increaseQuantity} className="quantity-btn">+</button>
        </div>

        <button onClick={removeFromCart} className="remove-btn">Remove from Cart</button>
      </div>
    </div>
  );
};

export default CartItemCard;
