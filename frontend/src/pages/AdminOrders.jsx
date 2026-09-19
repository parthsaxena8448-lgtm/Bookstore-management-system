import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setMessage("");
      setError("");

      await api.put(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Order status updated successfully.");

      await fetchOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "text-bg-success";

      case "Cancelled":
        return "text-bg-danger";

      case "Shipped":
        return "text-bg-info";

      case "Processing":
        return "text-bg-primary";

      default:
        return "text-bg-warning";
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      {/* Header */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <span className="badge text-bg-primary mb-3">
            ADMIN PANEL
          </span>

          <h1 className="display-5 fw-bold">
            Order Management
          </h1>

          <p className="lead text-secondary mb-0">
            View customer orders and manage their status.
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

        {/* Summary */}
        <div className="row g-4 mb-5">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="text-muted small">
                      Total Orders
                    </div>

                    <h2 className="fw-bold mb-0">
                      {orders.length}
                    </h2>
                  </div>

                  <i className="bi bi-box-seam display-5 text-primary"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="text-muted small">
                      Pending
                    </div>

                    <h2 className="fw-bold mb-0">
                      {
                        orders.filter(
                          (order) =>
                            order.status === "Pending"
                        ).length
                      }
                    </h2>
                  </div>

                  <i className="bi bi-clock display-5 text-warning"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="text-muted small">
                      Delivered
                    </div>

                    <h2 className="fw-bold mb-0">
                      {
                        orders.filter(
                          (order) =>
                            order.status === "Delivered"
                        ).length
                      }
                    </h2>
                  </div>

                  <i className="bi bi-check-circle display-5 text-success"></i>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted"></i>

              <h3 className="mt-3">
                No orders found
              </h3>

              <p className="text-muted mb-0">
                Customer orders will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">

            {orders.map((order) => (
              <div
                className="col-lg-6"
                key={order._id}
              >
                <div className="card border-0 shadow-sm h-100">

                  <div className="card-body p-4">

                    {/* Order Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>
                        <div className="text-muted small">
                          Order
                        </div>

                        <h5 className="fw-bold mb-1">
                          #{order._id.slice(-8)}
                        </h5>

                        <div className="text-muted small">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <span
                        className={`badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <hr />

                    {/* Customer */}
                    <div className="mb-4">
                      <div className="text-muted small">
                        Customer
                      </div>

                      <div className="fw-semibold">
                        <i className="bi bi-person me-2"></i>
                        {order.user?.name || "Unknown"}
                      </div>

                      <div className="text-muted small">
                        {order.user?.email}
                      </div>
                    </div>

                    {/* Items */}
                    <h6 className="fw-bold mb-3">
                      Order Items
                    </h6>

                    {order.items.map((item) => (
                      <div
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                        key={item._id}
                      >
                        <div>
                          <div className="fw-semibold">
                            {item.title}
                          </div>

                          <div className="text-muted small">
                            ₹{item.price} × {item.quantity}
                          </div>
                        </div>

                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                      <span className="fw-bold">
                        Total
                      </span>

                      <span className="fs-4 fw-bold text-primary">
                        ₹{order.totalPrice}
                      </span>
                    </div>

                    {/* Payment */}
                    <div className="d-flex justify-content-between mb-4">
                      <span className="text-muted">
                        Payment
                      </span>

                      <span
                        className={`badge ${
                          order.paymentStatus === "Paid"
                            ? "text-bg-success"
                            : "text-bg-secondary"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    {/* Status */}
                    <label className="form-label fw-semibold">
                      Update Order Status
                    </label>

                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminOrders;