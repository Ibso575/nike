"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { products, admins, orders } = require("./data.json");
const { authenticateToken } = require("./auth");
const fs = require("fs");

const app = express();
app.use(express.json());

// static files
app.use(express.static("public"));

app.use(cors({
  origin: "*",
}));
// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});
const upload = multer({ storage });

// Authentication
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password, res);
  const user = admins.find((u) => u.username === username);

  if (!user) return res.status(400).json({ message: "User not found" });

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
    res.json({ message: "Success", data: { token } });
  });
});

// Products Endpoints
app.get("/products", (req, res) => {
  res.json({ message: "Success", data: products });
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Success", data: product });
});

app.post("/products", authenticateToken, upload.single("image"), (req, res) => {
  let { name, category, price, description, stock, rating } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null; // Save image path if file was uploaded

  console.log(`req.body`, req.body);
  price = parseFloat(price);
  stock = parseFloat(stock);
  rating = parseFloat(rating);

  // Validation
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing 'name' field" });
  }
  if (typeof category !== "string" || category.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing 'category' field" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Invalid 'price' field, must be a positive number" });
  }
  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ message: "Invalid or missing 'description' field" });
  }
  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  }
  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({ message: "Invalid 'stock' field, must be a non-negative number" });
  }
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Invalid 'rating' field, must be between 0 and 5" });
  }
  if (products.find((p) => p.name === name)) {
    return res.status(400).json({ message: "Product already exists" });
  }


  // Create new product
  const newProduct = {
    id: products.length + 1, // Automatically assign an ID based on array length
    name,
    category,
    price,
    description,
    image,
    stock,
    rating
  };

  products.push(newProduct);

  JSON.stringify(products, null, 2);

  fs.writeFileSync("./data.json", JSON.stringify({ products, orders, admins }, null, 2));

  res.status(201).json({ message: "Product added successfully", data: newProduct });
});

// Update an existing product
app.patch("/products/:id", authenticateToken, upload.single("image"), (req, res) => {
  const productId = parseInt(req.params.id);
  let product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Extract fields
  const { name, category, price, description, stock, rating } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : product.image;

  // Update product fields
  product = {
    ...product,
    name: name || product.name,
    category: category || product.category,
    price: price ? parseFloat(price) : product.price,
    description: description || product.description,
    image,
    stock: stock ? parseInt(stock) : product.stock,
    rating: rating ? parseFloat(rating) : product.rating
  };

  // Replace product in array and save
  const productIndex = products.findIndex((p) => p.id === productId);
  products[productIndex] = product;

  fs.writeFileSync("./data.json", JSON.stringify({ products, orders, admins }, null, 2));

  res.json({ message: "Product updated successfully", data: product });
});

// Delete a product
app.delete("/products/:id", authenticateToken, (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

  // Remove product from array and save
  products.splice(productIndex, 1);
  fs.writeFileSync("./data.json", JSON.stringify({ products, orders, admins }, null, 2));

  res.json({ message: "Product deleted successfully" });
});


// Orders Endpoints
app.get("/orders", authenticateToken, (req, res) => {
  res.json({ message: "Success", data: orders });
});

app.post("/orders", (req, res) => {
  const { items, address, deliveryDate } = req.body;

  // Validation for 'items'
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid 'items' field, it should be a non-empty array." });
  }

  for (const item of items) {
    if (typeof item.productId !== "number" || !products.find(p => p.id === item.productId)) {
      return res.status(400).json({ message: `Invalid 'productId' in items: ${item.productId} does not exist.` });
    }
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({ message: "Each item 'quantity' should be a positive number." });
    }
  }

  // Validation for 'address'
  if (typeof address !== "string" || address.trim() === "") {
    return res.status(400).json({ message: "Invalid 'address' field, it should be a non-empty string." });
  }

  // Optional validation for 'date' (if provided)
  if (deliveryDate && isNaN(Date.parse(deliveryDate))) {
    return res.status(400).json({ message: "Invalid 'date' field, it should be a valid date string." });
  }

  // Calculate the total order amount
  const total = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    return acc + product.price * item.quantity;
  }, 0)?.toFixed(2);

  // Create new order
  const newOrder = {
    id: orders.length + 1,
    items,
    total,
    status: "Pending",
    address,
    deliveryDate
  };

  orders.push(newOrder);

  // Write updated data to file
  fs.writeFileSync("./data.json", JSON.stringify({ products, orders, admins }, null, 2));

  res.json({ message: "Order placed successfully", data: newOrder });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log error stack trace for debugging
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
