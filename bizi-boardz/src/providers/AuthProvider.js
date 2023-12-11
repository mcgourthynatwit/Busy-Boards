import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import CryptoJS from "crypto-js";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [pat, setPAT] = useState('');
  const [activeRepo, setActiveRepo] = useState('');
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // checks if user is authenticated on app boot up
  useEffect(() => {
    if (localStorage.getItem("pat") && localStorage.getItem("activeRepo") && localStorage.getItem("userName")) {
      const secretKey = process.env.REACT_APP_SECRET_KEY

      const bytes = CryptoJS.AES.decrypt(localStorage.getItem("pat"), secretKey);
      let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      console.log(secretKey)
      console.log('Decrypted:', decryptedData);
      decryptedData = decryptedData.replace(/"([^"]+)"/, '$1');
      console.log('Decrypted:', decryptedData);

      setPAT(decryptedData);
      setActiveRepo(localStorage.getItem("activeRepo"));
      setUserName(localStorage.getItem("userName"));
      setIsAuthenticated(true);
    }
  }, []);

return <AuthContext.Provider value={{ pat: pat, setPAT, activeRepo, setActiveRepo, userName, setUserName, isAuthenticated, setIsAuthenticated }}>
  {props.children}
</AuthContext.Provider>
}

const useAuthContext = () => {
  return useContext(AuthContext);
}

export { useAuthContext };
export default AuthProvider;