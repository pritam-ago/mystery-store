import { db } from "./config"; // Adjust your Firestore config import path as needed
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 

// Sample products array
const sampleProducts = [
  {
    id: 1,
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds with noise-canceling technology and long battery life.",
    price: 59.99,
    image: "https://example.com/images/earbuds.jpg",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Eco-Friendly Water Bottle",
    description: "Reusable water bottle made from sustainable materials.",
    price: 15.99,
    image: "https://example.com/images/waterbottle.jpg",
    category: "Home & Kitchen"
  },
  {
    id: 3,
    name: "Gaming Keyboard",
    description: "Mechanical RGB keyboard with customizable lighting and responsive keys.",
    price: 89.99,
    image: "https://example.com/images/keyboard.jpg",
    category: "Gaming"
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and stylish t-shirt made from 100% organic cotton.",
    price: 25.00,
    image: "https://example.com/images/tshirt.jpg",
    category: "Clothing"
  },
  {
    id: 5,
    name: "Smartphone Holder",
    description: "Adjustable smartphone holder for easy hands-free viewing.",
    price: 12.99,
    image: "https://example.com/images/phoneholder.jpg",
    category: "Accessories"
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Non-slip yoga mat for a comfortable and stable workout.",
    price: 30.99,
    image: "https://example.com/images/yogamat.jpg",
    category: "Fitness"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    description: "Portable speaker with powerful sound and long-lasting battery life.",
    price: 45.50,
    image: "https://example.com/images/speaker.jpg",
    category: "Electronics"
  },
  {
    id: 8,
    name: "Stainless Steel Cutlery Set",
    description: "Durable and stylish cutlery set for everyday use.",
    price: 18.75,
    image: "https://example.com/images/cutlery.jpg",
    category: "Home & Kitchen"
  },
  {
    id: 9,
    name: "Running Shoes",
    description: "Lightweight and comfortable shoes designed for running and outdoor activities.",
    price: 65.00,
    image: "https://example.com/images/runningshoes.jpg",
    category: "Sportswear"
  },
  {
    id: 10,
    name: "Digital Alarm Clock",
    description: "LED display alarm clock with customizable sound and brightness.",
    price: 22.99,
    image: "https://example.com/images/alarmclock.jpg",
    category: "Home & Kitchen"
  }
];

// Function to add products to Firestore
const addProductsToFirestore = async () => {
  const productsRef = collection(db, "products");

  for (const product of sampleProducts) {
    try {
      // Check if the product already exists
      const q = query(productsRef, where("id", "==", product.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If the product does not exist, add it to Firestore
        await addDoc(productsRef, product);
        console.log(`Product with id ${product.id} added successfully!`);
      } else {
        console.log(`Product with id ${product.id} already exists.`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }
};
export default addProductsToFirestore;
