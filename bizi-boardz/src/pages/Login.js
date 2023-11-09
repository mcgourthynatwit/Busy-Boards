import React, { useState } from 'react';

function Login() {
    const [url, setUrl] = useState('');


    function handleChange(event) {
        setUrl(event.target.value);
    }

    return (
        <div className="Login">
            <header className="App-header">
                <p>
                    Test p
                </p>
                <form>
                    <label>
                        Enter repository URL:
                        <input type="text" onChange={handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <p>
                    You entered: {url}
                </p>
            </header>
        </div>
    );
}

export default Login;
