import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createCardio } from '../utils/API';
import Header from "./Header";
import cardioIcon from "../assets/images/cardio-w.png";

// Cardio exercise types with MET values (Metabolic Equivalent of Task)
const CARDIO_TYPES = [
    { name: "Running", met: 11.5, icon: "🏃" },
    { name: "Jogging", met: 8.0, icon: "🏃‍♂️" },
    { name: "Walking", met: 4.0, icon: "🚶" },
    { name: "Cycling", met: 8.0, icon: "🚴" },
    { name: "Swimming", met: 8.0, icon: "🏊" },
    { name: "Hiking", met: 6.0, icon: "🥾" },
    { name: "Jump Rope", met: 12.3, icon: "⏱️" },
    { name: "Rowing", met: 7.0, icon: "🚣" },
];

// Random cardio exercise tips
const CARDIO_TIPS = [
    "Warm up for 5-10 minutes before intense cardio activities.",
    "Stay hydrated during your workout - drink water before, during, and after.",
    "For weight loss, aim for at least 150 minutes of moderate cardio each week.",
    "Mix high-intensity intervals with lower-intensity recovery periods for efficient fat burning.",
    "Track your heart rate to ensure you're working at the right intensity.",
    "Gradually increase duration and intensity to avoid injury.",
    "Post-workout stretching helps reduce muscle soreness.",
    "Listen to your body - rest if you feel pain beyond normal exertion.",
    "Consistency is more important than intensity when starting a new routine.",
    "Pair cardio with strength training for optimal fitness results."
];

export default function Cardio() {
    const [cardioForm, setCardioForm] = useState({
        name: "",
        distance: "",
        duration: "",
        date: "",
        weight: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [randomTip, setRandomTip] = useState("");
    const [userWeight, setUserWeight] = useState(""); // Changed from 150 to empty string
    const [showCalorieInfo, setShowCalorieInfo] = useState(false);
    const loggedIn = Auth.loggedIn();

    // Set random tip on component mount
    useEffect(() => {
        const tipIndex = Math.floor(Math.random() * CARDIO_TIPS.length);
        setRandomTip(CARDIO_TIPS[tipIndex]);
    }, []);

    // Calculate calories whenever form changes
    useEffect(() => {
        if (cardioForm.name && cardioForm.duration && userWeight) {
            calculateCalories();
        }
    }, [cardioForm.name, cardioForm.duration, userWeight]);

    const handleCardioChange = (event) => {
        const { name, value } = event.target;
        setCardioForm({ ...cardioForm, [name]: value });
    };

    const handleDateChange = date => {
        setStartDate(date);
        handleCardioChange({
            target: { name: "date", value: date }
        });
    };

    const handleWeightChange = (e) => {
        const value = e.target.value;
        setUserWeight(value === "" ? "" : parseFloat(value));
    };

    const calculateCalories = () => {
        // Find the selected exercise's MET value
        const selectedExercise = CARDIO_TYPES.find(type => type.name === cardioForm.name);
        
        if (!selectedExercise || !cardioForm.duration || !userWeight) {
            setCaloriesBurned(0);
            return;
        }
        
        // Formula: Calories = MET × weight(kg) × duration(hours)
        // Weight is already in kg since we're accepting kg input
        const durationInHours = cardioForm.duration / 60;
        
        // Calculate calories
        const calories = selectedExercise.met * userWeight * durationInHours;
        setCaloriesBurned(Math.round(calories));
    };

    const validateForm = (form) => {
        return form.name && form.distance && form.duration && form.date;
    };

    const handleCardioSubmit = async (event) => {
        event.preventDefault();

        //get token
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        // get user id 
        const userId = Auth.getUserId();

        // cardio submit
        if (validateForm(cardioForm)) {
            try {
                // add userid to cardio form
                const dataToSubmit = {
                    ...cardioForm,
                    userId,
                    caloriesBurned
                };

                const response = await createCardio(dataToSubmit, token);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Cardio successfully added!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } catch (err) {
                console.error(err);
            }
        }

        // clear form input
        setCardioForm({
            name: "",
            distance: "",
            duration: "",
            date: ""
        });
    };

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='cardio-page'>
            <Header />
            <div className="container">
                <div className="cardio-content">
                    <h2 className='title text-center text-white'>Track Your Cardio</h2>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="cardio-form-container">
                                <form className='cardio-form-new' onSubmit={handleCardioSubmit}>
                                    <div className='form-header'>
                                        <img alt="cardio" src={cardioIcon} className="exercise-form-icon" />
                                        <h3>Cardio Exercise Details</h3>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Exercise Type:</label>
                                        <select 
                                            name="name" 
                                            className="form-control" 
                                            value={cardioForm.name} 
                                            onChange={handleCardioChange}
                                        >
                                            <option value="">Select an exercise</option>
                                            {CARDIO_TYPES.map((type) => (
                                                <option key={type.name} value={type.name}>
                                                    {type.icon} {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Distance (km):</label>
                                        <input 
                                            type="number" 
                                            name="distance" 
                                            className="form-control" 
                                            placeholder="0.0"
                                            min="0"
                                            step="0.1"
                                            value={cardioForm.distance} 
                                            onChange={handleCardioChange} 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Duration (minutes):</label>
                                        <input 
                                            type="number" 
                                            name="duration" 
                                            className="form-control" 
                                            placeholder="0"
                                            min="0"
                                            value={cardioForm.duration} 
                                            onChange={handleCardioChange} 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <DatePicker 
                                            selected={startDate} 
                                            value={cardioForm.date} 
                                            onChange={handleDateChange} 
                                            placeholderText="mm/dd/yyyy"
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <button 
                                        className='submit-btn cardio-submit-btn' 
                                        type="submit" 
                                        disabled={!validateForm(cardioForm)}
                                    >
                                        Save Exercise
                                    </button>
                                </form>
                                {message && <div className="success-message">{message}</div>}
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="cardio-info-container">
                                <div className="calories-calculator">
                                    <h3 className="info-title">Calories Burned Calculator</h3>
                                    
                                    <div className="weight-input-group">
                                        <label>Your Weight (kg):</label>
                                        <input 
                                            type="number" 
                                            value={userWeight}
                                            onChange={handleWeightChange}
                                            className="form-control weight-input"
                                            min="20"
                                            max="200"
                                            step="0.1"
                                            placeholder="Enter weight in kg"
                                        />
                                    </div>
                                    
                                    {caloriesBurned > 0 && (
                                        <div className="calories-result">
                                            <div className="calories-display">
                                                <span className="calories-number">{caloriesBurned}</span>
                                                <span className="calories-label">calories</span>
                                            </div>
                                            <p className="calories-info">
                                                Estimated calories burned based on your weight, 
                                                exercise duration, and activity type
                                            </p>
                                            <button 
                                                className="info-toggle-btn"
                                                onClick={() => setShowCalorieInfo(!showCalorieInfo)}
                                            >
                                                {showCalorieInfo ? 'Hide Details' : 'How is this calculated?'}
                                            </button>
                                            
                                            {showCalorieInfo && (
                                                <div className="calorie-info-box">
                                                    <p>This calculation uses the MET (Metabolic Equivalent of Task) formula:</p>
                                                    <p><strong>Calories = MET × Weight(kg) × Duration(hrs)</strong></p>
                                                    <p>MET values vary by exercise intensity:</p>
                                                    <ul>
                                                        <li>Running: 11.5 METs</li>
                                                        <li>Cycling: 8.0 METs</li>
                                                        <li>Walking: 4.0 METs</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="cardio-tip">
                                    <h4>💡 Pro Tip</h4>
                                    <p>{randomTip}</p>
                                </div>
                                
                                <div className="cardio-suggestion">
                                    <h4>📊 Suggested Cardio Plan</h4>
                                    {cardioForm.name ? (
                                        <div className="suggestion-content">
                                            <p>For <strong>{cardioForm.name}</strong>, try this plan for optimal results:</p>
                                            <ul>
                                                <li>Beginners: 15-20 minutes, 2-3 times per week</li>
                                                <li>Intermediate: 30 minutes, 3-4 times per week</li>
                                                <li>Advanced: 45+ minutes, 4-5 times per week</li>
                                            </ul>
                                            <p>Always include a 5-minute warm-up and cool-down!</p>
                                        </div>
                                    ) : (
                                        <p>Select an exercise type to see a suggested workout plan</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
