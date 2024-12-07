import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Đảm bảo đường dẫn chính xác
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ExplorePage from './pages/ExplorePage'; 
import Itinerary from './pages/Itinerary';
import CreateItinerary from './components/itinerary/CreateItinerary';

import FlightPage from './pages/FlightPage';
import FlightList from './components/Flight/FightList'
import BookingFlight from './components/Flight/BookingFlight';
import ReviewBooking from './components/Flight/ReviewBooking';

import HotelBooking from './pages/Hotel';
import HotelDetail from './components/Hotel/HotelDetail';
import BookingHotel from './components/Hotel/BookingHotel';

import DetailItinerary from './components/itinerary/DetailItinerary';
import UpdateDetailItinerary from './components/itinerary/UpdateDetailItinerary';
import AttractionList from './components/explore/AttractionList';
import NavBar from './components/nav/NavBar';
import AttractionDetail from './components/explore/AttractionDetail';
import ExploreAll from './pages/ExpoloreAll'; // Đảm bảo import đúng
import Vote from './pages/Vote'; // Đảm bảo import đúng
import '@fortawesome/fontawesome-free/css/all.min.css';
import SuggestItinerary from './pages/SuggestItinerary'
import SuggestPlace from './components/itinerary/SuggestPlace'
import HotelSearchResults from './components/Hotel/HotelSearchResults';
import Promotions from './pages/Promotions'; // Thêm import cho trang K
const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Router basename="/xuyen-viet-frontend">
      
        <NavBar className="" />
        <div className="container max-h-screen mt-20 mx-auto p-4"> 
            <Routes>
        

          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mapPage" element={<PrivateRoute element={<MapPage />} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
    {/* khuyen mai */}
          <Route path="/promotions" element={<Promotions />} />
         
          <Route path="/explore/explorePage" element={<ExplorePage />} />
          <Route path="/explore/vote" element={<Vote />} />
          
          <Route path="/attraction/:provinceName" element={<AttractionList />} />
          <Route path="/attraction/:provinceName/:type/:provinceNameSub" element={<AttractionDetail />} />
          <Route path="/place/:placeId" element={<AttractionDetail />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/attraction/:id" element={<AttractionDetail />} />
          <Route path="/create-itinerary" element={<CreateItinerary />} />

          <Route path="/flight" element={<PrivateRoute element={<FlightPage />} />} />
          <Route path="/flight-list" element={<PrivateRoute element={<FlightList />} />} />
          <Route path="/booking-flight" element={<PrivateRoute element={<BookingFlight />} />} />
          <Route path="/review-booking-flight" element={<PrivateRoute element={<ReviewBooking />} />} />

    {/* khách sạn */}
          <Route path="/hotels" element={<PrivateRoute element={<HotelBooking />} />} />
          <Route path="/hotel-search-results" element={<PrivateRoute element={<HotelSearchResults />} />} />
          <Route path="/hotel/:hotelId" element={<PrivateRoute element={<HotelDetail />} />} />
          <Route path="/booking-hotel" element={<PrivateRoute element={<BookingHotel />} />} />
          
          <Route path="/itinerary/:itineraryId" element={<PrivateRoute element={<DetailItinerary />} />} />
          <Route path="/suggest-itinerary" element={<PrivateRoute element={<SuggestItinerary />} />} />
          <Route path="/suggest-place" element={<PrivateRoute element={<SuggestPlace />} />} />
          <Route path="/itinerary/:itineraryId/update" element={<PrivateRoute element={<UpdateDetailItinerary />} />} />
        </Routes>
        </div>
      
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

const PrivateRoute = ({ element }) => {
  const { isTokenExists } = useAuth(); // Lấy hàm isTokenExists từ AuthContext

  return isTokenExists() ? element : <Navigate to="/login" />; // Nếu token tồn tại, trả về element, ngược lại điều hướng về login
};

export default App;
