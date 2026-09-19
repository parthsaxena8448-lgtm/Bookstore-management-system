import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedBooks = async () => {
      try {
        const response = await api.get("/books", {
          params: {
            page: 1,
            limit: 3,
          },
        });

        setBooks(response.data.books);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedBooks();
  }, []);

  const getBookImage = (book) => {
    return `https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`;
  };

  return (
    <div className="bg-light">

      {/* Hero */}
      <section className="bg-dark text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-lg-7">
              <span className="badge text-bg-primary mb-3">
                WELCOME TO BOOKSTORE
              </span>

              <h1 className="display-3 fw-bold mb-3">
                Discover Your Next Great Read
              </h1>

              <p className="lead text-secondary mb-4">
                Explore our collection of books, find your
                favourites, and order them from the comfort
                of your home.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/books"
                  className="btn btn-primary btn-lg px-4"
                >
                  Browse Books
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-5 mt-lg-0">
              <div
                className="bg-white bg-opacity-10 rounded-4 p-5"
              >
                <i
                  className="bi bi-book-half"
                  style={{ fontSize: "140px" }}
                ></i>

                <h3 className="fw-bold mt-3">
                  Read. Discover. Enjoy.
                </h3>

                <p className="text-secondary mb-0">
                  Your online bookstore
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <span className="text-primary fw-semibold">
              WHY BOOKSTORE?
            </span>

            <h2 className="fw-bold mt-2">
              Everything You Need
            </h2>

            <p className="text-muted">
              A simple and convenient way to discover and
              order books.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-primary-subtle text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-search fs-3"></i>
                  </div>

                  <h4 className="fw-bold">
                    Easy Discovery
                  </h4>

                  <p className="text-muted mb-0">
                    Search books by title, author, or genre
                    and quickly find what you're looking for.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-success-subtle text-success rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-cart3 fs-3"></i>
                  </div>

                  <h4 className="fw-bold">
                    Easy Shopping
                  </h4>

                  <p className="text-muted mb-0">
                    Add books to your cart and complete your
                    order in just a few clicks.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-warning-subtle text-warning rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-box-seam fs-3"></i>
                  </div>

                  <h4 className="fw-bold">
                    Track Orders
                  </h4>

                  <p className="text-muted mb-0">
                    Check your orders and follow their status
                    from pending to delivered.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-5 bg-white">
        <div className="container">

          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-semibold">
                OUR COLLECTION
              </span>

              <h2 className="fw-bold mt-2 mb-1">
                Featured Books
              </h2>

              <p className="text-muted mb-0">
                Explore some of our latest books.
              </p>
            </div>

            <Link
              to="/books"
              className="btn btn-outline-dark"
            >
              View All
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-book display-3 text-muted"></i>

              <h4 className="mt-3">
                No books available yet
              </h4>

              <p className="text-muted">
                Check back soon for new books.
              </p>
            </div>
          ) : (
            <div className="row g-4">

              {books.map((book) => (
                <div
                  className="col-md-6 col-lg-4"
                  key={book._id}
                >
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">

                    <div
                      className="bg-light text-center"
                      style={{ height: "320px" }}
                    >
                      <img
                        src={getBookImage(book)}
                        alt={book.title}
                        className="w-100 h-100"
                        style={{
                          objectFit: "contain",
                          padding: "20px",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          e.currentTarget.parentElement.innerHTML = `
                            <div class="h-100 d-flex flex-column align-items-center justify-content-center text-secondary">
                              <i class="bi bi-book display-1"></i>
                              <span class="mt-2 fw-semibold">
                                ${book.title}
                              </span>
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

                      <p className="text-muted">
                        by {book.author}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-4 fw-bold">
                          ₹{book.price}
                        </span>

                        <Link
                          to={`/books/${book._id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <div className="bg-primary text-white rounded-4 p-5 text-center">
            <i className="bi bi-book-half display-3"></i>

            <h2 className="fw-bold mt-3">
              Ready to Find Your Next Book?
            </h2>

            <p className="lead mb-4">
              Browse our complete collection today.
            </p>

            <Link
              to="/books"
              className="btn btn-light btn-lg px-4"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">
              <h5 className="fw-bold mb-1">
                <i className="bi bi-book-half me-2"></i>
                BookStore
              </h5>

              <p className="text-secondary mb-0">
                Your place to discover great books.
              </p>
            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <Link
                to="/books"
                className="text-white me-3"
              >
                Books
              </Link>

              <Link
                to="/cart"
                className="text-white me-3"
              >
                Cart
              </Link>

              <Link
                to="/login"
                className="text-white"
              >
                Login
              </Link>
            </div>

          </div>

          <hr className="border-secondary my-4" />

          <p className="text-secondary text-center mb-0 small">
            © 2026 BookStore. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;