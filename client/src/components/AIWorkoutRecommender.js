import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const AIWorkoutRecommender = ({ userData }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simple workout recommendation model
    const createModel = () => {
        const model = tf.sequential();
        
        // Add layers
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [5] // Input features: age, weight, height, fitness level, goal
        }));
        
        model.add(tf.layers.dense({
            units: 8,
            activation: 'relu'
        }));
        
        model.add(tf.layers.dense({
            units: 3, // Output: workout intensity, duration, type
            activation: 'softmax'
        }));

        return model;
    };

    // Generate workout recommendations
    const generateRecommendations = async () => {
        // Check if required fields are filled
        if (!userData.age || !userData.weight || !userData.height) {
            setRecommendations(null);
            return;
        }

        setIsLoading(true);
        try {
            const model = createModel();
            
            // Normalize user data
            const normalizedData = normalizeUserData(userData);
            
            // Make prediction
            const prediction = await model.predict(normalizedData).array();
            
            // Convert prediction to workout recommendations
            const workoutPlan = interpretPrediction(prediction[0]);
            setRecommendations(workoutPlan);
        } catch (error) {
            console.error('Error generating recommendations:', error);
        }
        setIsLoading(false);
    };

    // Normalize user data for the model
    const normalizeUserData = (data) => {
        return tf.tensor2d([[
            data.age / 100, // Normalize age
            data.weight / 200, // Normalize weight
            data.height / 250, // Normalize height
            data.fitnessLevel / 5, // Normalize fitness level (1-5)
            data.goal / 3 // Normalize goal (1-3)
        ]]);
    };

    // Convert model output to workout recommendations
    const interpretPrediction = (prediction) => {
        const workoutTypes = ['Cardio', 'Strength', 'Flexibility'];
        const intensities = ['Low', 'Medium', 'High'];
        const durations = ['30 minutes', '45 minutes', '60 minutes'];

        return {
            type: workoutTypes[prediction.indexOf(Math.max(...prediction))],
            intensity: intensities[Math.floor(Math.random() * 3)],
            duration: durations[Math.floor(Math.random() * 3)],
            exercises: getExercisesForType(workoutTypes[prediction.indexOf(Math.max(...prediction))])
        };
    };

    // Get specific exercises based on workout type
    const getExercisesForType = (type) => {
        const exercises = {
            Cardio: ['Running', 'Cycling', 'Jump Rope', 'Burpees'],
            Strength: ['Push-ups', 'Squats', 'Lunges', 'Plank'],
            Flexibility: ['Yoga', 'Stretching', 'Pilates', 'Tai Chi']
        };
        return exercises[type] || [];
    };

    useEffect(() => {
        generateRecommendations();
    }, [userData]);

    return (
        <div className="ai-workout-recommender">
            <h2>AI Workout Recommendations</h2>
            {isLoading ? (
                <p>Generating personalized workout plan...</p>
            ) : !userData.age || !userData.weight || !userData.height ? (
                <div className="workout-details">
                    <p className="text-center text-muted">Please fill in all your details to get personalized workout recommendations.</p>
                </div>
            ) : (
                <div className="recommendations">
                    {recommendations && (
                        <>
                            <h3>Your Personalized Workout Plan</h3>
                            <div className="workout-details">
                                <p><strong>Type:</strong> {recommendations.type}</p>
                                <p><strong>Intensity:</strong> {recommendations.intensity}</p>
                                <p><strong>Duration:</strong> {recommendations.duration}</p>
                                <h4>Recommended Exercises:</h4>
                                <ul>
                                    {recommendations.exercises?.map((exercise, index) => (
                                        <li key={index}>{exercise}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIWorkoutRecommender; 