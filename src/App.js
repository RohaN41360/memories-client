
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UploadForm from './components/upload/upload';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/feed';
import Notfound from './components/notfound/Notfound';
import RegistrationForm from './components/registration/registration';

function App() {
  return (
    <div className="App">
       <Router>
      <Navbar />
     
      <Routes>
      <Route path="/" element={<Feed />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/userregistration" element={<RegistrationForm />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
