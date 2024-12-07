import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../style/img/logodd.png';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button, Drawer, Modal } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { getUserInfo, editUserInfo } from '../../api/callApi';
import {
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
  CarOutlined,
  CalendarOutlined,
  LogoutOutlined,
  LoginOutlined,
  BellOutlined,
  GiftOutlined,
  MenuOutlined,
  CloseOutlined,
  CameraOutlined,
  LoadingOutlined,
  EditOutlined,
  TicketOutlined
} from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isTokenExists, logout } = useAuth();
const [isExploreOpen, setIsExploreOpen] = useState(false);
  
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [userInfo, setUserInfo] = useState(null);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const notificationRef = useRef(null);
  const exploreRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [uploadLoading, setUploadLoading] = useState(false);
const [editedUserInfo, setEditedUserInfo] = useState({});

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsVisible(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsExploreOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };
  
// Thêm các hàm xử lý
const handleAvatarClick = () => {
  console.log('Avatar clicked');
  setIsProfileModalVisible(true);
};
const handleUpdateProfile = async () => {
  try {
    const response = await editUserInfo(editedUserInfo);
    setUserInfo(prev => ({
      ...prev,
      data: response.data
    }));
    setIsEditMode(false);
    toast.success('Cập nhật thông tin thành công!');
  } catch (error) {
    toast.error('Không thể cập nhật thông tin!');
  }
};

// Cập nhật hàm xử lý avatar
const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Kiểm tra kích thước file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Preview ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await editUserInfo(formData);
      setUserInfo(prev => ({
        ...prev,
        data: {
          ...prev.data,
          avatar: response.data.avatar
        }
      }));
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      toast.error('Không thể cập nhật ảnh đại diện!');
      setAvatarPreview(null);
    } finally {
      setUploadLoading(false);
    }
  }
};
useEffect(() => {
  console.log('Modal visibility:', isProfileModalVisible);
}, [isProfileModalVisible]);
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsNotificationsVisible(false);
    setIsMobileMenuOpen(false);

    if (notification.type === 'TRIP_START' && notification.data?.itineraryId) {
      handleNavigation(`/itinerary/${notification.data.itineraryId}`);
    } else if (notification.type === 'REVIEW_NEEDED' && notification.data?.placeId) {
      handleNavigation(`/place/${notification.data.placeId}`);
    }
  };

  const formatNotificationTime = (createdAt) => {
    return format(new Date(createdAt), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TRIP_START':
        return '🎉';
      case 'REVIEW_NEEDED':
        return '⭐';
      default:
        return '📢';
    }
  };

  const renderNavLinks = (isMobile = false) => {
    const links = [
      {
        icon: <HomeOutlined />,
        text: 'Trang chủ',
        path: '/',
      },
      {
        icon: <SearchOutlined />,
        text: 'Bản đồ',
        path: '/mapPage',
      },
      {
        icon: <CalendarOutlined />,
        text: 'Hành trình',
        path: '/itinerary',
      },
      {
        icon: <CarOutlined />,
        text: 'Dịch vụ',
        subMenu: [
          {
            icon: <CarOutlined />,
            text: 'Chuyến bay',
            path: '/flight',
            description: 'Đặt vé máy bay giá tốt'
          },
          {
            icon: <HomeOutlined />,
            text: 'Đặt phòng',
            path: '/hotels',
            description: 'Đặt phòng khách sạn'
          }
        ]
      },
      {
        icon: <CompassOutlined />,
        text: 'Khám phá',
        subMenu: [
          {
            icon: <GiftOutlined />,
            text: 'Bình chọn',
            path: '/explore/vote',
            description: 'Bình chọn địa điểm yêu thích'
          },
          {
            icon: <CompassOutlined />,
            text: 'Câu chuyện',
            path: '/explore/explorePage',
            description: 'Khám phá câu chuyện du lịch'
          }
        ]
      },
      {
        icon: <GiftOutlined />,
        text: 'Khuyến mãi',
        path: '/promotions',
        badge: 'Mới',
      },
    ];
  
    // Render cho mobile view
    if (isMobile) {
      return links.map((link, index) => {
        if (link.subMenu) {
          return (
            <div key={index} className="space-y-2">
              <div className="px-4 py-2 text-gray-500 font-medium">
                {link.icon} {link.text}
              </div>
              {link.subMenu.map((subItem, subIndex) => (
                <Button
                  key={`${index}-${subIndex}`}
                  icon={subItem.icon}
                  onClick={() => handleNavigation(subItem.path)}
                  type="link"
                  className="w-full text-left justify-start h-12 pl-8"
                >
                  {subItem.text}
                </Button>
              ))}
            </div>
          );
        }
        return (
          <Button
            key={index}
            icon={link.icon}
            onClick={() => handleNavigation(link.path)}
            type="link"
            className="w-full text-left justify-start h-12"
          >
            {link.text}
            {link.badge && (
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs text-white bg-red-500 rounded-full">
                {link.badge}
              </span>
            )}
          </Button>
        );
      });
    }
  
    // Render cho desktop view
  // Trong renderNavLinks, phần return cho desktop view:
  return links.map((link, index) => {
    if (link.subMenu) {
      const isOpen = link.text === 'Dịch vụ' ? isServicesOpen : isExploreOpen;
      const setIsOpen = link.text === 'Dịch vụ' ? setIsServicesOpen : setIsExploreOpen;
      const ref = link.text === 'Dịch vụ' ? servicesRef : exploreRef;
  
      return (
        <div key={index} className="relative" ref={ref}>
          <Button
            icon={link.icon}
            onClick={() => setIsOpen(!isOpen)}
            type="link"
            className={`text-gray-700 hover:text-blue-500 flex items-center ${
              isOpen ? 'text-blue-500' : ''
            }`}
          >
            <span className="hidden lg:inline ml-2">{link.text}</span>
            <span className={`ml-1 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </Button>
          
          <div className={`absolute left-0 top-full mt-2 bg-white shadow-xl rounded-lg border border-gray-100 w-72 
            transform transition-all duration-200 ease-out ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">{link.text}</h3>
            </div>
  
            {/* Menu Items */}
            <div className="py-2">
              {link.subMenu.map((subItem, subIndex) => (
                <div key={`${index}-${subIndex}`} className="px-2">
                  <Button
                    icon={subItem.icon}
                    onClick={() => {
                      handleNavigation(subItem.path);
                      setIsOpen(false);
                    }}
                    type="link"
                    className="w-full text-left px-3 py-2 my-1 rounded-md hover:bg-blue-50 group transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 group-hover:text-blue-600">
                          {subItem.text}
                        </div>
                        {subItem.description && (
                          <div className="text-xs text-gray-500 group-hover:text-blue-500">
                            {subItem.description}
                          </div>
                        )}
                      </div>
                      <span className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform duration-150">
                        →
                      </span>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  
    // Link thường
    return (
      <Button
        key={index}
        icon={link.icon}
        onClick={() => handleNavigation(link.path)}
        type="link"
        className="text-gray-700 hover:text-blue-500 relative group"
      >
        <span className="hidden lg:inline ml-2">{link.text}</span>
        {link.badge && (
          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs text-white bg-red-500 rounded-full 
            transform group-hover:scale-110 transition-transform duration-150">
            {link.badge}
          </span>
        )}
      </Button>
    );
  });
  };

  const renderNotifications = () => (
    <div className="p-4 min-w-[300px] max-w-[400px]">
      <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
      {notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
              } hover:bg-gray-100`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <p className="text-gray-800 mb-1">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <p>Không có thông báo nào</p>
        </div>
      )}
    </div>
  );

  const ProfileModal = () => (
    <Modal
      title={null}
      open={isProfileModalVisible}
      onCancel={() => setIsProfileModalVisible(false)}
      footer={null}
      width={800}
      className="rounded-xl"
    >
      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={avatarPreview || userInfo?.data?.avatar || "https://via.placeholder.com/128"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Camera Icon & Input File */}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors group-hover:scale-110 shadow-lg">
              {uploadLoading ? (
                <LoadingOutlined className="text-white text-lg" />
              ) : (
                <>
                  <CameraOutlined className="text-white text-lg" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadLoading}
                  />
                </>
              )}
            </label>
          </div>
          {isEditMode && (
            <p className="text-sm text-gray-500 mt-2">
              Click vào icon camera để thay đổi ảnh đại diện
            </p>
          )}
        </div>
  
        {/* User Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Họ và tên</label>
              {isEditMode ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editedUserInfo.name || ''}
                  onChange={(e) => setEditedUserInfo(prev => ({...prev, name: e.target.value}))}
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo?.data?.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Email</label>
              <p className="font-medium text-gray-800">{userInfo?.data?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Số điện thoại</label>
              {isEditMode ? (
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editedUserInfo.phone || ''}
                  onChange={(e) => setEditedUserInfo(prev => ({...prev, phone: e.target.value}))}
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo?.data?.phone}</p>
              )}
            </div>
          </div>
        </div>
  
        {/* Tickets Section */}
        {/* <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <TicketOutlined className="mr-2" />
            Vé của tôi
          </h3>
          <div className="space-y-4">
            {invoices.map((invoice, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-gray-800">{invoice.AIRLINECODE}</span>
                  </div>
                  <div className="text-gray-600">
                    {new Date(invoice.DEPARTURETIME).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">
                    Đi: {new Date(invoice.DEPARTURETIME).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-600">
                    Đến: {new Date(invoice.ARRIVALTIME).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎫</div>
                <p className="text-gray-500">Bạn chưa có vé nào</p>
              </div>
            )}
          </div>
        </div> */}
  
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <EditOutlined className="mr-2" />
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </Modal>
  );

  return (
    <nav className="fixed z-30 bg-white shadow-lg top-0 left-0 w-full mb-5 border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="h-12 sm:h-16 cursor-pointer"
            onClick={() => handleNavigation('/')}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2 lg:space-x-6 flex-1 justify-center">
            {renderNavLinks()}
           
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {isTokenExists() && (
              <div ref={notificationRef} className="relative">
                <Button
                  icon={<BellOutlined />}
                  onClick={() => setIsNotificationsVisible(!isNotificationsVisible)}
                  type="link"
                  className="text-gray-700 hover:text-blue-500"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
                {isNotificationsVisible && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {renderNotifications()}
                  </div>
                )}
              </div>
            )}

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isTokenExists() ? (
                <div className="flex items-center space-x-4">
                  {!loading && userInfo?.data?.avatar && (
                    <div 
                      className="relative cursor-pointer group"
                      onClick={handleAvatarClick}
                    >
                      <img
                        src={userInfo.data.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    </div>
                  )}
                  <Button
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    type="primary"
                    danger
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Button
                  icon={<LoginOutlined />}
                  onClick={() => handleNavigation('/login')}
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Đăng nhập
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="link"
              className="md:hidden text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width="80%"
        className="md:hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {renderNavLinks(true)}
            </div>
          </div>
          
          {/* Mobile Auth Section */}
          <div className="border-t p-4">
            {isTokenExists() ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {!loading && userInfo?.data?.avatar && (
                    <div 
                      className="relative cursor-pointer group"
                      onClick={handleAvatarClick}
                    >
                      <img
                        src={userInfo.data.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    </div>
                  )}
                  <span className="text-gray-700">{userInfo?.data?.name}</span>
                </div>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  type="primary"
                  danger
                  block
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Button
                icon={<LoginOutlined />}
                onClick={() => handleNavigation('/login')}
                type="primary"
                block
                className="bg-blue-500 hover:bg-blue-600"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      <ToastContainer />
    </nav>
  );
};

export default Navbar;