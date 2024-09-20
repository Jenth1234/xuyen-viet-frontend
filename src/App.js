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
import CreateItinerary from './components/itinerary/CreateItinerary';
import FlightPage from './pages/FlightPage';
import DetailItinerary from './components/itinerary/DetailItinerary';
import UpdateDetailItinerary from './components/itinerary/UpdateDetailItinerary';
import AttractionList  from './components/explore/AttractionList'
import NavBar from './components/NavBar';
import AttractionDetail from './components/explore/AttractionDetail';
const App = () => {
  return (
 
    <AuthProvider>
      <Router basename="/xuyen-viet-frontend">
       <NavBar />
        <Routes>
            
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapPage" element={<MapPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explorePage" element={<ExplorePage />} />
          <Route path="/attraction/:provinceName" element={<AttractionList />} />
          <Route path="/attraction/:provinceName/:type/:provinceNameSub" element={<AttractionDetail />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/create-itinerary" element={<CreateItinerary />} />
          <Route path="/flightPage" element={<FlightPage />} />
          <Route path="/itinerary/:itineraryId" element={<DetailItinerary />} />
          <Route path="/itinerary/:itineraryId/update" element={<UpdateDetailItinerary />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
