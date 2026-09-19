const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Bookstore API Running"
    });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});