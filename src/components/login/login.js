import React, { useState } from 'react';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie library
import { useAuth } from "../auth/auth"

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const {storeTokenInLocalStorage} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if username/email and password are not empty
        if (!usernameOrEmail.trim() || !password.trim()) {
            toast.error('Please enter both username/email and password.');
            return;
        }

        try {
            const response = await axios.post('https://memories-server-1iig.onrender.com/userlogin', {
            // const response = await axios.post('http://localhost:5000/userlogin', {
                usernameOrEmail: usernameOrEmail,
                password: password
            });

            console.log(response.data); // Log the response data to the console
            
            // Assuming the server responds with a token upon successful login
            const token = response.data.token;
            storeTokenInLocalStorage(token);
            // localStorage.setItem('token',token);
            

            // Redirect to a different page upon successful login
            window.location.href = '/'; 
        } catch (error) {
            
            console.error('Error:', error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="usernameOrEmail">Username or Email</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        placeholder="Enter your username or email"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button className='submitbtn' type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
