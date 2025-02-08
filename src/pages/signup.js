import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./auth.css"; // Import CSS file

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/signup", formData);
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;
