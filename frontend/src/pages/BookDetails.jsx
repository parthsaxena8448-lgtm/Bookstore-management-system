import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getBook = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/books/${id}`);

        setBook(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load book"
        );
      } finally {
        setLoading(false);
      }
    };

    getBook();
  }, [id]);

  const addToCart = () => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
      (item) => item.book === book._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        book: book._id,
        title: book.title,
        price: book.price,
        imageUrl: book.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">
            Loading book...
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="alert alert-danger">
            {message}
          </div>

          <Link
            to="/books"
            className="btn btn-primary"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5 text-center">
          <h2>Book not found</h2>

          <Link
            to="/books"
            className="btn btn-primary mt-3"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const coverImage = `https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`;

  return (
    <div className="bg-light min-vh-100">

      <div className="container py-5">

        {/* Back Button */}
        <Link
          to="/books"
          className="btn btn-outline-secondary mb-4"
        >
          ← Back to Books
        </Link>

        {/* Main Card */}
        <div className="card border-0 shadow-sm overflow-hidden">

          <div className="row g-0">

            {/* Book Cover */}
            <div className="col-md-5 bg-white">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  minHeight: "550px",
                  padding: "30px",
                }}
              >
                <img
                  src={coverImage}
                  alt={book.title}
                  className="img-fluid"
                  style={{
                    maxHeight: "500px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";

                    const fallback =
                      e.currentTarget.parentElement;

                    fallback.innerHTML = `
                      <div class="text-center text-secondary">
                        <div style="font-size: 100px;">
                          📚
                        </div>

                        <h4 class="mt-3">
                          ${book.title}
                        </h4>

                        <p class="mb-0">
                          Book cover unavailable
                        </p>
                      </div>
                    `;
                  }}
                />
              </div>

            </div>

            {/* Book Information */}
            <div className="col-md-7">

              <div className="card-body p-4 p-lg-5">

                {/* Genre */}
                <span className="badge text-bg-primary mb-3">
                  {book.genre}
                </span>

                {/* Title */}
                <h1 className="display-5 fw-bold mb-2">
                  {book.title}
                </h1>

                {/* Author */}
                <p className="fs-5 text-muted mb-4">
                  by {book.author}
                </p>

                {/* Price */}
                <h2 className="display-6 fw-bold text-primary mb-4">
                  ₹{book.price}
                </h2>

                {/* Description */}
                <h5 className="fw-bold">
                  Description
                </h5>

                <p className="text-secondary lh-lg">
                  {book.description}
                </p>

                <hr className="my-4" />

                {/* Details */}
                <div className="row">

                  <div className="col-sm-6 mb-4">
                    <div className="text-muted small">
                      ISBN
                    </div>

                    <div className="fw-semibold">
                      {book.ISBN}
                    </div>
                  </div>

                  <div className="col-sm-6 mb-4">
                    <div className="text-muted small">
                      Availability
                    </div>

                    <div>
                      {book.stock > 0 ? (
                        <span className="badge text-bg-success">
                          {book.stock} available
                        </span>
                      ) : (
                        <span className="badge text-bg-danger">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Add to Cart */}
                <button
                  className="btn btn-primary btn-lg w-100 py-3"
                  onClick={addToCart}
                  disabled={book.stock === 0}
                >
                  {book.stock > 0
                    ? "🛒 Add to Cart"
                    : "Out of Stock"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default BookDetails;