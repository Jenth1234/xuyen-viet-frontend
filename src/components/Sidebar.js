import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Trạng thái để điều khiển sự mở rộng
  const token = localStorage.getItem('accessToken');
  const { user, loading, error } = useUserInfo(token);
  const navigate = useNavigate();

  // Hàm chuyển hướng đến trang đăng ký
  const goToRegister = () => {
    navigate('/register');
  };

  // Hàm chuyển hướng đến trang đăng nhập
  const goToLogin = () => {
    navigate('/login');
  };

  // Hàm chuyển hướng đến trang đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  // Hàm để chuyển đổi trạng thái của Sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <aside style={{ ...styles.sidebar, width: isCollapsed ? '30px' : '250px' }}>
      {!isCollapsed && (
        <div style={styles.buttonContainer}>
          {token ? (
            <button onClick={handleLogout} style={styles.button}>Đăng xuất</button>
          ) : (
            <>
              <button onClick={goToRegister} style={styles.button}>Đăng ký</button>
              <button onClick={goToLogin} style={styles.button}>Đăng nhập</button>
            </>
          )}
        </div>
      )}
      {!isCollapsed && (
        <>
          <div style={styles.userInfo}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>No Avatar</div>
            )}
            <div style={styles.userName}>{user?.fullName || 'User'}</div>
          </div>
          
          <ul style={styles.menuList}>
            <li style={styles.menuItem}>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/map" style={styles.link}>Map</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/settings" style={styles.link}>Settings</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/profile" style={styles.link}>Profile</Link>
            </li>
          </ul>
        </>
      )}
      <button onClick={toggleSidebar} style={styles.button}>
        {isCollapsed ? '>>' : '<<'}
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#f4f4f4',
    padding: '15px',
    
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    overflow: 'hidden', // Đảm bảo rằng nội dung không vượt ra ngoài khi thu gọn
    transition: 'width 0.3s ease', // Hiệu ứng chuyển động khi thay đổi kích thước
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
    marginBottom: '20px',
    width: '100%',
  },
  button: {
    marginBottom: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '100%',
    textAlign: 'left',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '500',
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    margin: '30px 0',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: '500',
    fontSize:'20px'
  }
};

export default Sidebar;
