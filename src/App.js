import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Đảm bảo đường dẫn chính xác

import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ExplorePage from './pages/ExplorePage'; // Không sử dụng trong route
import Itinerary from './pages/Itinerary';
import CreateItinerary from './components/itinerary/CreateItinerary';
import FlightPage from './pages/FlightPage';
import DetailItinerary from './components/itinerary/DetailItinerary';
import UpdateDetailItinerary from './components/itinerary/UpdateDetailItinerary';
import AttractionList from './components/explore/AttractionList';
import NavBar from './components/nav/NavBar';
import AttractionDetail from './components/explore/AttractionDetail';
import ExploreAll from './pages/ExpoloreAll'; // Đảm bảo import đúng
import Vote from './pages/Vote'; // Đảm bảo import đúng
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/xuyen-viet-frontend">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mapPage" element={<PrivateRoute element={<MapPage />} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

         
          <Route path="/explore/explorePage" element={<ExplorePage />} />
          <Route path="/explore/vote" element={<Vote />} />
          
          <Route path="/attraction/:provinceName" element={<AttractionList />} />
          <Route path="/attraction/:provinceName/:type/:provinceNameSub" element={<AttractionDetail />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/create-itinerary" element={<CreateItinerary />} />
          <Route path="/flightPage" element={<PrivateRoute element={<FlightPage />} />} />
          <Route path="/itinerary/:itineraryId" element={<PrivateRoute element={<DetailItinerary />} />} />
          <Route path="/itinerary/:itineraryId/update" element={<PrivateRoute element={<UpdateDetailItinerary />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = ({ element }) => {
  const { isTokenExists } = useAuth(); // Lấy hàm isTokenExists từ AuthContext

  return isTokenExists() ? element : <Navigate to="/login" />; // Nếu token tồn tại, trả về element, ngược lại điều hướng về login
};

export default App;
