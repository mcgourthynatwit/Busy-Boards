import React, { useState } from 'react';

function Login() {
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const [submittedUrl, setSubmittedUrl] = useState(null);

    const handleUrlChange = event => setUrl(event.target.value);
    const handleTokenChange = event => setToken(event.target.value);
    
    const handleSubmit = event => {
        event.preventDefault();
        setSubmittedUrl(url);
    }

    return (
        <div className="Login">
            <header className="App-header">
                <p>
                    Welcome to Bizi Boardz
                </p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Enter repository URL:
                        <input type="text" value={url} onChange={handleUrlChange}/>
                    </label>
                    <label>
                        Enter Personal Access Token:
                        <input type="password" onChange={handleTokenChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                {submittedUrl && 
                    <p>
                        You submitted {submittedUrl} and token {token}
                    </p>
                }
            </header>
        </div>
    );
}

export default Login;
