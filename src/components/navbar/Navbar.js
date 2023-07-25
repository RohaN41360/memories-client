import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    
    <nav className="nav">
    <input type="checkbox" id="nav-check" />
    <div className="nav-header">
      <div className="nav-title">
        Memories
      </div>
    </div>
    <div className="nav-btn">
      <label for="nav-check">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
    
    <ul className="nav-list">
      <li><Link to="/feed"><i className="fa fa-home"></i>Home</Link></li>
    <li><Link to="/upload">Create Post</Link></li>
    {/* <li><Link to="/feed">Feed</Link></li> */}
      <li><Link to="*">About-Us</Link></li>
      <li><Link to="*">Contact-Us</Link></li>
    </ul>
  </nav>
  );
};

export default Navbar;