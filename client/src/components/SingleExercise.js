import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Auth from '../utils/auth';
import { getCardioById, getResistanceById, deleteCardio, deleteResistance } from '../utils/API';
import { formatDate } from '../utils/dateFormat';
import Header from "./Header";
import cardioIcon from "../assets/images/cardio-w.png"
import resistanceIcon from "../assets/images/resistance-w.png"

export default function SingleExercise() {
    const { id, type } = useParams();
    const [cardioData, setCardioData] = useState(null);
    const [resistanceData, setResistanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loggedIn = Auth.loggedIn();
    const navigate = useNavigate();

    useEffect(() => {
        const displayExercise = async () => {
            if (!loggedIn) return;
            
            const token = Auth.getToken();
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                if (type === "cardio") {
                    const cardio = await getCardioById(id, token);
                    if (cardio) {
                        cardio.date = formatDate(cardio.date);
                        setCardioData(cardio);
                    }
                } else if (type === "resistance") {
                    const resistance = await getResistanceById(id, token);
                    if (resistance) {
                        resistance.date = formatDate(resistance.date);
                        setResistanceData(resistance);
                    }
                }
            } catch (err) {
                console.error('Error fetching exercise data:', err);
                setError(err.message || 'Failed to fetch exercise data');
            } finally {
                setLoading(false);
            }
        };

        displayExercise();
    }, [id, type, loggedIn]);

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    const handleDeleteExercise = async (exerciseId) => {
        const token = Auth.getToken();
        if (!token) return;

        confirmAlert({
            title: "Delete Exercise",
            message: "Are you sure you want to delete this exercise?",
            buttons: [
                {
                    label: "Cancel",
                },
                {
                    label: "Delete",
                    onClick: async () => {
                        try {
                            if (type === "cardio") {
                                await deleteCardio(exerciseId, token);
                            } else if (type === "resistance") {
                                await deleteResistance(exerciseId, token);
                            }
                            navigate("/history");
                        } catch (err) {
                            console.error('Error deleting exercise:', err);
                            setError(err.message || 'Failed to delete exercise');
                        }
                    }
                }
            ]
        });
    };

    if (loading) {
        return (
            <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
                <Header />
                <div className="container mt-5 pt-4">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
                <Header />
                <div className="container mt-5 pt-4">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
            <Header />
            <div className="container mt-5 pt-4">
                <h2 className='title text-center'>Exercise Details</h2>
                <div className="single-exercise d-flex flex-column align-items-center text-center">
                    {type === "cardio" && cardioData && (
                        <div className='cardio-div'>
                            <div className='d-flex justify-content-center'>
                                <img alt="cardio" src={cardioIcon} className="exercise-form-icon" />
                            </div>
                            <div className="exercise-details">
                                <p><span>Date: </span> {cardioData.date}</p>
                                <p><span>Name: </span> {cardioData.name}</p>
                                <p><span>Distance: </span> {cardioData.distance} km</p>
                                <p><span>Duration: </span> {cardioData.duration} minutes</p>
                                {cardioData.caloriesBurned > 0 && (
                                    <p><span>Calories: </span> <strong className="calories-value">{cardioData.caloriesBurned}</strong></p>
                                )}
                            </div>
                            <button className='delete-btn' onClick={() => handleDeleteExercise(id)}>Delete Exercise</button>
                        </div>
                    )}
                    {type === "resistance" && resistanceData && (
                        <div className='resistance-div'>
                            <div className='d-flex justify-content-center'>
                                <img alt="resistance" src={resistanceIcon} className="exercise-form-icon" />
                            </div>
                            <div className="exercise-details">
                                <p><span>Date: </span> {resistanceData.date}</p>
                                <p><span>Name: </span> {resistanceData.name}</p>
                                {resistanceData.muscleGroup && (
                                    <p><span>Muscle Group: </span> {resistanceData.muscleGroup}</p>
                                )}
                                <p><span>Weight: </span> {resistanceData.weight} kg</p>
                                <p><span>Sets: </span> {resistanceData.sets}</p>
                                <p><span>Reps: </span> {resistanceData.reps}</p>
                                {resistanceData.caloriesBurned > 0 && (
                                    <p><span>Calories: </span> <strong className="calories-value">{resistanceData.caloriesBurned}</strong></p>
                                )}
                            </div>
                            <button className='delete-btn' onClick={() => handleDeleteExercise(id)}>Delete Exercise</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
