import React from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth"
import Container from "react-bootstrap/Container";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn()

  return (
    <div className="homepage">
      <Header />
      <Container className="home d-flex flex-column align-items-center justify-content-center text-center">
        <h1 className="home-title">Transform Your Fitness Journey</h1>
        <p className="home-text">
          Track, analyze, and improve your workouts with our comprehensive fitness tracking platform. 
          Whether you're into cardio or strength training, we've got you covered.
        </p>
        
        <div className="home-features">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3>Goal Setting</h3>
            <p className="feature-text">Set and track your fitness goals with precision</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p className="feature-text">Detailed insights into your progress</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔄</div>
            <h3>Workouts</h3>
            <p className="feature-text">Track both cardio and resistance training</p>
          </div>
        </div>

        {loggedIn ? (
          <button 
            className="home-btn" 
            onClick={() => navigate("/exercise")}
          >
            Start Workout
          </button>
        ) : (
          <button 
            className="home-btn" 
            onClick={() => navigate("/signup")}
          >
            Get Started Free
          </button>
        )}
      </Container>
    </div>
  );
}
