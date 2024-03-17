import React, { useState, useRef } from 'react';
import './RegistrationForm.css';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    file: null,
    previewfile:null
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      previewfile:URL.createObjectURL(file),
      file: file,
      
    }));
    
  };

  const handleCircleClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit =async (e) => {
    try{
    e.preventDefault();
    // Add your form submission logic here
    // http://localhost:5000
    // https://memories-server-1iig.onrender.com/getusers 
    const data = await axios.post('https://memories-server-1iig.onrender.com/newuser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    console.log(formData);
    console.log(data);
    setFormData({
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        file: null,
        previewfile:null
    })
    if(data)
    {
        alert(data.data.message)
    }
  }catch(err)
  {
    console.log(err)
    alert(err.response.data.message)
    console.log(err.response.data.message)
  }
    
  };

  return (
    <div className="registration-form-container">
      <h2>Sign up to Memories</h2>
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
        <button className='signup' type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
