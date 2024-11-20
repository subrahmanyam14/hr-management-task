import React, { useState } from "react";
import "../styles/LoginPage.css"; // Import your custom CSS file
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize the navigate function
 

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as user types
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
      if (res.status === 200) {
        // login({ username: formData.username, token: res.data.token });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", formData.username);
        toast.success("Logged in successfully!", { position: "top-center"});
        // Delay and navigate to home after 5 seconds
        setTimeout(() => {
          navigate("/");
        }, 5000);

        setFormData({ username: "", password: "" });
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.", { position: "top-center"});
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "User Name is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
