import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createItinerary } from '../../api/callApi';
import { useAuth } from '../../context/AuthContext';
import bgItinerary from "../../style/img/lienkhuong2.jpg";
import ProgressBar from '../../components/itinerary/ProgressBar';
import { motion } from 'framer-motion';
import { 
  FileTextOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const getCurrentStep = (pathname) => {
  switch (pathname) {
    case '/suggest-itinerary': return 1;
    case '/suggest-place': return 2;
    case '/create-itinerary': return 3;
    default: return 4;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth();
  const currentStep = getCurrentStep(location.pathname);
  const { selectedPlaces = [], provinceName = '', province = {} } = location.state || {};

  useEffect(() => {
    if (provinceName) {
      setFormData(prev => ({
        ...prev,
        location: provinceName
      }));
    }
  }, [provinceName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
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
        const nights = daysCount - 1;
        setFormData(prev => ({
          ...prev,
          name: `${provinceName} ${daysCount} ngày ${nights} đêm`
        }));
      }
    }
  }, [formData.startDate, formData.endDate, provinceName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      if (daysCount <= 0) {
        setIsSubmitting(false);
        return;
      }

      const placeIds = selectedPlaces.map(place => place.id);
      
      const dataToSend = {
        name: formData.name,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: daysCount,
        userId: userId,
        province: province?.name,
        places: placeIds
      };

      const result = await createItinerary(dataToSend);
      
      toast.success('Tạo lịch trình thành công!');
      
      navigate(`/itinerary/${result._id}`, {
        state: {
          itineraryId: result._id,
          days: daysCount,
          startDate: formData.startDate,
          endDate: formData.endDate,
          selectedPlaces: selectedPlaces.map(place => ({
            id: place.id,
            name: place.name,
            description: place.description,
            images: place.images,
            coordinates: place.coordinates
          })),
          provinceName: province?.name
        }
      });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast.error('Đã xảy ra lỗi khi tạo lịch trình.');
      setError('Đã xảy ra lỗi khi tạo lịch trình. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <ProgressBar currentStep={currentStep} />
      
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src={bgItinerary}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div 
          className="w-full max-w-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Tạo Lịch Trình Du Lịch
            </h1>
            <p className="text-gray-200">
              Lên kế hoạch cho chuyến đi tuyệt vời của bạn
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl shadow-2xl">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Form fields remain the same */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FileTextOutlined className="mr-2" />
                  Tên Chuyến Đi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nhập tên chuyến đi của bạn"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <EnvironmentOutlined className="mr-2" />
                  Địa Điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nhập địa điểm du lịch"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <CalendarOutlined className="mr-2" />
                    Ngày Bắt Đầu
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <CalendarOutlined className="mr-2" />
                    Ngày Kết Thúc
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 rounded-xl font-medium 
                          hover:from-blue-600 hover:to-green-600 transform hover:scale-[1.02] transition-all duration-200 
                          shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />} />
                ) : (
                  'Tạo Lịch Trình'
                )}
              </button>
            </form>

            <div className="px-8 pb-6">
              <p className="text-sm text-gray-500 text-center">
                Sau khi tạo lịch trình, bạn có thể thêm các địa điểm và hoạt động chi tiết
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateItinerary;