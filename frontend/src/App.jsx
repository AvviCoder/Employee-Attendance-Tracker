import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'; // Import the CSS file for styling
import Homepage from "./pages/Homepage";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage";
const App = () => {
  return (
  
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage/>}/>
        </Routes>
        <ToastContainer />
      </div>
   
  );
};

export default App;
