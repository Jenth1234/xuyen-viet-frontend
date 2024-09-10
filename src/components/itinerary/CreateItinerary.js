// src/pages/CreateItinerary.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItinerary } from '../../api/callApi'; // Nhập hàm gọi API

const CreateItinerary = () => {
  const [formData, setFormData] = useState({
    name: '',        // Thêm tên chuyến đi
    location: '',
    startDate: '',
    endDate: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 để bao gồm ngày bắt đầu
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Tính số ngày và thêm vào formData
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      const dataToSend = { ...formData, days: daysCount };

      // Gọi API để tạo lịch trình mới
      const result = await createItinerary(dataToSend, 'user-id'); // Thay 'user-id' bằng ID người dùng thực tế

      // Chuyển hướng đến trang chi tiết với số ngày
      navigate(`/itinerary/${result.itineraryId}`, { state: { days: daysCount } });
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mr-60 ml-60">
      <nav className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl">Tạo Lịch Trình</h1>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Tạo Lịch Trình Mới</h1>

        <div className="mb-8 p-6 border rounded shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4">Thêm Lịch Trình</h2>
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
      </main>
    </div>
  );
};

export default CreateItinerary;
