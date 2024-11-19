import React, { useState, useEffect } from 'react';
import bgVote from '../../style/img/bg-vote.png';
import { getVoteByYear } from '../../api/apiVote';

const calculateTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const BannerTimeVote = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const data = await getVoteByYear();
        const endTime = data.data[0].ENDTIME;
        const updateTimeRemaining = () => {
          const time = calculateTimeRemaining(endTime);
          if (time.total > 0) {
            setTimeRemaining(time);
          } else {
            clearInterval(interval);
          }
        };
        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching vote data:', error);
      }
    };

    fetchVoteData();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgVote})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-white z-10">
        <div className="text-center mb-12 px-4">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Bình Chọn Điểm Đến Yêu Thích
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Hãy là người góp phần tạo nên những điểm đến tuyệt vời nhất Việt Nam
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">
            Thời Gian Còn Lại
          </h2>
          <div className="flex space-x-6">
            {[
              { value: timeRemaining.days, label: 'Ngày' },
              { value: timeRemaining.hours, label: 'Giờ' },
              { value: timeRemaining.minutes, label: 'Phút' },
              { value: timeRemaining.seconds, label: 'Giây' }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="bg-white bg-opacity-90 rounded-xl p-6 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl font-bold text-gray-800 block min-w-[60px]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-gray-600 mt-2 block">
                      {item.label}
                    </span>
                  </div>
                </div>
                {index < 3 && (
                  <div className="text-4xl font-bold self-center text-yellow-400">:</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-12">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Bình Chọn Ngay
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-arrow-up text-white text-xl"></i>
      </button>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-50"></div>
    </div>
  );  
};

export default BannerTimeVote;
