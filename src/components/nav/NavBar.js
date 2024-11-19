import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../style/img/logodd.png';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'antd';
import { useNotification } from '../../context/NotificationContext';
import { getUserInfo } from '../../api/callApi';
import RatingModal from './RatingModal';
import {
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
  CarOutlined,
  CalendarOutlined,
  LogoutOutlined,
  LoginOutlined,
  BellOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isTokenExists, logout } = useAuth();
  const { notifications, markAsRead, deleteNotification } = useNotification();
  const [userInfo, setUserInfo] = useState(null);
  const [isExploreSubNavVisible, setIsExploreSubNavVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (isTokenExists()) {
      fetchUserInfo();
    }
  }, [isTokenExists]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsNotificationsVisible(false);
    setIsExploreSubNavVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExploreSubNav = () => {
    setIsExploreSubNavVisible(prev => !prev);
    setIsNotificationsVisible(false);
  };
  const toggleNotifications = () => {
    setIsNotificationsVisible(prev => !prev);
    setIsExploreSubNavVisible(false);
  };

  //   try {
  //     console.log('Notification clicked:', notification);
      
  //     if (notification.type === 'TRIP_START' && notification.itineraryId) {
  //       // Đánh dấu là đã đọc
  //       await markAsRead(notification._id);
        
  //       // Chuyển hướng đến trang chi tiết lịch trình
  //       navigate(`/itinerary/${notification.itineraryId}`, {
  //         state: { 
  //           viewOnly: true,
  //           fromNotification: true 
  //         }
  //       });
        
  //       // Đóng dropdown thông báo
  //       setIsNotificationsVisible(false);
  //     }
  //   } catch (error) {
  //     console.error('Error handling notification click:', error);
  //   }
  // };
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const notification of notifications) {
        if (!notification.isRead) {
          await markAsRead(notification._id);
        }
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification._id);
      
      if (notification.type === 'TRIP_START') {
        // Kiểm tra xem có itineraryId trong data không
        const itineraryId = notification.data?.itineraryId;
        if (itineraryId && itineraryId !== 'testItineraryId') {
          navigate(`/itinerary/${itineraryId}`, {
            state: { viewOnly: true }
          });
        }
      } else if (notification.type === 'REVIEW_NEEDED' && notification.data) {
        // Truyền toàn bộ data vào modal đánh giá
        setSelectedActivity({
          activityId: notification.data.activityId,
          itineraryId: notification.data.itineraryId,
          placeId: notification.data.placeId
        });
        setIsRatingModalOpen(true);
      }
      
      setIsNotificationsVisible(false);
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  return (
    <>
    <nav className="fixed z-30 bg-white shadow-lg top-0 left-0 w-full mb-5 border-b border-gray-200">
      <div className="container mx-auto px-2 py-4">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-16" />
          
          <div className="flex space-x-8 ml-8 relative">
            <Button
              icon={<HomeOutlined />}
              onClick={() => handleNavigation('/home')}
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
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 w-48 z-50">
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

          <div className="flex items-center space-x-4">
          <div className="relative">
  <div className="cursor-pointer" onClick={toggleNotifications}>
    <BellOutlined className="text-2xl text-gray-600 hover:text-blue-500" />
    {notifications.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {notifications.length}
      </span>
    )}
  </div>

  {isNotificationsVisible && (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Thông báo</h3>
        <span 
          className="text-sm text-blue-500 cursor-pointer hover:text-blue-700"
          onClick={handleMarkAllAsRead}
        >
          Đánh dấu tất cả đã đọc
        </span>
      </div>
    </div>
    
    <div className="divide-y divide-gray-200">
      {notifications && notifications.length > 0 ? (
        notifications.map((notification) => (
          <div 
          key={notification._id}
          className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
            !notification.isRead ? 'bg-blue-50' : ''
          }`}
          onClick={() => handleNotificationClick(notification)}
        >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification._id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <DeleteOutlined />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">
          Không có thông báo
        </div>
      )}
    </div>
  </div>
)}
</div>

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

            {userInfo && userInfo.data && (
              <img 
                src={userInfo.data.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </nav>

    {isRatingModalOpen && selectedActivity && (
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        activity={selectedActivity}
      />
    )}
        </>
  );
};

export default Navbar;