import React, { useState } from 'react';
import { useAuthUtils } from '../backend/octokit/useAuthUtils.js';
import "../styles/Settings.css";

const Settings = () => {
  const { pat, activeRepo, userName, updateRepo, newPat } = useAuthUtils();

  const [newRepo, setNewRepo] = useState('');

  const handleRepoChange = (e) => {
    setNewRepo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming there is an updateRepo function 
    updateRepo(newRepo);
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
            value={newRepo}
            onChange={handleRepoChange}
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
