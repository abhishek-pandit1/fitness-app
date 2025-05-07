import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import { getMe, updateUser } from "../utils/API";
import Header from "../components/Header";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedIn) {
        try {
          const token = Auth.getToken();
          const user = await getMe(token);
          setUserData(user);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err.message || 'Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [loggedIn]);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Validate passwords
    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = Auth.getToken();
      await updateUser(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccessMessage("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || "Failed to update password");
    }
  };

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="container mt-5 pt-4">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="container mt-5 pt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="profile-card">
              <div className="card-header">
                <h2>Profile Settings</h2>
              </div>
              <div className="card-body">
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <div className="profile-info">
                  <h3>Account Information</h3>
                  <div className="info-group">
                    <label>Username:</label>
                    <span>{userData?.username}</span>
                  </div>
                  <div className="info-group">
                    <label>Email:</label>
                    <span>{userData?.email}</span>
                  </div>
                </div>

                <div className="password-section">
                  <h3>Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="password-form">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                        className="form-control"
                      />
                    </div>

                    <button type="submit" className="update-password-btn">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 