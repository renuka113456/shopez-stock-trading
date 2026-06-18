const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ================= CREATE ORDER =================
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or invalid items",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount is required",
      });
    }

    const order = new Order({
      items,
      totalAmount,
    });

    const savedOrder = await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully 🎉",
      order: savedOrder,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// ================= GET ORDERS =================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;