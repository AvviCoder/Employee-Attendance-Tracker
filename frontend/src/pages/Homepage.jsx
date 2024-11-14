import React from 'react';
import './Homepage.css'; // Import the CSS file for styling

const Homepage = () => {
    return (
        <div className="homepage-container">
            <h1>Welcome to Our Employee <br/> Attendance Tracker</h1>
            
            <button>
                <a href="/about">Learn More</a></button>
        </div>
    );
};

export default Homepage;
