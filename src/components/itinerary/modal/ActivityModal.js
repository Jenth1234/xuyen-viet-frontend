import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { createActivity } from '../../../api/callApi';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCalendar,
  faTag,
  faClock,
  faMapMarkerAlt,
  faDollarSign,
  faTimes,
  faSave
} from "@fortawesome/free-solid-svg-icons";
const getDateFromIndex = (index) => {
  const baseDate = new Date(); // Starting point (today's date)
  baseDate.setDate(baseDate.getDate() + index); // Adjust the date by the index value
  return baseDate.toISOString().split('T')[0]; // Return the date in 'YYYY-MM-DD' format
};

const ActivityModal = ({ onClose, onSave, dayIndex, activitiesState, place, selectedDate }) => {
  const { itineraryId } = useParams();

  const initialDate = selectedDate ? selectedDate : (dayIndex !== undefined && dayIndex !== null ? getDateFromIndex(dayIndex) : '');
  
  // Set default values for activity
  const [activity, setActivity] = useState({
    NAME: place ? place.NAME : '',
    STARTTIME: '',
    ENDTIME: '',
    LOCATION: place ? place.ADDRESS : '',
    DESCRIPTION: place ? place.DESCRIPTIONPLACE : '',
    DATE: initialDate,
    COST: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate cho trường hợp cost
    if (name === 'COST') {
      const numValue = parseFloat(value);
      if (numValue < 0) return; // Không cho phép giá trị âm
    }
  
    // Validate cho trường hợp time
    if (name === 'ENDTIME' && activity.STARTTIME && value <= activity.STARTTIME) {
      toast.warning('Thời gian kết thúc phải sau thời gian bắt đầu!');
      return;
    }
  
    setActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (time) => {
    if (time) {
      return `${activity.DATE}T${time}`;
    }
    return null;
  };

  const handleSave = () => {
    // Kiểm tra các trường bắt buộc
    if (!activity.NAME || !activity.STARTTIME || !activity.LOCATION) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
  
    // Chuyển đổi COST từ string sang number
    const cost = parseFloat(activity.COST) || 0;
  
    const newActivity = {
      _id: 'temp_' + Date.now(),
      NAME: activity.NAME,
      LOCATION: activity.LOCATION,
      DESCRIPTION: activity.DESCRIPTION || '',
      STARTTIME: formatDateTime(activity.STARTTIME),
      ENDTIME: formatDateTime(activity.ENDTIME),
      IMAGE: activity.IMAGE,
      COST: cost,
      DATE: activity.DATE,
      isTemp: true // Đánh dấu là hoạt động tạm thời
    };
  
    console.log('Saving new activity:', newActivity); // Debug log
  
    try {
      // Gọi onSave từ props để cập nhật state ở component cha
      onSave(dayIndex, newActivity);
      toast.success('Đã thêm hoạt động mới!');
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Có lỗi xảy ra khi thêm hoạt động!');
    }
  };
// Thêm hàm validate thời gian
const validateTime = (startTime, endTime) => {
  if (!startTime) return false;
  if (endTime && startTime >= endTime) return false;
  return true;
};
  return (
<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
  <div className="bg-white rounded-2xl p-8 w-2/3 max-w-3xl shadow-2xl">
    {/* Header */}
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon={faCalendarPlus} className="text-blue-600 text-lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm Hoạt Động
          </h2>
          <p className="text-gray-500 mt-1">
            {dayIndex == null ? "Chọn ngày" : `Ngày: ${initialDate}`}
          </p>
        </div>
      </div>
      
      {dayIndex == null && (
        <div className="relative">
          <FontAwesomeIcon 
            icon={faCalendar} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="date"
            name="DATE"
            value={activity.DATE}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>

    {/* Form Content */}
    <div className="space-y-6">
      {/* Activity Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên hoạt động
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faTag} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="NAME"
            value={activity.NAME}
            onChange={handleChange}
            className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tên hoạt động"
          />
        </div>
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian bắt đầu
          </label>
          <div className="relative">
            <FontAwesomeIcon 
              icon={faClock} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              name="STARTTIME"
              value={activity.STARTTIME}
              onChange={handleChange}
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian kết thúc
          </label>
          <div className="relative">
            <FontAwesomeIcon 
              icon={faClock} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              name="ENDTIME"
              value={activity.ENDTIME}
              onChange={handleChange}
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa điểm
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faMapMarkerAlt} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="LOCATION"
            value={activity.LOCATION}
            onChange={handleChange}
            className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập địa điểm"
          />
        </div>
      </div>

      {/* Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chi phí
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faDollarSign} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="number"
            name="COST"
            value={activity.COST}
            onChange={handleChange}
            className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập chi phí"
          />
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
      <button 
        onClick={onClose}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center"
      >
        <FontAwesomeIcon icon={faTimes} className="mr-2" />
        Đóng
      </button>
      <button 
  onClick={handleSave}
  disabled={!activity.NAME || !activity.STARTTIME || !activity.LOCATION}
  className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center ${
    !activity.NAME || !activity.STARTTIME || !activity.LOCATION
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }`}
>
  <FontAwesomeIcon icon={faSave} className="mr-2" />
  Lưu
</button>
    </div>
  </div>
</div>
  );
};

export default ActivityModal;
