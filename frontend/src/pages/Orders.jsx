import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // For now get the latest order.
        // Later we'll add a customer-specific orders endpoint.
        const savedOrderId = localStorage.getItem("lastOrderId");

        if (!savedOrderId) {
          setMessage("No orders found.");
          setLoading(false);
          return;
        }

        const response = await api.get(
          `/orders/${savedOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>My Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Orders</h1>

      {message && <p>{message}</p>}

      {order && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Order ID</h2>
          <p>{order._id}</p>

          <h3>Status: {order.status}</h3>

          <h3>
            Payment Status: {order.paymentStatus}
          </h3>

          <h3>Items</h3>

          {order.items.map((item) => (
            <div
              key={item._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
              }}
            >
              <p>
                <strong>{item.title}</strong>
              </p>

              <p>Price: ₹{item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <p>
                Subtotal: ₹
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <h2>
            Total: ₹{order.totalPrice}
          </h2>
        </div>
      )}
    </div>
  );
}

export default Orders;