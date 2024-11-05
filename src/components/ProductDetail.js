import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config";
import { collection, query, where, getDocs,getDoc, updateDoc, doc, arrayUnion } from "firebase/firestore"; 
import { AuthContext } from "../context/AuthContext"; 
import "./styles/ProductDetail.css";
import BackButton from "./BackButton";

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext); 
  const [quantity, setQuantity] = useState(1); 
  
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

  
  const addToCart = async () => {
    if (!user) {
      alert("You need to be logged in to add items to the cart.");
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid); 
    try {
      
      const userSnapshot = await getDoc(userDocRef);
      const cartItems = userSnapshot.data()?.cart || [];
  
      const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
  
      if (existingProductIndex !== -1) {
        
        const updatedCart = cartItems.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
  
        await updateDoc(userDocRef, {
          cart: updatedCart
        });
        alert(`Updated ${product.name} quantity to ${updatedCart[existingProductIndex].quantity}!`);
      } else {
        
        await updateDoc(userDocRef, {
          cart: arrayUnion({ id: product.id, quantity: quantity }) 
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
