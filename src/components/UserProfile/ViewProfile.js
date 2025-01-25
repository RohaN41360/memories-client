import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Config';
import { useAuth } from '../auth/auth';
import '../user Profile/userprofile.css';
import Toast from '../Toast/Toast';

const ViewProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!token) {
                    setError('Authentication required');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}/user/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response || !response.data) {
                    throw new Error('Invalid response from server');
                }

                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response?.status === 404) {
                    setError('User not found');
                } else if (error.response?.status === 401) {
                    setError('Please login to view this profile');
                    navigate('/login');
                } else {
                    setError(error.response?.data?.message || 'Error loading profile');
                }
                showToast(error.response?.data?.message || 'Error loading profile', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username, token, navigate]);

    const handleImgError = (e) => {
        e.target.src = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1717928295/memories/dummyImage_doe6xo.jpg';
    };

    if (loading) {
        return (
            <div className="user-profile">
                <div className="container">
                    <div className="loading-spinner">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile">
                <div className="container">
                    <div className="error-message">
                        <h2>{error}</h2>
                        <button onClick={() => navigate(-1)} className="btn btn-primary">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="container">
                <div className="profile">
                    <div className="profile-header">
                        <div className="profile-image">
                            <img
                                src={userProfile.profilePicture}
                                alt={`${userProfile.username}'s profile`}
                                onError={handleImgError}
                            />
                        </div>
                        <div className="profile-info">
                            <div className="profile-user-details">
                                <h1 className="username">{userProfile.username}</h1>
                                {userProfile.isOwnProfile && (
                                    <div className="profile-actions">
                                        <button onClick={() => navigate('/editprofile')} className="btn btn-primary">
                                            Edit Profile
                                        </button>
                                        <button onClick={() => navigate('/upload')} className="btn btn-secondary">
                                            Share Memory
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="profile-stats">
                                <ul>
                                    <li>
                                        <span>{userProfile.posts?.length || 0}</span>
                                        Posts
                                    </li>
                                    <li>
                                        <span>0</span>
                                        Followers
                                    </li>
                                    <li>
                                        <span>0</span>
                                        Following
                                    </li>
                                </ul>
                            </div>

                            <div className="profile-bio">
                                <p>
                                    <strong>{`${userProfile.firstname} ${userProfile.lastname}`}</strong>
                                    <br />
                                    {userProfile.bio || 'No bio yet.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <main>
                    {userProfile.posts?.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts yet.</p>
                        </div>
                    ) : (
                        <div className="gallery">
                            {userProfile.posts.map((post) => (
                                <div key={post._id} className="gallery-item">
                                    <img
                                        src={post.url}
                                        alt={post.description || 'Post'}
                                        className="gallery-image"
                                    />
                                    <div className="gallery-item-info">
                                        <div className="gallery-item-stats">
                                            <span>
                                                <i className="fa fa-thumbs-up"></i> {post.likes || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ViewProfile; 