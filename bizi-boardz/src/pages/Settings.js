import React, { useState } from 'react';
import { useAuthUtils } from '../backend/octokit/useAuthUtils.js';
import "../styles/Settings.css";
import '../styles/CustomInput.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import CustomInput from '../components/CustomInput.js';
import { BsFillKeyFill } from 'react-icons/bs';
import { encryptData } from '../backend/octokit/encrypt.js';

const Settings = () => {
  const { pat, activeRepo, setPAT, setActiveRepo, userName, setUserName, octokitAuth, octokitAuthRepo} = useAuthUtils();
  
  const [newRepo, setNewRepo] = useState("");  // New state for the input value
  const [newPAT, setNewPAT] = useState("");    // New state for the input value

  const handleRepoChange = (e) => {
    setNewRepo(e.target.value);  // Update the newRepo state
  };

  const handlePATChange = (e) => {
    setNewPAT(e.target.value);   // Update the newPAT state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const oldPAT = pat;
    const oldActiveRepo = activeRepo;
    const oldUserName = userName;
    try{
        // Use setPAT and setActiveRepo to update the state with the new values   
        const loggedInUser = await octokitAuth(newPAT); // Get logged in username from auth hook
        setPAT(newPAT);
        setUserName(loggedInUser); // Set in auth hook

        const encryptedPat = encryptData(newPAT)
        
        localStorage.setItem("userName", loggedInUser);
        localStorage.setItem("pat", encryptedPat);

        
        const validUrl = await octokitAuthRepo(newPAT, newRepo); // Returns true if valid url
        setActiveRepo(newRepo);
        localStorage.setItem("activeRepo", newRepo);

        // Clear the input fields after the submission 
        setNewRepo("");
        setNewPAT("");
    } catch (error) {
      console.log("Settings err resetting to old", oldPAT, oldActiveRepo, oldUserName);
        setPAT(oldPAT);
        setActiveRepo(oldActiveRepo);
        setUserName(oldUserName);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-header">Settings</h1>
      <div className="solid-line"></div>
      <p className="form-label">GitHub Username: {userName} </p>
      <p className="form-label">Current GitHub Repo: {activeRepo} </p>
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
            icon = {BsFillKeyFill}
            className="form-input"
            type="password"
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
