import React, { useState, useEffect } from 'react';
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
  const [previewFile, setPreviewFile] = useState(null); // State to store the file preview

  const { user, token } = useAuth();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewFile(URL.createObjectURL(selectedFile)); // Create a preview URL for the selected file
    }
  };

  useEffect(() => {
    setName(user.firstname + " " + user.lastname); // Set name only once when component mounts
  }, [user.firstname, user.lastname]);

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

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      navigate('/');

      setDescription('');
      setFile(null);
      setPreviewFile(null); // Clear the preview after successful upload

    } catch (err) {
      setError(err.response.data.error);
      console.log(err);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="upload-form-container">
      <div className="form-wrapper">
        <h2>Create A Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" value={name} placeholder="E.g: John Smith" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file" className="custom-file-label">Choose an Image</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
              style={{ display: 'none' }} // Hide the default file input
            />
            <button type="button" className="file-upload-button" onClick={() => document.getElementById('file').click()}>
              Choose Image
            </button>
          </div>

          {/* Preview selected image */}
          {previewFile && (
            <div className="image-preview-container">
              <img src={previewFile} alt="Selected" className="image-preview" />
            </div>
          )}

          <button style={{marginTop:'10px'}} type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
