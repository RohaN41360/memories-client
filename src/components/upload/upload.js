import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './upload.css';
import LoadingSpinner from '../Loading/loading';
import { API_URL } from '../../Config';
import { useAuth } from '../auth/auth';

const UploadForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    setName(user.firstname + " " + user.lastname);
  }, [user.firstname, user.lastname]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setError('');
      setFile(selectedFile);
      setPreviewFile(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Clean up the preview URL
      if (previewFile) {
        URL.revokeObjectURL(previewFile);
      }

      navigate('/', { state: { message: 'Post created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while uploading');
      console.error('Upload error:', err);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="upload-form-container">
      <div className="form-wrapper">
        <h2>Share Your Moment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Creator</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              placeholder="Your name will appear here" 
              disabled 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Express Yourself</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Share what's happening in this moment..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file" className="custom-file-label">Add Photo</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div
              className={`file-upload-button ${isDragging ? 'dragging' : ''}`}
              onClick={() => document.getElementById('file').click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <i className="fa fa-cloud-upload"></i>
              {file ? 'Change Photo' : 'Drop your photo here or click to browse'}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {previewFile && (
            <div className="image-preview-container">
              <img src={previewFile} alt="Preview" className="image-preview" />
            </div>
          )}

          <button 
            type="submit" 
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Sharing...' : 'Share Memory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
