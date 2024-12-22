import React, { useEffect, useState } from 'react';
import './userprofile.css'; // Updated CSS file
import { useAuth } from '../auth/auth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Config';

const UserProfile = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const dummyimage =
        'https://res.cloudinary.com/dxw6gft9d/image/upload/v1734781057/memories/kwtsycu7ozhjcmailiyz.jpg';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgSrc, setImgSrc] = useState(user.profilePicture || dummyimage);

    const handleImgError = () => {
        setImgSrc(dummyimage);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/user/${user.username}/posts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [user.username, token]);

    return (
        <div className="user-profile">
            <header>
                <div className="container">
                    <div className="profile">
                        <div style={{display:'flex',flexDirection:"row",alignItems:'center',padding:'2px'}}>
                            <div className="profile-image">
                                <img
                                    src={imgSrc}
                                    alt={`${user.username}'s profile`}
                                    onError={handleImgError}
                                />
                            </div>
                            <div className="profile-user-details">
                                <div className='username'>{user.username}</div>
                                <Link to='/editprofile' className="btn btn-primary">Edit Profile</Link>
                            </div>
                        </div>
                        <div>
                            <div className="profile-stats" style={{justifyContent:'center',alignItems:"center"}}>
                                <ul>
                                    <li>
                                        <span>{user.posts ? user.posts.length : 0}</span>
                                        Posts
                                    </li>
                                    <li>
                                        <span>0</span>
                                        Followers
                                    </li>
                                    <li>
                                        <span>0</span>
                                        Following
                                    </li>
                                </ul>
                            </div>
                            <div className="profile-bio">
                                <p>
                                    <strong>{`${user.firstname} ${user.lastname}`}</strong> Lorem
                                    ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    {loading ? (
                        <div className="loader"></div>
                    ) : posts.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts yet.</p>
                            <Link to="/upload" className="btn btn-secondary">
                                Add Post
                            </Link>
                        </div>
                    ) : (
                        <div className="gallery">
                            {posts.slice(0).reverse().map((post) => (
                                <div key={post._id} className="gallery-item">
                                    <img
                                        src={post.url}
                                        alt="Post"
                                        className="gallery-image"
                                    />
                                    <div className="gallery-item-info">
                                        <p>
                                            <i className="fa fa-thumbs-up"></i> {post.likes}
                                        </p>
                                        <p>
                                            <i className="fa fa-comment"></i>{' '}
                                            {post.comments ? post.comments.length : 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
