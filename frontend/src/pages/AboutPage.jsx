import React from 'react';
import './AboutPage.css';  // Import the CSS file for styling

const AboutPage = () => {
    return (
        <div className="about-container">
            {/* Floating Balls */}
            <div className="ball"></div>
            <div className="ball"></div>
            
            <h2>Who are we</h2>
            <div className="about-content">
                <p>We are a passionate team of professionals dedicated to building integrated solutions for industries. Our goal is to revolutionize the way businesses operate by offering streamlined processes that bring efficiency, scalability, and growth. Our team consists of experts from diverse fields, ensuring we provide solutions that meet a wide range of client needs.</p>
                <p>Our approach is client-centric, focused on understanding unique business challenges and delivering tailored solutions. Whether it’s technology, strategy, or operations, we provide all-in-one support to guide businesses towards success.</p>

                <h3>Our Target As an Integrated System</h3>
                <p>As an integrated system, we aim to harmonize all parts of the business to function seamlessly together. From project initiation to execution, we combine cutting-edge technologies and expertise to bring businesses a unified experience. We believe in a collaborative approach to innovation that drives lasting results.</p>
                <p>Our commitment is not just to deliver solutions but to ensure that our clients continue to thrive long after implementation. We aim to create lasting partnerships through support, optimization, and continuous improvement.</p>
            </div>
        </div>
    );
};

export default AboutPage;
