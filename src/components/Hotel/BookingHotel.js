import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faEnvelope,
  faHotel,
  faArrowRight,
  faBed,
  faUsers,
  faEye,
  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BookingHotel = () => {
  const location = useLocation();
  const { hotel, room, checkIn, checkOut } = location.state || {};
  const navigate = useNavigate();

  // State cho thông tin liên hệ
  const [contactInfo, setContactInfo] = useState({
    FIRST_NAME: "",
    MIDDLE_NAME: "",
    MOBILE: "",
    EMAIL: "",
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      contactInfo: contactInfo,
      hotelInfo: {
        hotelName: hotel.name,
        roomType: room.roomType,
        checkIn: checkIn,
        checkOut: checkOut,
        price: room.price,
        capacity: room.capacity,
        view: room.view,
        size: room.size,
      }
    };

    console.log("Dữ liệu đặt phòng:", dataToSend);
    navigate('/review-booking-hotel', { state: dataToSend });
  };

  return (
    <div className="flex space-x-8 mt-32">
      {/* Form Thông tin liên hệ */}
      <form onSubmit={handleSubmit} className="w-2/3 space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ (vd: Nguyen)*
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  name="FIRST_NAME"
                  placeholder="như trên CMND (không dấu)"
                  value={contactInfo.FIRST_NAME}
                  onChange={handleContactChange}
                  required
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Đệm & Tên (vd: Van A)*
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  name="MIDDLE_NAME"
                  placeholder="như trên CMND (không dấu)"
                  value={contactInfo.MIDDLE_NAME}
                  onChange={handleContactChange}
                  required
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điện thoại di động*
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faPhone} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="tel"
                  name="MOBILE"
                  placeholder="VD: +84 901234567"
                  value={contactInfo.MOBILE}
                  onChange={handleContactChange}
                  required
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email*
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="email"
                  name="EMAIL"
                  placeholder="email@example.com"
                  value={contactInfo.EMAIL}
                  onChange={handleContactChange}
                  required
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg 
            transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>Tiếp tục</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </form>

      {/* Thông tin đặt phòng */}
      <div className="w-1/3">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
            <FontAwesomeIcon icon={faHotel} className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBed} className="text-blue-500 w-5" />
                <span className="ml-3 text-gray-700">Loại phòng</span>
              </div>
              <span className="font-medium">{room.roomType}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500 w-5" />
                <span className="ml-3 text-gray-700">Sức chứa</span>
              </div>
              <span className="font-medium">{room.capacity} người</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEye} className="text-blue-500 w-5" />
                <span className="ml-3 text-gray-700">View</span>
              </div>
              <span className="font-medium">{room.view}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng tiền</span>
              <div className="text-right">
                <span className="block text-2xl font-bold text-blue-600">
                  {room.price.toLocaleString("vi-VN")} VND
                </span>
                <span className="text-sm text-gray-500">Đã bao gồm thuế và phí</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHotel;