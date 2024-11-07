// PrizeModal.js
import React from 'react';

const PrizeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const prizes = [
    {
      id: 1,
      name: "Giải Nhất",
      description: "Giải thưởng cho người đạt điểm cao nhất.",
      value: "100.000 VND",
    },
    {
      id: 2,
      name: "Giải Nhì",
      description: "Giải thưởng cho người đạt điểm thứ hai.",
      value: "50.000 VND",
    },
    {
      id: 3,
      name: "Giải Ba",
      description: "Giải thưởng cho người đạt điểm thứ ba.",
      value: "20.000 VND",
    },
    {
      id: 4,
      name: "Giải Khuyến Khích",
      description: "Giải thưởng cho những người có thành tích tốt nhưng không vào top 3.",
      value: "10.000 VND",
    },
   
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">Danh Sách Giải Thưởng</h2>

        {/* Hiển thị các giải thưởng */}
        {prizes.map((prize) => (
          <div key={prize.id} className="mb-4">
            <h3 className="font-semibold">{prize.name}</h3>
            <p className="text-sm text-gray-600">Mô tả: {prize.description}</p>
            <p className="text-sm text-gray-600">Giá trị: {prize.value}</p>
          </div>
        ))}

        <button onClick={onClose} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-4">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PrizeModal;
