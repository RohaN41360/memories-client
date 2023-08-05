import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './upload.css'
import LoadingSpinner from '../Loading/loading';


const UploadForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // console.log(file);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      // http://localhost:5000 
      await axios.post('https://memories-server-1iig.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('File uploaded successfully');
      navigate('/');
      setName('');
      setDescription('');
      document.getElementById('file').value = '';
      
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <div className="container">
        <div className="title">Create A Post</div>
        <form id="addpost" action="#" onSubmit={handleSubmit}>
          <div className="user__details">
            <div className="input__box">
              <span className="details">Full Name</span>
              <input type="text" value={name} onChange={handleNameChange} placeholder="E.g: John Smith" required />
            </div>
            <div className="input__box">
              <span className="details">Description</span>
              <input
                id="description"

                value={description}
                onChange={handleDescriptionChange}
                required
              />
            </div>
            <div className="input__box">
              <span className="details">Image</span>
              <input type="file" id="file" onChange={handleFileChange} required />
            </div>
          </div>

          {error && <div className="error" style={{color:'red'}}>{error}</div>}

          <div className="button">
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
