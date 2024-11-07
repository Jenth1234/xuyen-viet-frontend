import React from 'react';

const PanoramaModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;
console.log("11111111")
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg max-w-full max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={imageSrc}
            alt="Panorama"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PanoramaModal;
