import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;

    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter(
      (_, i) => i !== index
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">
              Shopping Cart
            </h1>

            <p className="text-muted mb-0">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <Link
            to="/books"
            className="btn btn-outline-dark"
          >
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="display-1 mb-3">
                🛒
              </div>

              <h2>Your cart is empty</h2>

              <p className="text-muted">
                Add some books to your cart and come back here.
              </p>

              <Link
                to="/books"
                className="btn btn-primary mt-2"
              >
                Browse Books
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">

            {/* Cart Items */}
            <div className="col-lg-8">

              {cart.map((item, index) => (
                <div
                  className="card border-0 shadow-sm mb-3"
                  key={item.book}
                >
                  <div className="card-body p-4">
                    <div className="row align-items-center">

                      {/* Image */}
                      <div className="col-md-2 mb-3 mb-md-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="img-fluid rounded"
                            style={{
                              height: "110px",
                              width: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-secondary-subtle rounded d-flex align-items-center justify-content-center"
                            style={{
                              height: "110px",
                              width: "80px",
                            }}
                          >
                            <span>📚</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="col-md-4 mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1">
                          {item.title}
                        </h5>

                        <p className="text-muted mb-0">
                          ₹{item.price} each
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-3 mb-3 mb-md-0">
                        <label className="form-label text-muted small">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              index,
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      {/* Price + Remove */}
                      <div className="col-md-3 text-md-end">
                        <h5 className="fw-bold">
                          ₹{item.price * item.quantity}
                        </h5>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            removeFromCart(index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline-danger"
                onClick={clearCart}
              >
                Clear Cart
              </button>

            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">

                  <h3 className="fw-bold mb-4">
                    Order Summary
                  </h3>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">
                      Items
                    </span>

                    <span>{totalItems}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">
                      Subtotal
                    </span>

                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">
                      Shipping
                    </span>

                    <span className="text-success">
                      Free
                    </span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">
                      Total
                    </span>

                    <span className="fw-bold fs-4">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={() =>
                      navigate("/checkout")
                    }
                  >
                    Proceed to Checkout
                  </button>

                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;