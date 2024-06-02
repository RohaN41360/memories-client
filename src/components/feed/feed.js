import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './feed.css';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Loading/loading';
import Nodata from '../NoData/Nodata';
import { useAuth } from "../auth/auth"

const Feed = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const { user, token } = useAuth()
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]); // Track liked posts

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://memories-server-1iig.onrender.com/getposts', {
      // const response = await axios.get('http://localhost:5000/getposts', {
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
      // Check if the post is already liked by the user
      if (likedPosts.includes(id)) {
        return; // Exit if the post is already liked
      }
      await axios.patch(`https://memories-server-1iig.onrender.com/getposts/${id}`, { likes: newLikes });
      setLikedPosts([...likedPosts, id]); // Add post ID to liked posts
      // Update likes count in the state
      setData(data.map(post => post._id === id ? { ...post, likes: newLikes } : post));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

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
              {showOptions && (
                <div className="options-list" style={{ color: 'black' }}>
                  <div><i className="fa fa-trash-o">&nbsp;Delete</i></div>
                </div>
              )}
            </div>
            {post.user && post.user.profilePicture && (
            <img className="co-logo" src={post.user.profilePicture ? post.user.profilePicture : "http://placehold.it/40x40" } alt="User Profile" />
                    )}
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
              <span><button onClick={() => updateLikes(post._id, post.likes + 1)} style={{ color: likedPosts.includes(post._id) ? 'blue' : 'inherit' }}><i className="fa fa-thumbs-up"></i>{post.likes > 0 ? post.likes : 0}</button></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
