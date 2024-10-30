// src/components/HomePage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import ProductCard from "./ProductCard";
import logo from "../assets/logo.png"; // Make sure to replace this with the path to your logo

const products = [
  { id: 1, name: "Product 1", price: "$10", image: "product1.jpg" },
  { id: 2, name: "Product 2", price: "$15", image: "product2.jpg" },
  { id: 3, name: "Product 3", price: "$20", image: "product3.jpg" },
  { id: 4, name: "Product 4", price: "$25", image: "product4.jpg" },
  { id: 5, name: "Product 5", price: "$30", image: "product5.jpg" },
  { id: 6, name: "Product 6", price: "$35", image: "product6.jpg" },
  { id: 7, name: "Product 7", price: "$40", image: "product7.jpg" },
  { id: 8, name: "Product 8", price: "$45", image: "product8.jpg" },
  { id: 9, name: "Product 9", price: "$50", image: "product9.jpg" },
  { id: 10, name: "Product 10", price: "$55", image: "product10.jpg" },
];

const ITEMS_PER_PAGE = 5; // Number of products to display per page

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on the search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages and the products to display on the current page
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="home-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Welcome to Our Shop</h1>
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-icon">🔍</button>
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
          <Link to="/category/electronics" className="category">Electronics</Link>
          <Link to="/category/clothing" className="category">Clothing</Link>
          <Link to="/category/home-appliances" className="category">Home Appliances</Link>
          <Link to="/category/books" className="category">Books</Link>
        </div>
      </div>
      <h2>Featured Products</h2>
      <div className="product-list">
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <ProductCard key={product.id} product={product} />
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
