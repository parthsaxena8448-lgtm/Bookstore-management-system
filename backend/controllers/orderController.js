const Order = require("../models/Order");
const Book = require("../models/Book");

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required"
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const book = await Book.findById(item.book);

            if (!book) {
                return res.status(404).json({
                    message: `Book not found: ${item.book}`
                });
            }

            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1"
                });
            }

            if (book.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${book.title}`
                });
            }

            totalPrice += book.price * item.quantity;

            orderItems.push({
                book: book._id,
                title: book.title,
                price: book.price,
                quantity: item.quantity
            });

            book.stock -= item.quantity;
            await book.save();
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalPrice
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.book", "title author price");

        res.status(201).json({
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// GET ALL ORDERS - ADMIN
// ===============================
const getOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.book", "title author price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            page,
            limit,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// GET ORDER BY ID
// ===============================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.book", "title author price");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            order.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You are not allowed to view this order"
            });
        }

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// UPDATE ORDER STATUS - ADMIN
// ===============================
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.book", "title author price");

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
};