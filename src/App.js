import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Thêm Navigate để điều hướng
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ExplorePage from './pages/ExplorePage';
import Itinerary from './pages/Itinerary';
import FlightPage from './pages/FlightPage'
import CreateItinerary from './pages/CreateItinerary'
import Chitiet from './pages/chitiet'

const App = () => {
  return (
    
    <Router>
      <Routes>
        {/* Định tuyến mặc định để chuyển hướng đến trang Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mapPage" element={<MapPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explorePage" element={<ExplorePage />} />
        <Route path="/itinerary" element={<Itinerary />}/>
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route path="/flightPage" element={<FlightPage />}/>
        <Route path="/chitiet" element={<Chitiet />}/>
      </Routes>
    </Router>
  );
};

export default App;
