import React, { useState } from 'react';
import AIWorkoutRecommender from '../components/AIWorkoutRecommender';
import '../components/AIWorkoutRecommender.css';
import Header from '../components/Header';

const AIWorkout = () => {
    const [userData, setUserData] = useState({
        age: '',
        weight: '',
        height: '',
        fitnessLevel: 3,
        goal: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }));
    };

    return (
        <div className="ai-workout-page">
            <Header />
            <div className="container mt-5 pt-4">
                <div className="row justify-content-center">
                    <div className="col-12 text-center mb-4">
                        <h1 className="ai-title">AI Workout Planner</h1>
                        <p className="ai-subtitle">Get personalized workout recommendations based on your profile</p>
                    </div>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="profile-card">
                            <div className="card-header">
                                <h3>Your Profile</h3>
                                <p className="text-muted">Enter your details for personalized recommendations</p>
                            </div>
                            <div className="card-body">
                                <form className="profile-form">
                                    <div className="form-group">
                                        <label>Age</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="age"
                                                value={userData.age}
                                                onChange={handleInputChange}
                                                min="15"
                                                max="100"
                                                placeholder="Enter your age"
                                            />
                                            <span className="input-group-text">years</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Weight</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="weight"
                                                value={userData.weight}
                                                onChange={handleInputChange}
                                                min="30"
                                                max="200"
                                                placeholder="Enter your weight"
                                            />
                                            <span className="input-group-text">kg</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Height</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="height"
                                                value={userData.height}
                                                onChange={handleInputChange}
                                                min="100"
                                                max="250"
                                                placeholder="Enter your height"
                                            />
                                            <span className="input-group-text">cm</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Fitness Level</label>
                                        <div className="fitness-level-selector">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    className={`fitness-level-btn ${userData.fitnessLevel === level ? 'active' : ''}`}
                                                    onClick={() => setUserData(prev => ({ ...prev, fitnessLevel: level }))}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="fitness-level-labels">
                                            <span>Beginner</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Goal</label>
                                        <select
                                            className="form-select"
                                            name="goal"
                                            value={userData.goal}
                                            onChange={handleInputChange}
                                        >
                                            <option value="1">Weight Loss</option>
                                            <option value="2">Muscle Gain</option>
                                            <option value="3">General Fitness</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <AIWorkoutRecommender userData={userData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIWorkout; 