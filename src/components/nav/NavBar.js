import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../style/img/logodd.png';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
  CarOutlined,
  CalendarOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { isTokenExists, logout } = useAuth();
  const [isExploreSubNavVisible, setIsExploreSubNavVisible] = useState(false);

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

  return (
    <nav className="fixed z-30 bg-white shadow-lg top-0 left-0 w-full mb-5 border-b border-gray-200">
      <div className="container mx-auto px-8 py-4 flex flex-col">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-16" />

          <div className="hidden md:flex space-x-8 ml-8 relative">
            <Button
              icon={<HomeOutlined />}
              onClick={() => handleNavigation('/')}
              type="link"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Trang chủ
            </Button>
            <div className="relative">
              <Button
                icon={<CompassOutlined />}
                onClick={toggleExploreSubNav}
                type="link"
                className="text-gray-700 hover:text-blue-500 transition duration-200"
              >
                Khám Phá
              </Button>
              {isExploreSubNavVisible && (
                <div className={`absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 w-full z-10 transition-all duration-300 ease-in-out transform ${isExploreSubNavVisible ? 'scale-y-100' : 'scale-y-0'}`}>
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
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Bản đồ
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => handleNavigation('/itinerary')}
              type="link"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Hành trình tiếp theo
            </Button>
            <Button
              icon={<CarOutlined />}
              onClick={() => handleNavigation('/flightPage')}
              type="link"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Chuyến bay
            </Button>
          </div>

          <Input
            placeholder="Tìm kiếm..."
            className="flex-grow mx-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            suffix={<SearchOutlined />}
          />

          <div className="flex items-center space-x-4 mr-8">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
