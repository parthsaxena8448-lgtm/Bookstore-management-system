const Book = require("../models/Book");

// ===============================
// GET ALL BOOKS
// SEARCH + PAGINATION
// ===============================
const getBooks = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const { search, genre, author } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }

        if (genre) {
            query.genre = {
                $regex: genre,
                $options: "i"
            };
        }

        if (author) {
            query.author = {
                $regex: author,
                $options: "i"
            };
        }

        const books = await Book.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(query);

        res.status(200).json({
            page,
            limit,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            books
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// GET BOOK BY ID
// ===============================
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({
            message: "Invalid book ID"
        });
    }
};


// ===============================
// CREATE BOOK
// ===============================
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            price,
            genre,
            stock,
            ISBN,
            description,
            imageUrl
        } = req.body;

        if (
            !title ||
            !author ||
            price === undefined ||
            !genre ||
            stock === undefined ||
            !ISBN ||
            !description
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const existingBook = await Book.findOne({ ISBN });

        if (existingBook) {
            return res.status(400).json({
                message: "Book with this ISBN already exists"
            });
        }

        const book = await Book.create({
            title,
            author,
            price,
            genre,
            stock,
            ISBN,
            description,
            imageUrl
        });

        res.status(201).json({
            message: "Book created successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// UPDATE BOOK
// ===============================
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// DELETE BOOK
// ===============================
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};