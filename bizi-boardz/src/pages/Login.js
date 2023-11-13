import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomInput from '../components/CustomInput.js';
import { AiFillGithub } from 'react-icons/ai'
import { BsFillKeyFill } from 'react-icons/bs'
import BiziLogo from '../icons/Bizi_Boardz-logos.jpeg'
import { octokitAuth } from '../backend/octokitAuth.js';

const Login = () => {
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const [submittedUrl, setSubmittedUrl] = useState(null);
    const navigate = useNavigate();


    const handleUrlChange = event => setUrl(event.target.value);
    const handleTokenChange = event => setToken(event.target.value);
    
    const handleSubmit = async event => {
        event.preventDefault();
    
        const personalAccess = token; 
        console.log('Token:', personalAccess); // Debug token value
    
        try {
            const login = await octokitAuth(personalAccess);
            console.log('Login response:', login); // Debug login response
    
            if (login) {
                setSubmittedUrl(url);
                console.log('Navigating to /contact'); // Debug navigation
                navigate("/contact");
            } else {
                alert('Login failed');
            }
        } catch (error) {
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
                    <CustomInput icon = {<BsFillKeyFill/>} type = {'password'} onChange = {handleTokenChange} placeholder = {'Enter your GitHub personal Access token'} />
                       
                    
                    <input type="submit" value="Submit" />
                </form>

                {submittedUrl && 
                    <p>
                        You submitted {submittedUrl} and token {token}
                    </p>
                }
                </div>

            </header>
            
            
           
        </div>
    );
}

export default Login;
