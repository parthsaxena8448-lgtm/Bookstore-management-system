import { Link } from "react-router-dom";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge text-bg-primary mb-3">
                ADMIN PANEL
              </span>

              <h1 className="display-5 fw-bold">
                Admin Dashboard
              </h1>

              <p className="lead text-secondary mb-0">
                Manage books, inventory and customer orders.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-4 mt-md-0">
              <div className="bg-white text-dark rounded-4 p-3 shadow-sm d-inline-block">
                <div className="small text-muted">
                  Logged in as
                </div>

                <div className="fw-bold">
                  {user?.name}
                </div>

                <span className="badge text-bg-dark mt-1">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div className="container py-5">

        {/* Stats */}
        <div className="row g-4 mb-5">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">
                      Books
                    </p>

                    <h2 className="fw-bold mb-0">
                      📚
                    </h2>
                  </div>

                  <div className="display-6">
                    📚
                  </div>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Manage your bookstore inventory
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">
                      Orders
                    </p>

                    <h2 className="fw-bold mb-0">
                      📦
                    </h2>
                  </div>

                  <div className="display-6">
                    📦
                  </div>
                </div>

                <p className="text-muted mt-3 mb-0">
                  View and manage customer orders
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">
                      Role
                    </p>

                    <h4 className="fw-bold mb-0">
                      Admin
                    </h4>
                  </div>

                  <div className="display-6">
                    👨‍💼
                  </div>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Full access to management features
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Management */}
        <div className="mb-4">
          <h2 className="fw-bold">
            Management
          </h2>

          <p className="text-muted">
            Choose what you would like to manage.
          </p>
        </div>

        <div className="row g-4">

          {/* Books */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 p-lg-5">

                <div className="display-4 mb-3">
                  📚
                </div>

                <h3 className="fw-bold">
                  Book Management
                </h3>

                <p className="text-muted">
                  Add new books, update existing books,
                  manage prices, stock and remove books.
                </p>

                <Link
                  to="/admin/books"
                  className="btn btn-primary"
                >
                  Manage Books →
                </Link>

              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 p-lg-5">

                <div className="display-4 mb-3">
                  📦
                </div>

                <h3 className="fw-bold">
                  Order Management
                </h3>

                <p className="text-muted">
                  View customer orders and update order
                  status from pending to delivered.
                </p>

                <Link
                  to="/admin/orders"
                  className="btn btn-dark"
                >
                  Manage Orders →
                </Link>

              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="card border-0 shadow-sm mt-5">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-3">
              Quick Actions
            </h4>

            <div className="d-flex flex-wrap gap-2">

              <Link
                to="/admin/books"
                className="btn btn-outline-primary"
              >
                + Add Book
              </Link>

              <Link
                to="/admin/orders"
                className="btn btn-outline-dark"
              >
                View Orders
              </Link>

              <Link
                to="/books"
                className="btn btn-outline-secondary"
              >
                View Store
              </Link>

            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1 fw-semibold">
            📚 BookStore Admin
          </p>

          <small className="text-secondary">
            Bookstore Management System
          </small>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;