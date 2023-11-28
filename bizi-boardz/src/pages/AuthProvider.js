import { createContext, useContext } from "react";
import { useState } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
    const [pat, setPAT] = useState('');
    const [activeRepo, setActiveRepo] = useState('');
    const [userName, setUserName] = useState('');

    return <AuthContext.Provider value={{pat: pat, setPAT, activeRepo, setActiveRepo, userName, setUserName}}>
        {props.children}
    </AuthContext.Provider>
}

const useAuthContext = () => {
    return useContext(AuthContext);
}

export { useAuthContext };
export default AuthProvider;