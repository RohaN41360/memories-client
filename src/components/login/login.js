import React, { useState } from 'react';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../Config';
import { useAuth } from "../auth/auth"
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.usernameOrEmail || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/userlogin`, formData);
            
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }
            
            const { token, user } = response.data;
            if (!token || !user) {
                throw new Error('Invalid login response');
            }

            login(user, token);
            toast.success('Login successful');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                // Server responded with an error
                switch (error.response.status) {
                    case 401:
                        toast.error('Invalid username/email or password');
                        break;
                    case 404:
                        toast.error('User not found');
                        break;
                    case 500:
                        toast.error('Server error. Please try again later');
                        break;
                    default:
                        toast.error(error.response.data?.message || 'Login failed');
                }
            } else if (error.request) {
                // Request was made but no response
                toast.error('No response from server. Please check your internet connection');
            } else {
                // Error in request setup
                toast.error('Error setting up request. Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="usernameOrEmail">Username or Email</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                        placeholder="Enter your username or email"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter your password"
                    />
                </div>

                <button className='submitbtn' type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
