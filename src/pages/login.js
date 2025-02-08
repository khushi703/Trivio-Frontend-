import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./auth.css"; // Import CSS file

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    // Google Login Handler
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="container">
            <div className="form-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">Login</button>
                </form>
                <button className="google-btn" onClick={handleGoogleLogin}>
                    <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" />
                    Login with Google
                </button>
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    );
};

export default Login;
