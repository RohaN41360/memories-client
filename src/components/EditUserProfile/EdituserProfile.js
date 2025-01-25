import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditUserProfile.css';
import { useAuth } from '../auth/auth';
import { API_URL } from '../../Config';
import Toast from '../Toast/Toast';

const EditUserProfile = () => {
    const navigate = useNavigate();
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        bio: '',
        file: null
    });

    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        // Redirect if not logged in
        if (!token) {
            navigate('/login');
            return;
        }

        // Initialize form data when user data is available
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                bio: user.bio || '',
                file: null
            });
            setPreviewImage(user.profilePicture || '');
            setLoading(false);
        }
    }, [user, token, navigate]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('File size should be less than 5MB', 'error');
                return;
            }
            setFormData(prev => ({
                ...prev,
                file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '' && formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await axios.patch(
                `${API_URL}/updateuserprofile/${user._id}`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.user) {
                // Update the user context with new data
                updateUser(response.data.user);
                showToast('Profile updated successfully', 'success');
                
                // Wait for the toast to be visible before navigating
                setTimeout(() => {
                    navigate('/userprofile');
                }, 2000);
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error updating profile';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className="loading-spinner">Getting things ready...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="edit-profile-card">
                <h2>Make Your Profile Awesome</h2>
                <form onSubmit={handleSubmit}>
                    <div className="profile-picture-section">
                        <img
                            src={previewImage}
                            alt="Profile"
                            className="profile-preview"
                        />
                        <div className="upload-button-wrapper">
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file" className="upload-button">
                                Update Profile Picture
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Create Your Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Make it unique and memorable"
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Where can we reach you?"
                        />
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            placeholder="What should we call you?"
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            placeholder="Complete your name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Express Yourself</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell your story in a few words..."
                            rows="4"
                        />
                    </div>

                    <div className="button-group">
                        <button 
                            type="submit" 
                            className={`submit-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/userprofile')}
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserProfile;
