import React, { useState , useEffect,createContext, useContext} from 'react';
import axios from 'axios';



export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

const [token,setToken] = useState(localStorage.getItem('token'));
const [user,setUser] = useState("")

  const storeTokenInLocalStorage = (servertoken) => {
    return  localStorage.setItem('token',servertoken)
  }

  let isLoggedIn = !!token;

  const  userAuthentication = async () =>{
    try {
        const response = await axios.get("https://memories-server-1iig.onrender.com/user", {
        // const response = await axios.get("http://localhost:5000/user", {
    headers: {
      Authorization: `${token}`,
    },
    });
    
    if(response)
    {
      setUser(response.data.msg)
    }
    else
    {
      window.location.href = '/login';
    }

    } catch (error) {
      console.log(error)
    }
  }

  // authentication 
  useEffect(()=>{
    userAuthentication();
  },[]);

  
  return <AuthContext.Provider  value={{isLoggedIn,storeTokenInLocalStorage,user,token}}>
      {children}
    </AuthContext.Provider>
}

export const useAuth =()=>{
  return useContext(AuthContext);
}