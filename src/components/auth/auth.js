import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // Setup axios interceptor for unauthorized responses
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Clear auth state on unauthorized response
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Remove interceptor on cleanup
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.data?.msg) {
                    setUser(response.data.msg);
                } else {
                    // Invalid response, clear auth state
                    logout();
                }
            } catch (error) {
                // Token validation failed, clear auth state
                console.error('Token validation error:', error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const login = (userData, newToken) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to login page will be handled by the navbar
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isLoggedIn = !!token && !!user;

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            updateUser, 
            isLoggedIn,
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
