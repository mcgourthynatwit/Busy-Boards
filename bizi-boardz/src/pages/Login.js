import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomInput from '../components/CustomInput.js';
import { AiFillGithub } from 'react-icons/ai'
import { BsFillKeyFill } from 'react-icons/bs'
import BiziLogo from '../icons/Bizi_Boardz-logos.jpeg'
import { octokitAuth } from '../backend/octokitAuth.js';
import { octokitAuthRepo } from '../backend/octokitAuthRepo.js';
import FormInputError from '../components/FormInputError.js';

const Login = () => {
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [showUrlError, setShowUrlError] = useState(false);
    const [showPATError, setShowPATError] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleUrlChange = event => {
        setUrl(event.target.value);
        setShowUrlError(false);  // Hide error messages when re-focusing text
    }
    const handleTokenChange = event => {
        setToken(event.target.value);
        setShowPATError(false); // Hide error messages when re-focusing text
    }

    const validRepo = async (userName, repoURL) => {
        try {
            const valid = await octokitAuthRepo(token, userName, repoURL); // Returns true if valid url
            return true;
        } catch (error) {
            setShowUrlError(true);
        }
        return false;
    };
    
    const handleSubmit = async event => {
        event.preventDefault();

        setHasSubmitted(true);
    
        const personalAccess = token; 
    
        try {
            const loggedInUser = await octokitAuth(personalAccess);
            setShowPATError(false);

            const validUrl = await validRepo(loggedInUser, url);
            
            if (loggedInUser && validUrl) {
                navigate("/contact");
            } else {
              //  alert('Login failed');
            }
        } catch (error) {
            setShowPATError(true);
            console.error('Error during authentication:', error);
        }
    };
    
    

    return (
        <div className="Login">
            <header className="App-header">
                <img src = {BiziLogo} style = {{
                    width: '300px',
                    height: '300px'
                }}>
                </img>
                <p>
                    Welcome to Bizi Boardz
                </p>

                <div className = "Container">

                <form onSubmit={handleSubmit} className = "Form">
                    <CustomInput icon={<AiFillGithub />} type={'text'} onChange = {handleUrlChange} placeholder={'Enter your GitHub repository URL'} />
                    {(showUrlError && hasSubmitted)  &&
                        <FormInputError errorText = {'Please enter a valid GitHub Repository Url!'} visible={showUrlError}/>
                    }
                    <CustomInput icon = {<BsFillKeyFill/>} type = {'password'} onChange = {handleTokenChange} placeholder = {'Enter your GitHub personal Access token'} />
                    {(showPATError && hasSubmitted)  &&
                        <p>
                            <FormInputError errorText = {'Please enter a valid GitHub Personal Access Token!'} visible={showPATError}/>
                        </p>
                    } 
                    
                    <input type="submit" value="Submit" />
                </form>

                </div>

            </header>
            
            
           
        </div>
    );
}

export default Login;
