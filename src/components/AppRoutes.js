import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound'; // Trang 404

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} /> {/* Trang 404 cho các tuyến đường không khớp */}
    </Routes>
  );
};

export default AppRoutes;
