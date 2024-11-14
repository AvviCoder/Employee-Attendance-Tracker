import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';
import IndustryImg from '../assets/IndustryImg.avif'; // Ensure the image path is correct
import './Register.css'; // Import the CSS file for styling

const Register = () => {
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/auth/register", {
                name,
                employeeId,
                role,
                password
            });

            const registeredEmployeeId = res.data.employee.employeeId.$oid || res.data.employee.employeeId;
            localStorage.setItem('employeeId', registeredEmployeeId);

            toast.success("Registration done successfully! You can log in now");
            navigate("/login");
        } catch (error) {
            toast.error("Error occurred while Registration");
            console.log(error);
        }
    };

    return (
        <div className="register-container">
            <div className="image-container">
                <img src={IndustryImg} alt="Industry" />
            </div>
            <div className="form-container">
                <form onSubmit={submitHandler}>
                    <h1>Welcome! Let's Register</h1>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter your Name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="employeeId">Employee ID:</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter your Employee ID"
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />

                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter your Role"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your Password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
