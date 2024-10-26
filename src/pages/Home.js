// src/components/HomePage.js
import React from 'react';
import Search from '../components/Search'; // Import component Search


const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">


      {/* Thanh tìm kiếm */}
      <div className="flex justify-center mt-8">
        <Search />
      </div>

      {/* Giới thiệu */}
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold">Khám phá Việt Nam với chúng tôi</h2>
        <p className="mt-4">Journey Around Vietnam giúp bạn theo dõi hành trình du lịch, tìm kiếm địa điểm và chia sẻ kỷ niệm.</p>
      </div>

      {/* Các điểm đến nổi bật */}
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold">Điểm đến nổi bật</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
    
        </div>
      </div>

 
   
    </div>
  );
};

export default HomePage;
