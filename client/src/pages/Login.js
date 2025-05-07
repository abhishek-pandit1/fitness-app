import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../utils/API";
import Auth from "../utils/auth";
import Header from "../components/Header";

export default function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Auth.loggedIn();

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(false);
    setErrorMessage("");

    try {
      const data = await loginUser(formState);
      Auth.login(data.token);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Login failed");
      setShowAlert(true);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

  // If the user is logged in, redirect to the home page
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
        {/* --------------------email-------------------- */}
        <label htmlFor="email">Email</label>
        <input
          className="form-input"
          value={formState.email}
          placeholder="youremail@gmail.com"
          name="email"
          type="email"
          onChange={handleChange}
          required
        />

        {/* -------------------- password-------------------- */}
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
          required
        />

        {/* --------------------login btn-------------------- */}
        <div className="btn-div">
          <button 
            disabled={!(formState.email && formState.password)}
            className="signup-btn mx-auto my-auto"
            type="submit"
          >
            Login
          </button>
        </div>
        {/* --------------------signup link-------------------- */}
        <p className="link-btn">
          New to FitTrack?{' '}
          <Link to="/signup">Create one</Link>
        </p>
        {showAlert && <div className="err-message">{errorMessage}</div>}
      </form>
    </div>
  );
}
