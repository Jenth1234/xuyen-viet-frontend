import React from 'react';
import NavBar from '../components/nav/NavBar'; // Đảm bảo đường dẫn đúng
import FlightOffer from '../components/Flight/FlightOffer'

const ExplorePage = () => {
  return (
    <>
      <NavBar />
      <div className="container ">
        <h1 className="text-4xl font-bold mb-6 text-blue-600"></h1>

  <FlightOffer />
      </div>
    
    </>
  );
};

export default ExplorePage;
