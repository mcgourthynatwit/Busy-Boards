import React, { useState } from 'react';
import './NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ onCreateProject, onCreateTask }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavigationBar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className={`NavigationBar ${isOpen ? 'open' : ''}`}>
        <button onClick={toggleNavigationBar}> className="toggle-button" <FontAwesomeIcon icon={faBars} /> </button>
        <button onClick={onCreateProject}>New Project</button>
        <button onClick={onCreateTask}>New Task</button>
      </div>
    );
  };
  
  export default NavigationBar;