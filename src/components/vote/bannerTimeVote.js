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
    <div
      className="relative bg-cover bg-center mt-5 h-screen"
      style={{ backgroundImage: `url(${bgVote})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <main className="">
        <div className="absolute z-10 bottom-4 left-4 pl-24">
          <p className="mt-8 text-xl">Thời gian còn lại:</p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="bg-white p-4 rounded">
              <p className="text-2xl font-bold">{timeRemaining.days}</p>
              <p>Ngày</p>
            </div>
            <div className="text-2xl font-bold">:</div>
            <div className="bg-white  p-4 rounded">
              <p className="text-2xl font-bold">{timeRemaining.hours}</p>
              <p>Giờ</p>
            </div>
            <div className="text-2xl font-bold">:</div>
            <div className="bg-white  p-4 rounded">
              <p className="text-2xl font-bold">{timeRemaining.minutes}</p>
              <p>Phút</p>
            </div>
            <div className="text-2xl font-bold">:</div>
            <div className="bg-white  p-4 rounded">
              <p className="text-2xl font-bold">{timeRemaining.seconds}</p>
              <p>Giây</p>
            </div>
          </div>
        </div>
      </main>
      <button
        className="fixed bottom-4 right-4 bg-orange-500 p-4 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-arrow-up text-white"></i>
      </button>
    </div>
  );
};

export default BannerTimeVote;
