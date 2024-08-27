import React, { useState } from 'react';

const UploadPhotoModal = ({ isOpen, onClose, province, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleDateChange = (event) => {
    setArrivalDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (files.length === 0 || !arrivalDate) {
      alert('Vui lòng chọn ít nhất một ảnh và ngày.');
      return;
    }

    onUpload(files, arrivalDate);
    onClose(); // Đóng modal sau khi tải lên
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tải lên ảnh cho {province}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-4"
          />
          <label className="block text-gray-700 mb-2">Ngày đến:</label>
          <input
            type="date"
            value={arrivalDate}
            onChange={handleDateChange}
            className="mb-4 border border-gray-300 rounded-lg p-2 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Tải lên
          </button>
        </form>
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
