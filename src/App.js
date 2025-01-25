  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React, { useState , useEffect} from 'react';
import axios from 'axios';
import UploadForm from './components/upload/upload';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/feed';
import Notfound from './components/notfound/Notfound';
import RegistrationForm from './components/registration/registration';
import Login from './components/login/login';
import Auth from "./components/auth/auth"
import Userprofile from './components/user Profile/userprofile';
import ViewProfile from './components/UserProfile/ViewProfile';
import EditProfile from './components/EditUserProfile/EdituserProfile';
import Search from './components/Search/Search';

function App() {
  
  return (
    <div className="App">
       <Router>
   
      <Navbar />
     
      <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/userregistration" element={<RegistrationForm />} />
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="/user/:username" element={<ViewProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
