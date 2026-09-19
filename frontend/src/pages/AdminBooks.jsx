import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  title: "",
  author: "",
  price: "",
  genre: "",
  stock: "",
  ISBN: "",
  description: "",
  imageUrl: "",
};

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books", {
        params: {
          page: 1,
          limit: 50,
        },
      });

      setBooks(response.data.books || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load books"
      );
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      if (editingId) {
        await api.put(
          `/books/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Book updated successfully.");
      } else {
        await api.post(
          "/books",
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Book added successfully.");
      }

      setFormData(emptyForm);
      setEditingId(null);

      await fetchBooks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const editBook = (book) => {
    setEditingId(book._id);

    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      genre: book.genre,
      stock: book.stock,
      ISBN: book.ISBN,
      description: book.description,
      imageUrl: book.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteBook = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Book deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }

      await fetchBooks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete book"
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
    setError("");
  };

  return (
    <div className="bg-light min-vh-100">
      <section className="bg-dark text-white py-5">
        <div className="container">
          <span className="badge text-bg-primary mb-3">
            ADMIN PANEL
          </span>

          <h1 className="display-5 fw-bold">
            Book Management
          </h1>

          <p className="text-secondary lead mb-0">
            Add, edit and manage your bookstore inventory.
          </p>
        </div>
      </section>

      <div className="container py-5">

        {message && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle me-2"></i>
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Form */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4 p-lg-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold mb-1">
                  {editingId
                    ? "Edit Book"
                    : "Add New Book"}
                </h3>

                <p className="text-muted mb-0">
                  {editingId
                    ? "Update the selected book."
                    : "Add a new book to your inventory."}
                </p>
              </div>

              {editingId && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Book title"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Author
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Price
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      ₹
                    </span>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Genre
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="Fiction"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Stock
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    ISBN
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="ISBN"
                    value={formData.ISBN}
                    onChange={handleChange}
                    placeholder="ISBN number"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Image URL
                  </label>

                  <input
                    type="url"
                    className="form-control"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Optional image URL"
                  />

                  <div className="form-text">
                    The store can use the ISBN for book covers.
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter book description"
                    required
                  />
                </div>

              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                >
                  <i
                    className={`bi ${
                      editingId
                        ? "bi-pencil-square"
                        : "bi-plus-circle"
                    } me-2`}
                  ></i>

                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Book"
                    : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Books */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Inventory
            </h2>

            <p className="text-muted mb-0">
              {books.length} book
              {books.length !== 1 ? "s" : ""} in inventory
            </p>
          </div>
        </div>

        <div className="row g-4">
          {books.map((book) => (
            <div
              className="col-md-6 col-lg-4"
              key={book._id}
            >
              <div className="card border-0 shadow-sm h-100">

                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "240px" }}
                >
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`}
                    alt={book.title}
                    className="h-100 w-100"
                    style={{
                      objectFit: "contain",
                      padding: "20px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";

                      e.currentTarget.parentElement.innerHTML = `
                        <div class="text-center text-secondary">
                          <i class="bi bi-book display-4"></i>
                          <div class="fw-semibold mt-2">
                            ${book.title}
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>

                <div className="card-body p-4">

                  <span className="badge text-bg-primary mb-2">
                    {book.genre}
                  </span>

                  <h4 className="fw-bold">
                    {book.title}
                  </h4>

                  <p className="text-muted mb-3">
                    by {book.author}
                  </p>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Price</span>
                    <strong>₹{book.price}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <span>Stock</span>

                    <span
                      className={`badge ${
                        book.stock > 0
                          ? "text-bg-success"
                          : "text-bg-danger"
                      }`}
                    >
                      {book.stock}
                    </span>
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={() => editBook(book)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger flex-fill"
                      onClick={() =>
                        deleteBook(book._id)
                      }
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminBooks;