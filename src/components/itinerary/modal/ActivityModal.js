// src/components/ActivityModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';

const provinces = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  // Thêm các tỉnh thành khác vào đây
].map(province => ({ value: province, label: province }));

const ActivityModal = ({ isOpen, onRequestClose, onAddActivity, dayIndex }) => {
  const [activity, setActivity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);

  const handleAddActivity = () => {
    if (activity && selectedProvince) {
      onAddActivity(dayIndex, activity, selectedProvince.value);
      setActivity('');
      setSelectedProvince(provinces[0]);
      onRequestClose();
    } else {
      alert("Vui lòng điền đủ thông tin.");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2 className="text-2xl mb-4">Thêm Hoạt Động</h2>
      <div className="mb-4">
        <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
          Hoạt Động:
        </label>
        <input
          id="activity"
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="province-select" className="block text-sm font-medium text-gray-700">
          Chọn tỉnh thành:
        </label>
        <Select
          id="province-select"
          value={selectedProvince}
          onChange={setSelectedProvince}
          options={provinces}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>
      <button
        onClick={handleAddActivity}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Thêm hoạt động
      </button>
      <button
        onClick={onRequestClose}
        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Đóng
      </button>
    </Modal>
  );
};

export default ActivityModal;
