import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItinerary } from '../../api/callApi';
import { useAuth } from '../../context/AuthContext'; // Sử dụng useAuth để lấy thông tin người dùng
import bgItinerary from "../../style/img/lienkhuong2.jpg";

const CreateItinerary = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userId } = useAuth(); // Lấy userId từ useAuth

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setError('Ngày kết thúc không thể trước ngày bắt đầu.');
      return 0;
    }
    const timeDiff = end - start;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startDate || !formData.endDate) {
      setError('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
      return;
    }

    try {
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      if (daysCount <= 0) return; // Nếu số ngày không hợp lệ, không tiếp tục gửi dữ liệu

      const dataToSend = { ...formData, days: daysCount, startDate: formData.startDate, endDate: formData.endDate };
      const result = await createItinerary(dataToSend, userId); // Sử dụng userId từ context

      navigate(`/itinerary/${result._id}`, { state: { days: daysCount, startDate: formData.startDate, endDate: formData.endDate } });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setError('Đã xảy ra lỗi khi tạo lịch trình.');
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <img
        src={bgItinerary}
        alt="Nền"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      />
      <nav className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl">Tạo Lịch Trình</h1>
      </nav>
      <main className="flex-1 flex justify-center items-center mt-3 p-4">
        <div className="w-full max-w-lg mt-5 bg-white p-6 border rounded shadow-lg ">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Tạo Lịch Trình Mới</h1>
          <div className="mb-8">
    
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Tên Chuyến Đi</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700">Địa Điểm</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700">Ngày Bắt Đầu</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-700">Ngày Kết Thúc</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateItinerary;
