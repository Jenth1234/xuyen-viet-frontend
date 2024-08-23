// src/pages/CreateItinerary.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateItinerary = () => {
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const itinerary = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      itinerary.push({
        day: i + 1,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
    }

    navigate('/chitiet', {
      state: { itinerary }
    });
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
