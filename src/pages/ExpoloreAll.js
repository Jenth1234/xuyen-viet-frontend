// src/components/ExplorePage.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const ExploreAll = () => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Khám Phá</h2>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/explore/explorePage" className="text-blue-500 hover:underline">
              Địa Điểm
            </Link>
          </li>
          <li>
            <Link to="/explore/vote" className="text-blue-500 hover:underline">
              Bình Chọn
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default ExploreAll;
