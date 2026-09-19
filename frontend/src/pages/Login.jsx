import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

      const response = await api.post("/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // After login, go to Home page
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
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
                Welcome Back
              </h1>

              <p className="text-muted">
                Login to continue shopping for your favourite books.
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                </form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                  >
                    Create an account
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

export default Login;