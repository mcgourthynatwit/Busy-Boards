import React, { useState } from 'react';
import './NavigationBar.css';
import '../styles/bizi-boardz-styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ CurrentSprint, CreateTask, CreateBacklog, Settings }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavigationBar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className={`bizi-bright-bg navigationbar ${isOpen ? 'open' : ''}`}>
          <button type='button' onClick={toggleNavigationBar}> <FontAwesomeIcon icon={faBars} /> </button>
          {isOpen && (
        <>
          <button type="button" onClick={CurrentSprint}>
            Create Sprint
          </button>
          <button type="button" onClick={CreateTask}>
            New Task
          </button>
          <button type="button" className="btn btn-primary bizi-dark-txt" onClick={CreateBacklog}>
            View Backlog
          </button>
          <button type="button" className="btn bizi-nav-btn-selected" onClick={Settings}>
            Settings
          </button>
        </>
      )}
    </div>
  );
};

  export default NavigationBar;