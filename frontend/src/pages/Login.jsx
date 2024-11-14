import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import IndustryImg from '../assets/IndustryImg.avif'; // Make sure the path is correct
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/auth/login", {
                employeeId,
                password
            });
            localStorage.setItem("token", response.data.token);
            toast.success("Employee has successfully logged in");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Unable to login! Please try again");
        }
    };

    return (
        <div className="login-container">
            <div className="image-container">
                <img src={IndustryImg} alt="Industry" />
            </div>
            <div className="form-container">
                <form onSubmit={submitHandler}>
                    <h1>Welcome! Let's Login</h1>
                    <label htmlFor="employeeId">Employee ID:</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter your Employee ID"
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
