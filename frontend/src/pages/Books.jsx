import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getBooks = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/books", {
        params: {
          search,
          genre,
          page,
          limit: 6,
        },
      });

      setBooks(response.data.books);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, [search, genre, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleGenre = (e) => {
    setGenre(e.target.value);
    setPage(1);
  };

  const getBookImage = (book) => {
    return `https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`;
  };

  return (
    <div className="bg-light min-vh-100">

      {/* Header */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">
            Our Books
          </h1>

          <p className="lead text-secondary mb-0">
            Explore our collection and find your next great read.
          </p>
        </div>
      </section>

      <div className="container py-5">

        {/* Search */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <div className="row g-3">

              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Search Books
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Genre
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="e.g. Fiction"
                  value={genre}
                  onChange={handleGenre}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="text-muted mt-3">
              Loading books...
            </p>
          </div>
        )}

        {/* Error */}
        {message && !loading && (
          <div className="alert alert-danger">
            {message}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          books.length === 0 &&
          !message && (
            <div className="text-center py-5">
              <div className="display-1">
                📚
              </div>

              <h3 className="mt-3">
                No books found
              </h3>

              <p className="text-muted">
                Try a different search or genre.
              </p>
            </div>
          )}

        {/* Books */}
        {!loading && books.length > 0 && (
          <div className="row g-4">

            {books.map((book) => (
              <div
                className="col-sm-6 col-lg-4"
                key={book._id}
              >

                <div className="card h-100 border-0 shadow-sm overflow-hidden">

                  {/* Book Image */}
                  <div
                    className="bg-light text-center"
                    style={{
                      height: "360px",
                    }}
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
                            <div style="font-size: 70px;">📚</div>
                            <div class="fw-semibold">${book.title}</div>
                          </div>
                        `;
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div className="card-body p-4 d-flex flex-column">

                    <span className="badge text-bg-primary align-self-start mb-2">
                      {book.genre}
                    </span>

                    <h4 className="fw-bold">
                      {book.title}
                    </h4>

                    <p className="text-muted mb-2">
                      by {book.author}
                    </p>

                    <p className="text-muted small">
                      {book.description?.length > 100
                        ? `${book.description.substring(
                            0,
                            100
                          )}...`
                        : book.description}
                    </p>

                    <div className="mt-auto">

                      <div className="d-flex justify-content-between align-items-center mb-3">

                        <span className="fs-4 fw-bold text-dark">
                          ₹{book.price}
                        </span>

                        {book.stock > 0 ? (
                          <span className="badge text-bg-success">
                            {book.stock} in stock
                          </span>
                        ) : (
                          <span className="badge text-bg-danger">
                            Out of stock
                          </span>
                        )}

                      </div>

                      <Link
                        to={`/books/${book._id}`}
                        className="btn btn-primary w-100"
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav className="mt-5">
            <ul className="pagination justify-content-center">

              <li
                className={`page-item ${
                  page === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
              </li>

              <li className="page-item active">
                <span className="page-link">
                  {page}
                </span>
              </li>

              <li
                className={`page-item ${
                  page === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </li>

            </ul>
          </nav>
        )}

      </div>
    </div>
  );
}

export default Books;