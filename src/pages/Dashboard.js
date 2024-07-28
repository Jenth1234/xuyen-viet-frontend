import React from 'react';
import Sidebar from '../components/Sidebar'; // Đảm bảo đường dẫn đúng
import MapPage from './MapPage';
import ProvinceList from '../components/ProvinceList';
import Statistics from '../components/Statistics';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <h2>Dashboard Content</h2>
        
        <div style={styles.contentWrapper}>
          <div style={styles.mapPageWrapper}>
            <MapPage />
          </div>
          <div style={styles.provinceListWrapper}>
            {/* <ProvinceList /> */}
            <Statistics/>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column', // Đảm bảo các phần tử con trong mainContent nằm theo chiều dọc
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row', // Đảm bảo các phần tử con nằm theo chiều ngang
    gap: '20px', // Khoảng cách giữa các phần tử con
  },
  mapPageWrapper: {
    flex: '0 1 40%', // MapPage chiếm 50% chiều rộng
    overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài
  },
  provinceListWrapper: {
    flex: '1', // ProvinceList chiếm phần còn lại
    overflow: 'auto', // Đảm bảo ProvinceList có thanh cuộn nếu nội dung quá lớn
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    marginRight: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Dashboard;
