import React from 'react';
import ReactDOM from 'react-dom';

const ImageModal = ({ isOpen, onRequestClose, imageUrl }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white p-4 rounded-lg max-w-lg mx-auto">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onRequestClose}
        >
          &times;
        </button>
        <img src={imageUrl} alt="Modal Content" className="w-full h-auto rounded-lg" />
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
