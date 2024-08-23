import React from 'react';

const UploadPhotoModal = ({ isOpen, onClose, province }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tải lên ảnh cho {province}</h2>
        <form>
          <input type="file" accept="image/*" multiple className="mb-4" />
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
