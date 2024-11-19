import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createItinerary } from '../../api/callApi';
import { useAuth } from '../../context/AuthContext';
import bgItinerary from "../../style/img/lienkhuong2.jpg";
import ProgressBar from '../../components/itinerary/ProgressBar';

const getCurrentStep = (pathname) => {
  switch (pathname) {
    case '/suggest-itinerary':
      return 1;
    case '/suggest-place':
      return 2;
    case '/create-itinerary':
      return 3;
    default:
      return 4;
  }
};

const CreateItinerary = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth();
  const currentStep = getCurrentStep(location.pathname);
  const { selectedPlaces, provinceName } = location.state || {};

  useEffect(() => {
    if (provinceName) {
      setFormData((prevData) => ({
        ...prevData,
        location: provinceName
      }));
    }
  }, [provinceName]);

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

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      if (daysCount > 0) {
        const nights = daysCount - 1; // Nights are one less than days
        setFormData((prevData) => ({
          ...prevData,
          name: `${provinceName} ${daysCount} ngày ${nights} đêm`
        }));
      }
    }
  }, [formData.startDate, formData.endDate, provinceName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startDate || !formData.endDate) {
      setError('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
      return;
    }

    try {
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      if (daysCount <= 0) return;

      const dataToSend = { ...formData, days: daysCount, startDate: formData.startDate, endDate: formData.endDate };
      const result = await createItinerary(dataToSend, userId);

      navigate(`/itinerary/${result._id}`, { state: { days: daysCount, startDate: formData.startDate, endDate: formData.endDate, selectedPlaces } });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setError('Đã xảy ra lỗi khi tạo lịch trình.');
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <ProgressBar currentStep={currentStep} />
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgItinerary}
          alt="Background"
          className="w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      <main className="relative flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-green-600">
            Tạo Lịch Trình Du Lịch
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Tên Chuyến Đi
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-gray-700 font-medium">
                Địa Điểm
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-gray-700 font-medium">
                  Ngày Bắt Đầu
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-gray-700 font-medium">
                  Ngày Kết Thúc
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                Tạo Lịch Trình
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateItinerary;
