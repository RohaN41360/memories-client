
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UploadForm from './components/upload/upload';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/feed';

function App() {
  return (
    <div className="App">
       <Router>
      <Navbar />
     
      <Routes>
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
