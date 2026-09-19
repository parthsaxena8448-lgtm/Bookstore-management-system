import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (cart.length === 0) {
        setMessage("Your cart is empty");
        return;
      }

      setLoading(true);
      setMessage("");

      const items = cart.map((item) => ({
        book: item.book,
        quantity: item.quantity,
      }));

      const response = await api.post(
        "/orders",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("cart");

      localStorage.setItem(
        "lastOrderId",
        response.data.order._id
      );

      navigate("/orders");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        <h1 className="fw-bold mb-4">
          Checkout
        </h1>

        {message && (
          <div className="alert alert-danger">
            {message}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  Order Items
                </h3>

                {cart.map((item) => (
                  <div
                    className="d-flex justify-content-between border-bottom py-3"
                    key={item.book}
                  >
                    <div>
                      <h5 className="mb-1">
                        {item.title}
                      </h5>

                      <p className="text-muted mb-0">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  Order Summary
                </h3>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span className="text-success">
                    Free
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong className="fs-4">
                    ₹{totalPrice}
                  </strong>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;