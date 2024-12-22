import React, { useState, useEffect, useRef } from 'react';
import './EditUserProfile.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../auth/auth';
import { API_URL } from '../../Config';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { token, user } = useAuth();  // Assuming user is fetched from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    file: null,
    previewfile: null
  });

  const [loading, setLoading] = useState(false); // State for loading indicator
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Pre-fill the form with current user data
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        file: null,
        previewfile: user.profilePicture || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        previewfile: URL.createObjectURL(file),
        file: file
      }));
    }
  };

  const handleCircleClick = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('firstname', formData.firstname);
      data.append('lastname', formData.lastname);
      if (formData.password) {
        data.append('password', formData.password);
      }
      if (formData.file) {
        data.append('file', formData.file);
      }
  
      const response = await axios.patch(`${API_URL}/updateuserprofile/${user._id}`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
  
      // Reset form data on success
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        file: null,
        previewfile: null
      });
  
      // Show success toast message
      if (response.data.message) {
        toast.success(response.data.message); // This triggers the success toast
      }
    } catch (err) {
      // Handle error case
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message); // Show error toast if there is an issue
        
      } else {
        toast.error('Error updating profile');
      }
    } finally {
      setLoading(false);
      const timer = setTimeout(() => {
        navigate('/userprofile');
      }, 4000);
      setLoading(false);
    }
  };
  
  return (
    <div className="registration-form-container">
      <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '20px', textTransform: 'uppercase' }}>Edit Profile</h2>
      
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="profile-picture-container" onClick={handleCircleClick}>
          <div className="profile-picture">
            {formData.previewfile ? (
              <img src={formData.previewfile} alt="Profile" className="profile-preview" />
            ) : (
              <div className="empty-profile-circle">Add the Profile Picture</div>
            )}
          </div>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="firstname">FirstName</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">LastName</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <button className="Update" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
