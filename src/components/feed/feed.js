import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './feed.css';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Loading/loading';
import Nodata from '../NoData/Nodata';
import { useAuth } from "../auth/auth";
import { API_URL } from '../../Config';

const POSTS_PER_PAGE = 5; // Number of posts to load at a time

const Feed = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const observer = useRef();
  const [allPosts, setAllPosts] = useState([]);

  const dummyImage = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1734781057/memories/kwtsycu7ozhjcmailiyz.jpg';

  // Last element ref callback for infinite scroll
  const lastPostElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchAllPosts();
    }
  }, [navigate]);

  // Fetch all posts initially
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/getposts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllPosts(response.data.reverse()); // Reverse the array once
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  // Update displayed posts when page changes
  useEffect(() => {
    if (allPosts.length > 0) {
      const startIndex = 0;
      const endIndex = page * POSTS_PER_PAGE;
      const newData = allPosts.slice(startIndex, endIndex);
      setData(newData);
      setHasMore(endIndex < allPosts.length);
    }
  }, [page, allPosts]);

  const updateLikes = async (id, newLikes) => {
    try {
      if (likedPosts.includes(id)) return;
      await axios.patch(`${API_URL}/getposts/${id}`, { likes: newLikes });
      setLikedPosts([...likedPosts, id]);
      setAllPosts(prevPosts =>
        prevPosts.map(post =>
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

  if (allPosts.length === 0) {
    return <Nodata />;
  }

  return (
    <div className="container" style={{flexDirection:'column'}}>
      {data.map((post, index) => (
        <div 
          className="f-card child" 
          key={post._id}
          ref={index === data.length - 1 ? lastPostElementRef : null}
        >
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
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default Feed;
