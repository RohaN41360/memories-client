import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../auth/auth';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  
  // Toggle the mobile menu
  const handleNavToggle = () => {
    if(!isLoggedIn)
    {
      window.location.href = '/';
    }
    setNavOpen(!navOpen);
  };

  // Close the menu when a link is clicked
  const closeMenu = () => {
    setNavOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear('token');
    window.location.href = '/';
  };

  return (
    <nav className={`nav ${navOpen ? 'nav-open' : ''}`}>
      <div className="nav-header">
        <div className="nav-title">
          <Link to="/" onClick={closeMenu}>Memories</Link>
        </div>
      </div>

      {/* Hamburger button for mobile */}
      <div className="nav-btn" onClick={handleNavToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation links */}
      <ul className={`nav-list ${navOpen ? 'nav-list-open' : ''}`}>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/userregistration" onClick={closeMenu}>
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/upload" onClick={closeMenu}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/userprofile" onClick={closeMenu}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
