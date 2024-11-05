import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../config";
import { collection, getDocs } from "firebase/firestore";
import "./styles/HomePage.css";
import ProductCard from "./ProductCard";
import logo from "../assets/Mystery.png";

function HomePage({userId}) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const ITEMS_PER_PAGE = 5;

  const filteredProducts = products.filter(product => 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "" || product.category === selectedCategory)
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  return (
    <div className="home-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Welcome to Mystery Store</h1>
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
           
          </div>
        </div>
        <div className="navigation">
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
        </div>
      </div>
      <div className="category-section">
        <h2>Categories</h2>
        <div className="categories">
          <button onClick={() => handleCategoryClick("")} className="category">All</button>
          <button onClick={() => handleCategoryClick("Electronics")} className="category">Electronics</button>
          <button onClick={() => handleCategoryClick("Clothing")} className="category">Clothing</button>
          <button onClick={() => handleCategoryClick("Home Appliances")} className="category">Home Appliances</button>
          <button onClick={() => handleCategoryClick("Books")} className="category">Books</button>
        </div>
      </div>
      <h2>Featured Products</h2>
      <div className="product-list">
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <ProductCard userId={userId} key={product.id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
