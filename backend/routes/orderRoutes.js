const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/", protect, admin, getOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;