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
      {/* Background với hiệu ứng parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
        style={{ 
          backgroundImage: `url(${bgVote})`,
          filter: 'brightness(0.8)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content với animation */}
      <div className="relative h-full flex flex-col justify-center items-center text-white z-10 px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500
            animate-pulse">
            Bình Chọn Điểm Đến Yêu Thích
          </h1>
          <p className="text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Hãy là người góp phần tạo nên những điểm đến tuyệt vời nhất Việt Nam
          </p>
        </div>

        {/* Countdown Timer với glass effect */}
        <div className="text-center backdrop-blur-sm bg-white/10 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Thời Gian Còn Lại
          </h2>
          <div className="flex space-x-8">
            {[
              { value: timeRemaining.days, label: 'Ngày' },
              { value: timeRemaining.hours, label: 'Giờ' },
              { value: timeRemaining.minutes, label: 'Phút' },
              { value: timeRemaining.seconds, label: 'Giây' }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="bg-white/90 rounded-2xl p-8 backdrop-blur-lg shadow-2xl
                    transform hover:scale-110 transition-all duration-500 hover:shadow-yellow-500/20
                    border border-yellow-500/20">
                    <span className="text-5xl font-bold bg-gradient-to-br from-yellow-600 to-orange-600 
                      bg-clip-text text-transparent block min-w-[80px]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-base font-medium text-gray-600 mt-3 block uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                </div>
                {index < 3 && (
                  <div className="text-5xl font-bold self-center animate-pulse text-yellow-400">:</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Call to Action Button với animation */}
        <div className="mt-16">
          <button className="relative overflow-hidden group px-10 py-5 rounded-full font-bold text-xl
            bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white
            shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <span className="relative z-10">Bình Chọn Ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>

      {/* Scroll to Top Button với animation */}
      <button
        className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50
          bg-gradient-to-r from-yellow-400 to-orange-500 
          hover:from-yellow-500 hover:to-orange-600
          transform hover:scale-110 transition-all duration-300
          animate-bounce"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-arrow-up text-white text-xl"></i>
      </button>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-48 
        bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    </div>
  );  
};

export default BannerTimeVote;
