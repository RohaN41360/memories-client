import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './upload.css';
import LoadingSpinner from '../Loading/loading';
// import Cookies from 'js-cookie';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../auth/auth';

const UploadForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const {  user ,token} = useAuth();
 
 
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    setName(user.firstname + " " + user.lastname); // Set name only once when component mounts
  }, [user.firstname,user.lastname]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  } 

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      const response = await axios.post('http://localhost:5000/upload', formData, {
      // const response = await axios.post('https://memories-server-1iig.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
        
      });
    
      alert(response.data.message)
      navigate('/')
      
      setDescription('');
      setFile(null);
      
    } catch (err) {
      setError(err.response.data.error);
      console.log(error)
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
            <input type="text" id="name" value={name}  placeholder="E.g: John Smith" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" value={description} onChange={handleDescriptionChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="file">Image</label>
            <input type="file"  id="file" onChange={handleFileChange} required />
          </div>

          {/* {error && <div className="error">{error}</div>} */}

          <button type="submit">Submit</button>
          
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
