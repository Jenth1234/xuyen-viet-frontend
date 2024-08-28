// src/components/modal/AllPhotosModal.js
import React from 'react';

const AllPhotosModal = ({ isOpen, onClose, photoList }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="all-photos-modal-title"
      aria-modal="true"
    >
      <div className="bg-white p-4 rounded-lg max-w-5xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="all-photos-modal-title" className="text-xl font-semibold mb-4">All Photos</h2>
        {photoList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoList.map((photoUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={photoUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => e.target.src = '/path/to/fallback-image.jpg'} // Fallback image in case of error
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No photos available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPhotosModal;
