import React, { useState , useEffect, createContext, useContext} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [token,setToken] = useState(localStorage.getItem('token'));
    const [user,setUser] = useState("");

    const storeTokenInLocalStorage = (servertoken) => {
        localStorage.setItem('token', servertoken);
        setToken(servertoken); // Update token state
    };

    let isLoggedIn = !!token;

    const userAuthentication = async () =>{
        try {
            const response = await axios.get("https://memories-server-1iig.onrender.com/user", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            
            if(response) {
                setUser(response.data.msg);
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Authentication 
    useEffect(()=>{
        userAuthentication();
    },[token]);

    return (
        <AuthContext.Provider  value={{isLoggedIn, storeTokenInLocalStorage, setToken, user, token}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth =()=>{
    return useContext(AuthContext);
};
