import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './feed.css';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../Loading/loading';
import Nodata from '../NoData/Nodata';
import Cookies from 'js-cookie';
import { useAuth } from "../auth/auth"

const Feed = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const { user , token } = useAuth()

  useEffect(() => {
   
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://memories-server-1iig.onrender.com/getposts',
      {
        headers: {
          Authorization: `${token}`
        }
      });
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateLikes = async (id, newLikes) => {
    try {
      await axios.patch(`https://memories-server-1iig.onrender.com/getposts/${id}`, { likes: newLikes });
      // Update likes count in the state
      setData(data.map(post => post._id === id ? { ...post, likes: newLikes } : post));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const deletePost = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await axios.delete(`https://memories-server-1iig.onrender.com/delete/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if token is not present
      window.location.href = '/login';
    }
  }, []);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Nodata />
    );
  }

  return (
    <div className="container">
      {data.slice(0).reverse().map((post) => (
        <div className="f-card child" key={post._id}>
          <div className="header">
            <div className="options">
              <i className="fa fa-chevron-down" onClick={handleToggleOptions}></i>
              {showOptions && (
                <div className="options-list" style={{ color: 'black' }}>
                  <div /*onClick={() => deletePost(post._id)}*/><i className="fa fa-trash-o">&nbsp;Delete</i></div>
                </div>
              )}
            </div>
            <img className="co-logo" src="http://placehold.it/40x40" alt="*" />
            <div className="co-name"><Link>{post.name.charAt(0).toUpperCase() + post.name.slice(1)} Added a Post</Link></div>
            <div className="time"><Link>{post.createdAt.slice(2, 10)}</Link> <i className="fa fa-globe"></i></div>
          </div>
          <div className="content">
            <p>{post.description}</p>
          </div>
          <div className="reference">
            <img className="reference-thumb" src={post.url} alt={post.name} />
          </div>
          <div className="social">
            <div className="social-content"></div>
            <div className="social-buttons">
              <span><button onClick={() => updateLikes(post._id, post.likes + 1)}><i className="fa fa-thumbs-up"></i>{post.likes > 0  ? post.likes : 0   }</button></span>
              <span><button onClick={() => updateLikes(post._id, post.likes - 1)}><i className="fa fa-thumbs-down"></i></button></span>
              <span><i className="fa fa-comment"></i>Comment</span>
              <span><i className="fa fa-share"></i>Share</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
