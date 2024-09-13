import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { createActivity } from '../../../api/callApi'; // Import the createActivity function

Modal.setAppElement('#root');

const ActivityModal = ({ isOpen, onRequestClose, onSave, date }) => { // Thêm prop date
  const { itineraryId } = useParams();
  
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(0);

  // Kết hợp ngày với thời gian
  const formatDateTime = (date, time) => {
    if (date && time) {
      const [hours, minutes] = time.split(':');
      return `${date.toISOString().split('T')[0]}T${hours}:${minutes}`;
    }
    return '';
  };

  const handleSave = async () => {
    if (location && startTime) {
      const newActivity = {
        activity: {
          LOCATION: location,
          DESCRIPTION: description,
          STARTTIME: formatDateTime(date, startTime),
          ENDTIME: formatDateTime(date, endTime) || null, // Gửi null nếu không có giá trị
          COST: cost,
        },
        itineraryId: itineraryId,
      };
  
      try {
        const response = await createActivity(newActivity);
        const savedActivity = response.activity; // Trích xuất phần dữ liệu cần thiết từ phản hồi
        onSave(savedActivity); // Truyền dữ liệu hoạt động mới về component cha
        setLocation('');
        setStartTime('');
        setEndTime('');
        setDescription('');
        setCost(0);
        onRequestClose();
      } catch (error) {
        console.error('Error:', error);
        alert('Lỗi kết nối API: ' + error.message);
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };
  

  useEffect(() => {
    if (date) {
      // Khi ngày thay đổi, cập nhật thời gian
      const defaultTime = '00:00'; // Hoặc thời gian mặc định bạn muốn
      setStartTime(defaultTime);
      setEndTime(defaultTime);
    }
  }, [date]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-6 z-50 pt-28"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Thêm Hoạt Động"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button 
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Thêm Hoạt Động</h2>
        <p>Ngày: {date ? date.toLocaleDateString() : 'Không có ngày'}</p> {/* Hiển thị ngày */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Địa điểm:
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian bắt đầu:
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian kết thúc:
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả:
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chi phí:
              <input 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={handleSave} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ActivityModal;
