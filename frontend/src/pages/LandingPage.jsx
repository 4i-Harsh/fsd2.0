import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">InternHub</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Welcome to InternHub</h1>
          <p>Your gateway to meaningful internships and professional growth</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
      </main>

      <section id="features" className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>For Students</h3>
            <p>Find the perfect internship opportunity to kickstart your career</p>
          </div>
          <div className="feature-card">
            <h3>For Teachers</h3>
            <p>Guide and mentor students in their professional journey</p>
          </div>
          <div className="feature-card">
            <h3>For Management</h3>
            <p>Manage and oversee the internship program effectively</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 