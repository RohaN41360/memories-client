import React, { useState, useRef } from 'react';
import './RegistrationForm.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../auth/auth';


const RegistrationForm = () => {
  
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    file: null,
    previewfile: null
  });

  const {storeTokenInLocalStorage} = useAuth();
  const [loading, setLoading] = useState(false); // State for loading indicator
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file)
    {
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
    setLoading(true); // Set loading state to true when form is submitted
    
    try {
      
      // if(formData.file === null)
      // {
      //   toast.error("please add the user profile photo");
      //   return;
      // }
      
      // https://memories-server-1iig.onrender.com/getusers
      const data = await axios.post(
        'https://memories-server-1iig.onrender.com/newuser',
        // 'http://localhost:5000/newuser',
        formData,
        {
           headers: {
          "Content-Type": "multipart/form-data",
        },
        }
      );
      
      setFormData({
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        file: null,
        previewfile: null
      });
      console.log(data)
      if (data) {
      
        storeTokenInLocalStorage(data.data.token)
        toast.success(data.data.message);
        window.location.href = '/';
      }
    } catch (err) {
      console.log(err);
      toast.info(err.response.data.message);
      // console.log(err.response.data.message);
    } finally {
      setLoading(false); // Reset loading state after receiving response from server
    }
  };

  

  return (
    <div className="registration-form-container">
      <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '20px', textTransform: 'uppercase' }}>Sign up to Memories</h2>

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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
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
          <label htmlFor="LastName">LastName</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <button className="signup" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
