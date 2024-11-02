// src/components/ProductCard.js
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/ProductCard.css";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config";
import { collection, getDoc, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore"; 

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext); // Get the current user from context
  const [itemId, setItemId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const price = parseFloat(product.price) || 0;

  // Fetch the product document ID only once
  useEffect(() => {
    const fetchProductId = async () => {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("id", "==", Number(product.id)));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; // Set the first document's ID if found
          setItemId(docId);
        }
      } catch (error) {
        console.error("Error fetching product ID:", error);
      }
    };

    fetchProductId();
  }, [product.id]);

  // Function to add product to cart
  const addToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    if (!itemId) {
      console.error("Product ID not available.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    try {
      // Check current cart items to see if the product exists
      const userSnapshot = await getDoc(userDocRef);
      const cartItems = userSnapshot.data()?.cart || [];

      const existingItemIndex = cartItems.findIndex(item => item.id === itemId);

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedCart = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );

        await updateDoc(userDocRef, { cart: updatedCart });
        alert(`Updated quantity of ${product.name} to ${updatedCart[existingItemIndex].quantity}!`);
      } else {
        // Add new item if it doesn't exist in the cart
        await updateDoc(userDocRef, {
          cart: arrayUnion({ id: itemId, quantity })
        });
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${price.toFixed(2)}</p>
        <span className="product-tag">{product.category}</span>
      </Link>
      <button onClick={addToCart} className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
