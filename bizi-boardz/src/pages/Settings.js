import React, { useState } from 'react';
import { useAuthUtils } from '../backend/octokit/useAuthUtils.js';
import "../styles/Settings.css";

const Settings = () => {
  const { pat, activeRepo, setPAT, setActiveRepo, userName} = useAuthUtils();
  
  const [newRepo, setNewRepo] = useState("");  // New state for the input value
  const [newPAT, setNewPAT] = useState("");    // New state for the input value

  const handleRepoChange = (e) => {
    setNewRepo(e.target.value);  // Update the newRepo state
  };

  const handlePATChange = (e) => {
    setNewPAT(e.target.value);   // Update the newPAT state
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use setPAT and setActiveRepo to update the state with the new values
    setPAT(newPAT);
    setActiveRepo(newRepo);
    // Clear the input fields after the submission 
    setNewRepo("");
    setNewPAT("");
  };

  return (
    <div className="settings-container">
      <h1 className="settings-header">Settings</h1>
      <div className="solid-line"></div>
      <p className="form-label">GitHub Username: {userName} </p>
      <p className="form-label">Current GitHub Repo: {activeRepo} </p>
      <p className="form-label"> Current Personal Access Token: {pat} </p>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          New GitHub Repo:
          <input
            className="form-input"
            type="text"
            value={newRepo}
            onChange={handleRepoChange}
            placeholder="Enter GitHub Repo URL"
          />
        </label>
        <label className="form-label">
          New Personal Access Token: 
          <input
            className="form-input"
            type="text"
            value={newPAT}
            onChange={handlePATChange}
            placeholder="Enter Personal Access Token (PAT)"
          />
        </label>
        <button className="form-button" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
