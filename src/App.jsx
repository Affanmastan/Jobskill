import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import CvAnalysis from "./components/pages/CvAnalysis";
import Contact from "./components/pages/Contacts";
import Features from "./components/pages/Features";
import Recommendations from "./components/pages/Recommendations";
import Courses from "./components/pages/Courses";
import JobGapAnalysis from "./components/pages/JobGapAnalysis";

const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/cv-analysis' element={<CvAnalysis />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/search-courses" element={<Courses />} />
        <Route path="/jobgap" element={<JobGapAnalysis />} />
      </Routes>
    </Router>
  );
};

export default App;
