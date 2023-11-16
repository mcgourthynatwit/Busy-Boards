import React, { useState } from 'react';
import '../styles/NavigationBar.css';
import '../styles/bizi-boardz-styles.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


//currentSprint, View Backlog, My Tasks, Settings
const NavigationBar = ({ CurrentSprint, CreateTask, CreateBacklog, Settings }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavigationBar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      // <div className={`bizi-bright-bg navigationbar ${isOpen ? 'open' : ''}`}>
      //     <button type='button' onClick={toggleNavigationBar}> <FontAwesomeIcon icon={faBars} /> </button>
      //     <button type='button' onClick={CurrentSprint}>Create Sprint</button>
      //     <button type='button' onClick={CreateTask}> New Task</button>
      //     <button type='button' className="btn text-nowrap" onClick={CreateBacklog}> View Backlog</button>
      //     <button type='button' className="btn bizi-nav-btn-selected" onClick={Settings}>Settings</button>
      // </div>
      <>
      <nav className='nav'>
        {/* <CustomLink to='/' className='app-title'>Bizi Boardz</CustomLink> */}
        <span className='app-title'>Bizi Boardz</span>
        <ul>
          <li>
            <CustomLink to='/currentSprint'>Current Sprint</CustomLink>
          </li>
          <li>
            <CustomLink to='/viewBacklog'>View Backlog</CustomLink>
          </li>
          <li>
            <CustomLink to='/myTasks'>My Tasks</CustomLink>
          </li>
          <li>
            <CustomLink to='/settings'>Settings</CustomLink>
          </li>
        </ul>
      </nav>
      
      </>
    );
  };

  function CustomLink({ to, children, ...props }){
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true})

    return (
      <li className={isActive ? 'active' : ''}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    )
  }
  
  export default NavigationBar