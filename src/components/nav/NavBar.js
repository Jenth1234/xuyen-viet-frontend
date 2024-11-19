import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../style/img/logodd.png';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from 'antd';
import { getNotifications } from "../../api/ApiItinerary";

import {getUserInfo} from'../../api/callApi';
import {
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
  CarOutlined,
  CalendarOutlined,
  LogoutOutlined,
  LoginOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isTokenExists, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null); 
  const [isExploreSubNavVisible, setIsExploreSubNavVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await getNotifications();
        if (Array.isArray(response.notifications)) {
          setNotifications(response.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Không thể tải thông báo!');
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (isTokenExists()) {
      fetchNotifications();
    }
  }, [isTokenExists]);
  useEffect(() => {

    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();  
        console.log(data)
        setUserInfo(data);  
        setLoading(false);   
      } catch (err) {
        setError(err);       // If there was an error, store it in the state
        setLoading(false);   // Stop loading regardless of success or failure
      }
    };

    fetchUserInfo();
  }, []); 
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExploreSubNav = () => {
    setIsExploreSubNavVisible((prev) => !prev);
  };

  const handleNotificationClick = () => {
    setIsNotificationsVisible((prev) => !prev);
  };

  return (
    <nav className=" fixed z-30 bg-white shadow-lg top-0 left-0 w-full mb-5 border-b border-gray-200">
      <div className="container mx-auto px-2 py-4 flex flex-col">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-16" />
          <div className="hidden md:flex space-x-8 ml-8 relative">
            <Button
              icon={<HomeOutlined />}
              onClick={() => handleNavigation('/')}
              type="link"
              className="text-gray-700 text-lg hover:text-blue-500 transition duration-200"
            >
              Trang chủ
            </Button>
            <div className="relative">
              <Button
                icon={<CompassOutlined />}
                onClick={toggleExploreSubNav}
                type="link"
                className="text-gray-700 text-lg hover:text-blue-500 transition duration-200"
              >
                Khám Phá
              </Button>
              {isExploreSubNavVisible && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 w-full z-10">
                  <Button
                    onClick={() => handleNavigation('/explore/vote')}
                    type="link"
                    className="text-gray-700 hover:text-blue-500 transition duration-200 w-full text-left px-4 py-2"
                  >
                    Bình chọn
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/explore/explorePage')}
                    type="link"
                    className="text-gray-700 hover:text-blue-500 transition duration-200 w-full text-left px-4 py-2"
                  >
                    Câu chuyện
                  </Button>
                </div>
              )}
            </div>
            <Button
              icon={<SearchOutlined />}
              onClick={() => handleNavigation('/mapPage')}
              type="link"
              className="text-gray-700 text-lg hover:text-blue-500 transition duration-200"
            >
              Bản đồ
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => handleNavigation('/itinerary')}
              type="link"
              className="text-gray-700 text-lg hover:text-blue-500 transition duration-200"
            >
              Hành trình tiếp theo
            </Button>
            <Button
              icon={<CarOutlined />}
              onClick={() => handleNavigation('/flight')}
              type="link"
              className="text-gray-700 text-lg hover:text-blue-500 transition duration-200"
            >
              Chuyến bay
            </Button>
          </div>
      
      

          <div className="flex items-center space-x-4 mr">
            {/* so luong tin nhan thong bao  */}
             {notifications.length > 0 && (
              <span className="absolute  mb-8  px-2 py-1 ml-8 text-xs text-white bg-red-500 rounded-full">
                {notifications.length}
              </span>
            )}
            <Button
              icon={<BellOutlined />}
              onClick={handleNotificationClick}
              type="link"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            />
           
            {isNotificationsVisible && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 w-64 p-4 z-20">
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li
                        key={index}
                        className="mb-2 p-2 border-b border-gray-200 text-gray-700"
                      >
                        {notification.message}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Không có thông báo mới.</li>
                  )}
                </ul>
              </div>
            )}
            {isTokenExists() ? (
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                type="primary"
                danger
                className="bg-red-500 hover:bg-red-600 transition duration-200 text-white"
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                icon={<LoginOutlined />}
                onClick={() => handleNavigation('/login')}
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white"
              >
                Đăng nhập
              </Button>
            )}
          </div>
           {/* Hiển thị avatar nếu có */}
          <div>
          {userInfo ? (
  <div className=''>
   
    {userInfo.data ? (
      <img src={userInfo.data.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
    ) : (
      <p>No avatar available</p>
    )}
  </div>
) : (
  <p>No user info available</p>
)}

          </div>
        </div>
      </div>

      {/* Hiển thị container cho thông báo */}
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
