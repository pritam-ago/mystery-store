import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config"; // Adjust import as needed
import { collection, query, where, getDocs,getDoc, updateDoc, doc, arrayUnion } from "firebase/firestore"; 
import { AuthContext } from "../context/AuthContext"; // Import your Auth context
import "./styles/ProductDetail.css"; // Import your styles
import BackButton from "./BackButton";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product id from the URL
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext); // Get the current user from context
  const [quantity, setQuantity] = useState(1); // Quantity state for the product
  
  useEffect(() => {
    const fetchProduct = async () => {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("id", "==", Number(id)));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setProduct({ ...doc.data(), id: doc.id });
          });
        } else {
          console.error("No product found with the given id.");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

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
  
      const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
  
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
          cart: arrayUnion({ id: product.id, quantity: quantity }) // Add product with quantity
        });
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  
  

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <BackButton/>
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${product.price}</p>
          <div className="quantity-container">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="quantity-input"
            />
          </div>
          <button onClick={addToCart} className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
