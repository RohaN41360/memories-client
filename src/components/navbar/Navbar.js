import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../auth/auth';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isLoggedIn, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Toggle the mobile menu
  const handleNavToggle = () => {
    setNavOpen(!navOpen);
    document.body.classList.toggle('nav-open');
  };

  // Close the menu when a link is clicked
  const closeMenu = () => {
    setNavOpen(false);
    document.body.classList.remove('nav-open');
  };

  // Handle logout
  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && navOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navOpen]);

  // Clean up body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, []);

  // Don't render navigation while checking authentication
  if (isLoading) {
    return null;
  }

  return (
    <nav className={`nav ${navOpen ? 'nav-open' : ''}`}>
      <div className="nav-header">
        <div className="nav-title">
          <Link to="/" onClick={closeMenu}>Memories</Link>
        </div>
      </div>

      <button className="nav-btn" onClick={handleNavToggle} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className="nav-list">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/userregistration" onClick={closeMenu}>
                Join Now
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeMenu}>
                Sign In
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" onClick={closeMenu}>
                Feed
              </Link>
            </li>
            <li>
              <Link to="/upload" onClick={closeMenu}>
                Share Memory
              </Link>
            </li>
            <li>
              <Link to="/userprofile" onClick={closeMenu}>
                My Space
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={closeMenu}>
                Discover
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link-button">
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
