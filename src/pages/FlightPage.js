import React from 'react';
import NavBar from '../components/nav/NavBar'; // Đảm bảo đường dẫn đúng
import FlightOffer from '../components/FlightOffer'

const ExplorePage = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Lên Lịch Trình</h1>
        <p>Chức năng lập kế hoạch chuyến đi sẽ được thêm vào đây.</p>
        {/* Thêm nội dung và chức năng lập lịch trình tại đây */}
      </div>
      <FlightOffer />
    </>
  );
};

export default ExplorePage;
