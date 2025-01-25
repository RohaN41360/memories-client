import React, { useEffect, useState } from 'react';
import './userprofile.css'; // Updated CSS file
import { useAuth } from '../auth/auth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Config';
import Toast from '../Toast/Toast';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

const UserProfile = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const dummyImage = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1734781057/memories/kwtsycu7ozhjcmailiyz.jpg';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgSrc, setImgSrc] = useState(user.profilePicture || dummyImage);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        postId: null
    });

    const handleImgError = () => {
        setImgSrc(dummyImage);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
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
            showToast('Failed to load posts. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (postId) => {
        setConfirmDialog({
            isOpen: true,
            postId
        });
    };

    const handleConfirmDelete = async () => {
        const postId = confirmDialog.postId;
        setConfirmDialog({ isOpen: false, postId: null });
        
        try {
            const response = await axios.delete(`${API_URL}/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            showToast('Post deleted successfully', 'success');
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            if (error.response?.status === 401) {
                showToast('Session expired. Please login again.', 'error');
                navigate('/login');
            } else {
                showToast(error.response?.data?.message || 'Error deleting post', 'error');
            }
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [user.username, token]);

    return (
        <div className="user-profile">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="container">
                <div className="profile">
                    <div className="profile-header">
                        <div className="profile-image">
                            <img
                                src={imgSrc}
                                alt={`${user.username}'s profile`}
                                onError={handleImgError}
                            />
                        </div>
                        <div className="profile-info">
                            <div className="profile-user-details">
                                <h1 className="username">{user.username}</h1>
                                <div className="profile-actions">
                                    <Link to="/editprofile" className="btn btn-primary">
                                        Edit Profile
                                    </Link>
                                    <Link to="/upload" className="btn btn-secondary">
                                        Add Post
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="profile-stats">
                                <ul>
                                    <li>
                                        <span>{posts.length}</span>
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
                                    <strong>{`${user.firstname} ${user.lastname}`}</strong>
                                    <br />
                                    {user.bio || 'No bio yet. Click Edit Profile to add one!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <main>
                    {loading ? (
                        <div className="loader"></div>
                    ) : posts.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts yet.</p>
                            <Link to="/upload" className="btn btn-secondary">
                                Create Your First Post
                            </Link>
                        </div>
                    ) : (
                        <div className="gallery">
                            {posts.slice(0).reverse().map((post) => (
                                <div key={post._id} className="gallery-item">
                                    <img
                                        src={post.url}
                                        alt={post.description || 'Post'}
                                        className="gallery-image"
                                    />
                                    <div className="gallery-item-info">
                                        <div className="gallery-item-stats">
                                            <span>
                                                <i className="fa fa-thumbs-up"></i> {post.likes || 0}
                                            </span>
                                            <span>
                                                <i className="fa fa-comment"></i>{' '}
                                                {post.comments?.length || 0}
                                            </span>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(post._id)}
                                            disabled={deleting}
                                            title="Delete post"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, postId: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
            />
        </div>
    );
};

export default UserProfile;
