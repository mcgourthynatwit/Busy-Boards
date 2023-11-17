import React, { useState } from 'react';
import '../styles/NavigationBar.css';
import '../styles/bizi-boardz-styles.css'
import { Link, useLocation, useMatch, useResolvedPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


//currentSprint, View Backlog, My Tasks, Settings
const NavigationBar = () => {

    //if on login page, dont show NavigationBar element  
    if(useLocation().pathname === '/'){
      return <></>;
    }

    //the usual render - shows NavigationBar elements
    return (
      <>
      <nav className='nav'>
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

  //im pretty sure this gives/takes away active css class,
  //giving page name a highlight in the NavigationBar
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