import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomInput from '../components/CustomInput.js';
import { AiFillGithub } from 'react-icons/ai'
import { BsFillKeyFill } from 'react-icons/bs'
import BiziLogo from '../icons/Bizi_Boardz-logos.jpeg'
import { octokitAuth } from '../backend/octokitAuth.js';
import { octokitAuthRepo } from '../backend/octokitAuthRepo.js';

const Login = () => {
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [validRepoUrl, setValidRepoUrl] = useState(false);
    const [validPAT, setValidPAT] = useState(true);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    let repoUrlValid = false

    const handleUrlChange = event => {
        setUrl(event.target.value);
    }
    const handleTokenChange = event => {
        setToken(event.target.value);
        setValidPAT(true);
    }

    const validRepo = async (userName, repoURL) => {
        try {
            const valid = await octokitAuthRepo(token, userName, repoURL); // Returns true if valid url
            console.log('valid = ', valid)
            repoUrlValid = valid
        } catch (error) {
            setValidRepoUrl(false);
        }
    };
    
    const handleSubmit = async event => {
        event.preventDefault();

        setHasSubmitted(true);
    
        const personalAccess = token; 
    
        try {
            const loggedInUser = await octokitAuth(personalAccess);
            
            await validRepo(loggedInUser, url);
            
            console.log('logged in', loggedInUser, 'valid', validRepoUrl)
            if (loggedInUser && repoUrlValid) {
                navigate("/contact");
            } else {
              //  alert('Login failed');
            }
        } catch (error) {
            setValidPAT(false);
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
                    {(!validRepoUrl && hasSubmitted)  &&
                        <p>
                            Please enter a valid repository url!
                        </p>
                    }
                    <CustomInput icon = {<BsFillKeyFill/>} type = {'password'} onChange = {handleTokenChange} placeholder = {'Enter your GitHub personal Access token'} />
                    {(!validPAT && hasSubmitted)  &&
                        <p>
                            Please enter a valid Personal Access Token!
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
