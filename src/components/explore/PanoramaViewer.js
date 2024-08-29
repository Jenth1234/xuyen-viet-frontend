// src/components/PanoramaViewer.js
import React from 'react';
import { Pannellum } from 'pannellum-react'; // Đảm bảo sử dụng đúng component từ thư viện

const PanoramaViewer = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button 
        className="absolute top-4 right-4 bg-white text-black p-2 rounded shadow-lg"
        onClick={onClose}
      >
        Close
      </button>
      <Pannellum
        width="85%"
        height="85%"
        image={imageUrl}
        pitch={5} // Điều chỉnh góc pitch nếu cần
        yaw={0} // Cài đặt góc yaw là 180 độ
        hfov={110} // Cài đặt góc Field of View ngang
        autoLoad
      />
    </div>
  );
};

export default PanoramaViewer;
