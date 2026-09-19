import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      const response = await api.post("/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // After registration, go to Home page
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">

            <div className="text-center mb-4">
              <div className="display-4">📚</div>

              <h1 className="fw-bold mt-2">
                Create Account
              </h1>

              <p className="text-muted">
                Join BookStore and start discovering great books.
              </p>
            </div>

            <div className="card border-0 shadow-lg">
              <div className="card-body p-4 p-lg-5">

                {message && (
                  <div className="alert alert-danger">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />

                    <div className="form-text">
                      Password must be at least 6 characters.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>

                </form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none"
                  >
                    Login
                  </Link>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;