import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createResistance } from '../utils/API';
import Header from "./Header";
import resistanceIcon from "../assets/images/resistance-w.png";

// Resistance exercise types organized by muscle group
const MUSCLE_GROUPS = [
    {
        name: "Chest",
        exercises: [
            { name: "Bench Press", icon: "🏋️", intensity: 3 },
            { name: "Push-Up", icon: "💪", intensity: 2.5 },
            { name: "Chest Fly", icon: "🦅", intensity: 2.8 },
            { name: "Dumbbell Press", icon: "🏋️‍♂️", intensity: 3 }
        ]
    },
    {
        name: "Back",
        exercises: [
            { name: "Pull-Up", icon: "🧗‍♂️", intensity: 3.3 },
            { name: "Bent-Over Row", icon: "🏋️‍♀️", intensity: 3 },
            { name: "Lat Pulldown", icon: "⬇️", intensity: 2.8 },
            { name: "Deadlift", icon: "🏋️", intensity: 3.5 }
        ]
    },
    {
        name: "Legs",
        exercises: [
            { name: "Squat", icon: "🏋️‍♀️", intensity: 3.5 },
            { name: "Leg Press", icon: "🦵", intensity: 3.2 },
            { name: "Lunge", icon: "🚶‍♂️", intensity: 3 },
            { name: "Leg Extension", icon: "🦿", intensity: 2.7 }
        ]
    },
    {
        name: "Arms",
        exercises: [
            { name: "Bicep Curl", icon: "💪", intensity: 2.5 },
            { name: "Tricep Extension", icon: "🦾", intensity: 2.5 },
            { name: "Hammer Curl", icon: "🔨", intensity: 2.5 },
            { name: "Skull Crusher", icon: "☠️", intensity: 2.7 }
        ]
    },
    {
        name: "Shoulders",
        exercises: [
            { name: "Shoulder Press", icon: "🏋️‍♀️", intensity: 3 },
            { name: "Lateral Raise", icon: "🦅", intensity: 2.6 },
            { name: "Front Raise", icon: "⬆️", intensity: 2.6 },
            { name: "Upright Row", icon: "🏋️", intensity: 2.8 }
        ]
    },
    {
        name: "Core",
        exercises: [
            { name: "Plank", icon: "🧘‍♂️", intensity: 2.5 },
            { name: "Crunch", icon: "🧍‍♂️", intensity: 2.3 },
            { name: "Russian Twist", icon: "🔄", intensity: 2.5 },
            { name: "Leg Raise", icon: "🦿", intensity: 2.5 }
        ]
    }
];

// Resistance training tips
const RESISTANCE_TIPS = [
    "Prioritize proper form over heavier weights to prevent injury.",
    "Rest 48-72 hours between training the same muscle group.",
    "Aim for 8-12 reps for muscle growth, 4-6 reps for strength, and 12+ for endurance.",
    "Progressive overload is key - gradually increase weight, reps, or sets over time.",
    "Stay hydrated during your workout to maintain performance.",
    "Breathe out during the exertion phase (lifting) and in during the relaxation phase.",
    "Compound exercises (like squats and deadlifts) give you more bang for your buck.",
    "Consider tracking your one-rep max (1RM) for key lifts to measure progress.",
    "Allow for 1-2 minutes rest between sets for optimal recovery.",
    "Include both pushing and pulling exercises for balanced muscle development."
];

export default function Resistance() {
    const [resistanceForm, setResistanceForm] = useState({
        name: "",
        weight: "",
        sets: "",
        reps: "",
        date: "",
        muscleGroup: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [randomTip, setRandomTip] = useState("");
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [userWeight, setUserWeight] = useState(150); // Default user weight in pounds
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [showCalorieInfo, setShowCalorieInfo] = useState(false);
    const loggedIn = Auth.loggedIn();

    // Set random tip on component mount
    useEffect(() => {
        const tipIndex = Math.floor(Math.random() * RESISTANCE_TIPS.length);
        setRandomTip(RESISTANCE_TIPS[tipIndex]);
    }, []);

    // Update exercise options when muscle group changes
    useEffect(() => {
        if (selectedMuscleGroup) {
            const group = MUSCLE_GROUPS.find(g => g.name === selectedMuscleGroup);
            if (group) {
                setExerciseOptions(group.exercises);
            }
        } else {
            setExerciseOptions([]);
        }
    }, [selectedMuscleGroup]);

    // Calculate calories whenever form changes
    useEffect(() => {
        if (resistanceForm.name && resistanceForm.weight && resistanceForm.sets && resistanceForm.reps) {
            calculateCalories();
        }
    }, [resistanceForm.name, resistanceForm.weight, resistanceForm.sets, resistanceForm.reps, userWeight]);

    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        });
    };

    const handleResistanceChange = (event) => {
        const { name, value } = event.target;
        setResistanceForm({ ...resistanceForm, [name]: value });
    };

    const handleMuscleGroupChange = (event) => {
        const group = event.target.value;
        setSelectedMuscleGroup(group);
        setResistanceForm({ 
            ...resistanceForm, 
            muscleGroup: group,
            name: "" // Reset exercise name when muscle group changes
        });
    };

    const handleWeightChange = (e) => {
        const weight = parseInt(e.target.value) || 0;
        setUserWeight(weight);
    };

    const calculateCalories = () => {
        // Find selected exercise's intensity
        let intensity = 2.5; // Default intensity factor
        
        if (resistanceForm.name) {
            for (const group of MUSCLE_GROUPS) {
                const exercise = group.exercises.find(ex => ex.name === resistanceForm.name);
                if (exercise) {
                    intensity = exercise.intensity;
                    break;
                }
            }
        }
        
        // Improved formula for more realistic calorie estimation
        // Based on MET values and exercise duration
        // Duration estimate: 30-45 seconds per set with rest periods
        const totalSets = parseInt(resistanceForm.sets) || 0;
        const totalReps = parseInt(resistanceForm.reps) || 0;
        
        // Estimate exercise duration in hours (approximately 45 seconds per set)
        const durationInHours = (totalSets * 0.75) / 60;
        
        // Formula: Calories = MET × weight(kg) × duration(hours)
        // Weight is already in kg
        
        // Adjust intensity based on rep count (higher reps = higher intensity)
        let adjustedIntensity = intensity;
        if (totalReps > 12) {
            adjustedIntensity = intensity * 1.1; // Higher intensity for endurance work
        } else if (totalReps < 6) {
            adjustedIntensity = intensity * 0.9; // Lower intensity for strength work (shorter duration)
        }
        
        // Calculate calories
        const calories = Math.round(adjustedIntensity * userWeight * durationInHours);
        setCaloriesBurned(calories);
    };

    const validateForm = (form) => {
        return form.name && form.weight && form.sets && form.reps && form.date;
    };

    const handleResistanceSubmit = async (event) => {
        event.preventDefault();

        //get token
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        // get user id 
        const userId = Auth.getUserId();

        // resistance submit
        if (validateForm(resistanceForm)) {
            try {
                // Add userId and calories burned to form data
                const dataToSubmit = {
                    ...resistanceForm,
                    userId,
                    caloriesBurned
                };

                const response = await createResistance(dataToSubmit, token);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Resistance exercise successfully added!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);

            } catch (err) {
                console.error(err);
            }
        }

        // clear form input
        setResistanceForm({
            name: "",
            weight: "",
            sets: "",
            reps: "",
            date: "",
            muscleGroup: ""
        });
        setSelectedMuscleGroup("");
    };

    // Get suggested workout (sets × reps) based on exercise name
    const getSuggestedWorkout = () => {
        if (!resistanceForm.name) return null;
        
        // Determine if it's a compound or isolation exercise
        const compoundExercises = ["Bench Press", "Squat", "Deadlift", "Shoulder Press", "Pull-Up"];
        const isCompound = compoundExercises.includes(resistanceForm.name);
        
        return {
            strength: isCompound ? "5 sets × 3-5 reps" : "4 sets × 6-8 reps",
            hypertrophy: isCompound ? "4 sets × 8-12 reps" : "3-4 sets × 10-15 reps",
            endurance: isCompound ? "3 sets × 15-20 reps" : "3 sets × 15-25 reps"
        };
    };

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    const suggestedWorkout = getSuggestedWorkout();

    return (
        <div className='resistance-page'>
            <Header />
            <div className="container">
                <div className="resistance-content">
                    <h2 className='title text-center text-white'>Track Your Resistance Training</h2>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="resistance-form-container">
                                <form className='resistance-form-new' onSubmit={handleResistanceSubmit}>
                                    <div className='form-header'>
                                        <img alt="resistance" src={resistanceIcon} className="exercise-form-icon" />
                                        <h3>Resistance Exercise Details</h3>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Muscle Group:</label>
                                        <select 
                                            className="form-control" 
                                            value={selectedMuscleGroup} 
                                            onChange={handleMuscleGroupChange}
                                        >
                                            <option value="">Select a muscle group</option>
                                            {MUSCLE_GROUPS.map((group) => (
                                                <option key={group.name} value={group.name}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Exercise Type:</label>
                                        <select 
                                            name="name" 
                                            className="form-control" 
                                            value={resistanceForm.name} 
                                            onChange={handleResistanceChange}
                                            disabled={!selectedMuscleGroup}
                                        >
                                            <option value="">Select an exercise</option>
                                            {exerciseOptions.map((exercise) => (
                                                <option key={exercise.name} value={exercise.name}>
                                                    {exercise.icon} {exercise.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Weight (kg):</label>
                                        <input 
                                            type="number" 
                                            name="weight" 
                                            className="form-control" 
                                            placeholder="0"
                                            min="0"
                                            step="0.5"
                                            value={resistanceForm.weight} 
                                            onChange={handleResistanceChange} 
                                        />
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group col-6 pr-2">
                    <label>Sets:</label>
                                            <input 
                                                type="number" 
                                                name="sets" 
                                                className="form-control" 
                                                placeholder="0"
                                                min="0"
                                                value={resistanceForm.sets} 
                                                onChange={handleResistanceChange} 
                                            />
                                        </div>
                                        
                                        <div className="form-group col-6 pl-2">
                    <label>Reps:</label>
                                            <input 
                                                type="number" 
                                                name="reps" 
                                                className="form-control" 
                                                placeholder="0"
                                                min="0"
                                                value={resistanceForm.reps} 
                                                onChange={handleResistanceChange} 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <DatePicker 
                                            selected={startDate} 
                                            value={resistanceForm.date} 
                                            onChange={handleDateChange} 
                                            placeholderText="mm/dd/yyyy"
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <button 
                                        className='submit-btn resistance-submit-btn' 
                                        type="submit" 
                                        disabled={!validateForm(resistanceForm)}
                                    >
                                        Save Exercise
                                    </button>
                </form>
                                {message && <div className="success-message">{message}</div>}
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="resistance-info-container">
                                <div className="calories-calculator">
                                    <h3 className="info-title">Calories Burned Estimate</h3>
                                    
                                    <div className="weight-input-group">
                                        <label>Your Weight (kg):</label>
                                        <input 
                                            type="number" 
                                            value={userWeight} 
                                            onChange={handleWeightChange}
                                            className="form-control weight-input"
                                            min="20"
                                            max="227"
                                            step="0.5"
                                        />
                                    </div>
                                    
                                    {caloriesBurned > 0 && (
                                        <div className="calories-result">
                                            <div className="calories-display">
                                                <span className="calories-number">{caloriesBurned}</span>
                                                <span className="calories-label">calories</span>
                                            </div>
                                            <p className="calories-info">
                                                Estimated calories burned for this resistance exercise session
                                            </p>
                                            <button 
                                                className="info-toggle-btn"
                                                onClick={() => setShowCalorieInfo(!showCalorieInfo)}
                                            >
                                                {showCalorieInfo ? 'Hide Details' : 'How is this calculated?'}
                                            </button>
                                            
                                            {showCalorieInfo && (
                                                <div className="calorie-info-box">
                                                    <p>This calculation uses a formula based on the MET (Metabolic Equivalent of Task) method:</p>
                                                    <p><strong>Calories = MET × Weight(kg) × Duration(hrs)</strong></p>
                                                    <ul>
                                                        <li>Duration is estimated at ~45 seconds per set</li>
                                                        <li>Intensity adjusts based on rep ranges</li>
                                                        <li>Higher reps (12+) slightly increase intensity</li>
                                                        <li>Lower reps (under 6) slightly decrease intensity</li>
                                                    </ul>
                                                    <p className="info-note">Note: This is an estimate. Actual calorie burn depends on many factors including rest periods, effort level, and individual metabolism.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="resistance-tip">
                                    <h4>💡 Pro Tip</h4>
                                    <p>{randomTip}</p>
                                </div>
                                
                                {suggestedWorkout && (
                                    <div className="resistance-suggestion">
                                        <h4>📊 Suggested Rep Ranges</h4>
                                        <div className="suggestion-content">
                                            <p>For <strong>{resistanceForm.name}</strong>:</p>
                                            <div className="workout-goals">
                                                <div className="goal-item">
                                                    <span className="goal-label">Strength</span>
                                                    <span className="goal-value">{suggestedWorkout.strength}</span>
                                                </div>
                                                <div className="goal-item">
                                                    <span className="goal-label">Muscle Growth</span>
                                                    <span className="goal-value">{suggestedWorkout.hypertrophy}</span>
                                                </div>
                                                <div className="goal-item">
                                                    <span className="goal-label">Endurance</span>
                                                    <span className="goal-value">{suggestedWorkout.endurance}</span>
                                                </div>
                                            </div>
                                            <p className="rest-tip">Rest period: 90-120 sec for strength, 60-90 sec for growth, 30-60 sec for endurance</p>
                                        </div>
                                    </div>
                                )}
                                
                                {selectedMuscleGroup && (
                                    <div className="muscle-info">
                                        <h4>🔍 {selectedMuscleGroup} Muscles</h4>
                                        <div className="muscle-description">
                                            {selectedMuscleGroup === "Chest" && (
                                                <p>The chest muscles (pectoralis major and minor) are responsible for pushing movements and arm adduction. They're one of the most popular muscle groups to train.</p>
                                            )}
                                            {selectedMuscleGroup === "Back" && (
                                                <p>The back consists of several muscles including the latissimus dorsi, rhomboids, and trapezius. These muscles help with pulling movements and maintaining good posture.</p>
                                            )}
                                            {selectedMuscleGroup === "Legs" && (
                                                <p>The legs contain the largest muscles in the body, including quadriceps, hamstrings, and calves. Training legs is crucial for overall strength and athletic performance.</p>
                                            )}
                                            {selectedMuscleGroup === "Arms" && (
                                                <p>The arms include biceps (front) and triceps (back). While they get indirect work during compound exercises, isolation movements can help define and strengthen these muscles.</p>
                                            )}
                                            {selectedMuscleGroup === "Shoulders" && (
                                                <p>The shoulders (deltoids) have three heads: anterior, lateral, and posterior. Well-developed shoulders create the appearance of a broader upper body and improve pushing strength.</p>
                                            )}
                                            {selectedMuscleGroup === "Core" && (
                                                <p>The core includes the abs, obliques, and lower back muscles. A strong core improves stability, posture, and performance in nearly all other exercises.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
