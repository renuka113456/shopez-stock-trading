const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 ShopEZ Backend is running successfully",
  });
});

// ================= PRODUCTS ROUTES =================
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ================= ORDERS ROUTES =================
app.use("/api/orders", orderRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});