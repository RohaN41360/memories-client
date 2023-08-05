import { Link } from 'react-router-dom';
import './navbar.css';
import React, { useState } from 'react';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  return (
    <nav className={`nav ${navOpen ? 'nav-open' : ''}`}>
      <input type="checkbox" id="nav-check" checked={navOpen} />
      <div className="nav-header">
        <div className="nav-title"><Link to="/feed" onClick={handleNavToggle}> Memories</Link></div>
      </div>
      <div className="nav-btn" onClick={handleNavToggle}>
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <ul className="nav-list">
        <li>
          <Link to="/feed" onClick={handleNavToggle}>
            <i className="fa fa-home"></i>Home
          </Link>
        </li>
        <li>
          <Link to="/upload" onClick={handleNavToggle}>
            Create Post
          </Link>
        </li>
        {/* <li>
          <Link to="/feed" onClick={handleNavToggle}>
            Feed
          </Link>
        </li> */}
        {/* <li>
          <Link to="*" onClick={handleNavToggle}>
            About-Us
          </Link>
        </li>
        <li>
          <Link to="*" onClick={handleNavToggle}>
            Contact-Us
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
