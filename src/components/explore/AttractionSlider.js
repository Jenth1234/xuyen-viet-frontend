import React from 'react';
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const AttractionSlider = ({ title, provinces }) => {
  const navigate = useNavigate();

  const handleProvinceClick = (provinceName) => {
    navigate(`/attraction/${provinceName}`, { state: { name: provinceName } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 ảnh trên 1 khung hình
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-8xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-black pb-2 text-center">
        {title}
      </h2>
      <Slider {...settings}>
        {provinces.length > 0 ? (
          provinces.map((province) => (
            <div 
              key={province.NAME}
              className=" rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
              onClick={() => handleProvinceClick(province.NAME)}
            >
              <img
                src={province.BACKGROUND} // Sử dụng URL hình ảnh từ thuộc tính BACKGROUND
                alt={province.NAME}
                className="w-full h-48 object-cover rounded-md mb-4" // Kiểu dáng cho hình ảnh
              />
              <h1 className="text-xl font-bold text-center">
                {province.NAME}
              </h1>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No provinces available</p>
        )}
      </Slider>
    </div>
  );
};

export default AttractionSlider;
