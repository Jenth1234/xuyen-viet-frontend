import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../style/img/logo.jpg';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn chính xác

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-8 py-2 flex justify-between items-center">
        <div className="flex items-center ml-8">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        <div className="hidden md:flex space-x-8 ml-8">
          <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-blue-500 font-medium">
            Trang chủ
          </button>
          <button onClick={() => handleNavigation('/explore')} className="text-gray-700 hover:text-blue-500 font-medium">
            Khám Phá
          </button>
          <button onClick={() => handleNavigation('/mapPage')} className="text-gray-700 hover:text-blue-500 font-medium">
            Bản đồ
          </button>
          <button onClick={() => handleNavigation('/itinerary')} className="text-gray-700 hover:text-blue-500 font-medium">
            Hành trình tiếp theo
          </button>
          <button onClick={() => handleNavigation('/flightPage')} className="text-gray-700 hover:text-blue-500 font-medium">
            Chuyến bay
          </button>
        </div>

        <div className="flex-grow mx-8">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4 mr-8">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Đăng xuất
            </button>
          ) : (
            <>
              <button onClick={() => handleNavigation('/login')} className="text-blue-500 hover:text-blue-700 font-medium">
                Đăng nhập
              </button>
              <button onClick={() => handleNavigation('/register')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
