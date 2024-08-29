import React from 'react';
import NavBar from '../components/NavBar'; // Đảm bảo đường dẫn đúng
import Explore from '../components/explore/Explore';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      
      
      <main className="flex-1 p-5 flex flex-col">
        <div className="mb-10">
        <NavBar />
      </div>
        <Explore />
        <div className="flex flex-1 mt-5 gap-5">
          <div className="flex-1 overflow-hidden">
            {/* Nơi để thêm nội dung khác, ví dụ MapPage hoặc các phần khác */}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
