// src/components/ProductCard.js
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/ProductCard.css";
import { AuthContext } from "../context/AuthContext"; // Import your Auth context
import { db } from "../config"; // Adjust import as needed
import { collection, getDoc, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore"; 

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext); // Get the current user from context
  const price = parseFloat(product.price) || 0;
  const [itemId, setItemId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("id", "==", Number(product.id)));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setItemId({id: doc.id})
          });
        } 
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  // Function to add product to cart
   // Function to add product to cart
   const addToCart = async () => {
    if (!user) {
      alert("You need to be logged in to add items to the cart.");
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid); // Reference to the user's document
    try {
      // Fetch the current cart items to check if the product already exists
      const userSnapshot = await getDoc(userDocRef);
      const cartItems = userSnapshot.data()?.cart || []; // Use optional chaining to avoid errors if cart is undefined
  
      const existingProductIndex = cartItems.findIndex(item => item.id === itemId.id);
  
      if (existingProductIndex !== -1) {
        // If product exists, update quantity
        const updatedCart = cartItems.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + quantity } // Increase quantity
            : item
        );
  
        await updateDoc(userDocRef, {
          cart: updatedCart // Update the cart array
        });
        alert(`Updated ${product.name} quantity to ${updatedCart[existingProductIndex].quantity}!`);
      } else {
        // Add new product to the cart
        await updateDoc(userDocRef, {
          cart: arrayUnion({ id: itemId.id, quantity: quantity }) // Add product with quantity
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
