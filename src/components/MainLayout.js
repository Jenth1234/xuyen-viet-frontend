// components/MainLayout.js
import React from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import { Outlet } from 'react-router-dom'; // Outlet để hiển thị các trang con

const MainLayout = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.content}>
        <Outlet /> {/* Đây là nơi nội dung của các trang con sẽ được hiển thị */}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: '20px',
  },
};

export default MainLayout;
