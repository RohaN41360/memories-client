import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Config';
import { useAuth } from '../auth/auth';
import './Search.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { token } = useAuth();

    const debouncedSearch = useCallback(
        async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setMessage('');
                return;
            }

            setLoading(true);
            setMessage('');

            try {
                const response = await axios.get(`${API_URL}/search?query=${query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.length === 0) {
                    setMessage('No users found');
                    setSearchResults([]);
                } else {
                    setSearchResults(response.data);
                }
            } catch (error) {
                console.error('Search error:', error);
                setMessage('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            debouncedSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, debouncedSearch]);

    const getProfilePicture = (user) => {
        if (user.profilePicture && user.profilePicture.startsWith('http')) {
            return user.profilePicture;
        }
        return 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1717928295/memories/dummyImage_doe6xo.jpg';
    };

    const getInitials = (user) => {
        return `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || '?';
    };

    return (
        <div className="search-container">
            <div className="search-content">
                <h1>Discover New Friends</h1>
                <p className="search-subtitle">Find and connect with amazing people</p>

                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Start typing to search..."
                        className="search-input"
                    />
                    {loading && <div className="search-spinner"></div>}
                </div>

                {message && <p className="search-message">{message}</p>}

                <div className="search-results">
                    {searchResults.map((user) => (
                        <Link 
                            to={`/user/${user.username}`} 
                            key={user._id}
                            className="user-card"
                        >
                            <div className="user-card-content">
                                <div className="user-avatar">
                                    {user.profilePicture ? (
                                        <img 
                                            src={getProfilePicture(user)}
                                            alt={`${user.username}'s profile`}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : (
                                        <div className="user-avatar-fallback">
                                            {getInitials(user)}
                                        </div>
                                    )}
                                    <div className="user-avatar-fallback" style={{ display: 'none' }}>
                                        {getInitials(user)}
                                    </div>
                                </div>
                                <div className="user-info">
                                    <h3>{user.username}</h3>
                                    <p className="user-fullname">{user.firstname} {user.lastname}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
