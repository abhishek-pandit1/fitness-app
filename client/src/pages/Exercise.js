import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import Header from "../components/Header";
import cardioIcon from "../assets/images/cardio.png"
import resistanceIcon from "../assets/images/resistance.png"


export default function Exercise() {
  const loggedIn = Auth.loggedIn();
  const navigate = useNavigate()


  // If the user is not logged in, redirect to the login page
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="exercise-page">
      <Header />
      <div className="container">
        <div className="exercise-content">
          <h2 className='title text-center'>Choose Your Exercise</h2>
          <p className="text-center exercise-subtitle">Select the type of workout you'd like to track today</p>
          
          <div className="exercise-cards-container">
            <div className="exercise-card cardio-card">
              <div className="card-content">
                <img alt="cardio" src={cardioIcon} className="exercise-icon mb-3" />
                <h3 className="card-title">Cardio</h3>
                <p className="card-description">Track running, cycling, swimming, and other aerobic exercises</p>
                <button 
                  className='cardio-btn btn-action' 
                  onClick={() => navigate("/exercise/cardio")}
                >
                  Add Cardio
                </button>
              </div>
            </div>
            
            <div className="exercise-card resistance-card">
              <div className="card-content">
                <img alt="resistance" src={resistanceIcon} className="exercise-icon mb-3" />
                <h3 className="card-title">Resistance</h3>
                <p className="card-description">Track weight lifting, bodyweight exercises, and strength training</p>
                <button 
                  className='resistance-btn btn-action' 
                  onClick={() => navigate("/exercise/resistance")}
                >
                  Add Resistance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


