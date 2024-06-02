import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
// import Cookies from 'js-cookie'; // Import js-cookie library
import { useAuth } from '../auth/auth';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem ('token')); // Check if token exists in cookies
  const {isLoggedIn} = useAuth();

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    // Remove token 
    
    localStorage.clear('token');
    // Update login state
    
    window.location.href = '/';
  };

  return (
    <nav className={`nav ${navOpen ? 'nav-open' : ''}`}>
      <input type="checkbox" id="nav-check" checked={navOpen} />
      <div className="nav-header">
        <div className="nav-title">
          <Link to="/" onClick={handleNavToggle}> Memories</Link>
        </div>
      </div>
      <div className="nav-btn" onClick={handleNavToggle}>
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <ul className="nav-list">
        
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/userregistration" onClick={handleNavToggle}>
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={handleNavToggle}>
                Login
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/" onClick={handleNavToggle}>
                <i className="fa fa-home"></i>Home
              </Link>
            </li>
            <li>
              <Link to="/upload" onClick={handleNavToggle}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/userprofile" onClick={handleNavToggle}>
                Profile
              </Link>
            </li>
            <li>
              <Link onClick={handleLogout} >
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
