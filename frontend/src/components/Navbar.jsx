import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">

        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center"
        >
          <i className="bi bi-book-half me-2"></i>
          BookStore
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/books">
                <i className="bi bi-grid me-1"></i>
                Books
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <i className="bi bi-cart3 me-1"></i>
                Cart
              </Link>
            </li>

            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  <i className="bi bi-box-seam me-1"></i>
                  My Orders
                </Link>
              </li>
            )}

            {user?.role === "admin" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/admin"
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Admin
                </Link>
              </li>
            )}

          </ul>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2">

            {token && user ? (
              <>
                <span className="text-white small me-2">
                  <i className="bi bi-person-circle me-1"></i>
                  Hi, {user.name}
                </span>

                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;