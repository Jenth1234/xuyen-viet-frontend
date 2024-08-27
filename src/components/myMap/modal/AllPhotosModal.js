// src/components/modal/AllPhotosModal.js
import React from 'react';

const AllPhotosModal = ({ isOpen, onClose, photoList, currentPhotoIndex, setCurrentPhotoIndex }) => {
  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photoList.length - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex < photoList.length - 1 ? prevIndex + 1 : 0));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">All Photos</h2>
        {photoList.length > 0 && (
          <div className="relative">
            <img
              src={photoList[currentPhotoIndex]}
              alt={`Photo ${currentPhotoIndex + 1}`}
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
                onClick={handlePrevious}
              >
                &larr; Previous
              </button>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
                onClick={handleNext}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
        {photoList.length === 0 && <p>No photos available.</p>}
      </div>
    </div>
  );
};

export default AllPhotosModal;
