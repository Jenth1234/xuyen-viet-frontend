import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Đảm bảo đường dẫn chính xác

import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ExplorePage from './pages/ExplorePage';
import Itinerary from './pages/Itinerary';
import CreateItinerary from './pages/CreateItinerary';
import FlightPage from './pages/FlightPage';
import Chitiet from './pages/chitiet';
import ProvinceDetail  from './components/explore/ProvinceDetail'

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/xuyen-viet-frontend">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapPage" element={<MapPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explorePage" element={<ExplorePage />} />
          <Route path="/attraction/:id" element={<ProvinceDetail />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/create-itinerary" element={<CreateItinerary />} />
          <Route path="/flightPage" element={<FlightPage />} />
          <Route path="/chitiet" element={<Chitiet />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
