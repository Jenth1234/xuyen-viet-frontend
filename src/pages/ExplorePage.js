import React from 'react';
// import NavBar from '../components/NavBar'; // Đảm bảo đường dẫn đúng
import Explore from '../components/explore/Explore'; // Đổi tên để tránh xung đột
// import SphereViewer from '../components/SphereViewer';
import Footer from '../components/Footer'
const ExplorePage = () => {
  return (
    <>
  
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Lên Lịch Trình</h1>
        <p>Chức năng lập kế hoạch chuyến đi sẽ được thêm vào đây.</p>
        {/* Thêm nội dung và chức năng lập lịch trình tại đây */}
      </div>
      <Explore /> {/* Sử dụng tên mới để tránh xung đột */}
      {/* <SphereViewer/> */}
      <Footer/>
    </>
  );
};

export default ExplorePage;
