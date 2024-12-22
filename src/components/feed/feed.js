import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './feed.css';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Loading/loading';
import Nodata from '../NoData/Nodata';
import { useAuth } from "../auth/auth";
import { API_URL } from '../../Config';

const Feed = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]); // Track liked posts

  const dummyImage = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1734781057/memories/kwtsycu7ozhjcmailiyz.jpg';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getposts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const updateLikes = async (id, newLikes) => {
    try {
      if (likedPosts.includes(id)) return; // Prevent multiple likes
      await axios.patch(`${API_URL}/getposts/${id}`, { likes: newLikes });
      setLikedPosts([...likedPosts, id]);
      setData((prevData) =>
        prevData.map((post) =>
          post._id === id ? { ...post, likes: newLikes } : post
        )
      );
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleImgError = (e) => {
    e.target.src = dummyImage;
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return <Nodata />;
  }

  return (
    <div className="container">
      {data.slice(0).reverse().map((post) => (
        <div className="f-card child" key={post._id}>
          <div className="header">
            <img
              className="co-logo"
              src={post.user?.profilePicture || dummyImage}
              alt="User Profile"
              onError={handleImgError}
            />
            <div className="co-name">
              <Link>
                {post.name ? `${post.name.charAt(0).toUpperCase()}${post.name.slice(1)}` : 'User'}{' '}
              </Link>
            </div>
          </div>
          <div className="content">
            <p>{post.description || 'No description available.'}</p>
          </div>
          <div className="reference">
            <img
              className="reference-thumb"
              src={post.url || dummyImage}
              alt={post.name || 'Post Image'}
              onError={handleImgError}
            />
          </div>
          <div className="social">
            <div className="social-content"></div>
            <div className="social-buttons">
              <span>
                <button
                  onClick={() => updateLikes(post._id, post.likes + 1)}
                  style={{ color: likedPosts.includes(post._id) ? 'blue' : 'inherit' }}
                >
                  <i className="fa fa-thumbs-up"></i>
                  {post.likes > 0 ? post.likes : 0}
                </button>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
