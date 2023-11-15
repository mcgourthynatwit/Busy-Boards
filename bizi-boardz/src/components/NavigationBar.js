import React, { useState } from 'react';
import './NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ CurrentSprint, CreateTask, CreateBacklog, Settings }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavigationBar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className={`navigationbar ${isOpen ? 'open' : ''}`}>
          <button onClick={toggleNavigationBar}> <FontAwesomeIcon icon={faBars} /> </button>
          <button onClick={CurrentSprint}>Create Sprint</button>
          <button onClick={CreateTask}> New Task</button>
          <button onClick={CreateBacklog}> View Backlog</button>
          <button onClick={Settings}>Settings</button>
      </div>
    );
  };
  
  export default NavigationBar