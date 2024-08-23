import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Explore = () => {
  const destinations = [
    {
      id: 1,
      name: 'Hạ Long Bay',
      image: 'https://example.com/halong-bay.jpg',
      description: 'Kỳ quan thiên nhiên thế giới.',
    },
    {
      id: 2,
      name: 'Sapa',
      image: 'https://example.com/sapa.jpg',
      description: 'Vùng núi với cảnh đẹp và văn hóa phong phú.',
    },
    {
      id: 3,
      name: 'Huế',
      image: 'https://example.com/hue.jpg',
      description: 'Cố đô với di tích lịch sử.',
    },
    {
      id: 4,
      name: 'Đà Nẵng',
      image: 'https://example.com/danang.jpg',
      description: 'Thành phố biển với nhiều điểm du lịch hấp dẫn.',
    },
    {
      id: 5,
      name: 'Nha Trang',
      image: 'https://example.com/nhatrang.jpg',
      description: 'Khu nghỉ dưỡng biển nổi tiếng.',
    },
    {
      id: 6,
      name: 'Phú Quốc',
      image: 'https://example.com/phuquoc.jpg',
      description: 'Hòn đảo thiên đường với những bãi biển đẹp.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Khám Phá</h1>

      {/* Thanh tìm kiếm */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          className="w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3} // Hiển thị 3 ảnh cùng lúc
        navigation
        pagination={{ clickable: true }}
        className="swiper-container"
      >
        {destinations.map((destination) => (
          <SwiperSlide key={destination.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{destination.name}</h2>
            <p className="text-gray-600">{destination.description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Explore;
