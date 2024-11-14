// Navbar.js
import React from 'react';
import Logo from "../assets/logo.jpeg"; // Make sure the logo path and file extension are correct
import "./Navbar.css"
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/"> <img src={Logo} alt="Company Logo" /></a>
       
      </div>
      <ul className="navbar-links">
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/about">About Us</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
