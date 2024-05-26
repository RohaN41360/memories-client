import React, { useEffect, useState } from 'react';
import './userprofile.css'; // Import your custom CSS for styling
import { useAuth } from '../auth/auth';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { user, token } = useAuth(); 
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login page if token is not present
          window.location.href = '/login';
        }
      }, []);
      
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${user.username}/posts`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                }); // Replace with your backend endpoint
                setPosts(response.data.posts);
                console.log(posts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [user.username, token]); // Depend on user.username and token

    return (
        <div>
            <header>
                <div className="container">
                    <div className="profile">
                        <div className="profile-image">
                            <img src={user.profilePicture} alt="" />
                        </div>
                        <div className="profile-user-settings">
                            <h1 className="profile-user-name">{user.username}</h1>
                            <button className="btn profile-edit-btn">Edit Profile</button>
                            <button className="btn profile-settings-btn" aria-label="profile settings">
                                <i className="fas fa-cog" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="profile-stats">
                            <ul>
                                <li><span className="profile-stat-count">{user.posts ? user.posts.length : 0}</span> posts</li>
                                <li><span className="profile-stat-count">0</span> followers</li>
                                <li><span className="profile-stat-count">0</span> following</li>
                            </ul>
                        </div>
                        <div className="profile-bio">
                            <p><span className="profile-real-name">{user.firstname + " " + user.lastname}</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="gallery">
                        {posts.length === 0 ? (
                            <div className="no-posts" style={{textAlign:'center'}}>
                                No posts yet. <Link to="/upload">Click Here to Add Post</Link>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post._id} className="gallery-item" tabIndex="0">
                                    <img src={post.url} className="gallery-image" alt="" />
                                    <div className="gallery-item-info">
                                        <ul>
                                            <li className="gallery-item-likes">
                                                <span className="visually-hidden">Likes:</span>
                                                <i className="fa fa-thumbs-up" aria-hidden="true"></i> {post.likes}
                                            </li>
                                            <li className="gallery-item-comments">
                                                <span className="visually-hidden">Comments:</span>
                                                <i className="fa fa-comment" aria-hidden="true"></i> {post.comments ? post.comments.length : 0}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
