import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircleOutlined, TrophyOutlined, GiftOutlined } from '@ant-design/icons';

const PrizeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const prizes = [
    {
      id: 1,
      name: "Giải Nhất",
      description: "Giải thưởng cho người đạt điểm cao nhất.",
      value: "100.000 VND",
      color: "from-yellow-400 to-yellow-600",
      icon: "🏆"
    },
    {
      id: 2,
      name: "Giải Nhì",
      description: "Giải thưởng cho người đạt điểm thứ hai.",
      value: "50.000 VND",
      color: "from-gray-300 to-gray-500",
      icon: "🥈"
    },
    {
      id: 3,
      name: "Giải Ba",
      description: "Giải thưởng cho người đạt điểm thứ ba.",
      value: "20.000 VND",
      color: "from-yellow-600 to-yellow-800",
      icon: "🥉"
    },
    {
      id: 4,
      name: "Giải Khuyến Khích",
      description: "Giải thưởng cho những người có thành tích tốt.",
      value: "10.000 VND",
      color: "from-blue-400 to-blue-600",
      icon: "🎁"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-white rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrophyOutlined className="text-2xl text-yellow-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                Danh Sách Giải Thưởng
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <CloseCircleOutlined className="text-2xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid gap-6">
            {prizes.map((prize, index) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                key={prize.id}
                className="bg-gradient-to-r p-[2px] rounded-xl hover:shadow-lg transition-shadow"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              >
                <div className="bg-white p-4 rounded-xl h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{prize.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{prize.name}</h3>
                      <p className="text-gray-600 mb-2">{prize.description}</p>
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <GiftOutlined />
                        <span>Giá trị: {prize.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 
                         hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg 
                         transition-all duration-300 transform hover:scale-[1.02]"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrizeModal;