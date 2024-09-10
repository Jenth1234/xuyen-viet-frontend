import React from 'react';
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const AttractionSlider = ({ title, provinces }) => {
  const navigate = useNavigate();

  const handleProvinceClick = (provinceName) => {
    navigate(`/attraction/${provinceName}`, { state: { name: provinceName } }); // Điều hướng đến trang chi tiết tỉnh với tên tỉnh
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
  };

  return (
    <div className="max-w-8xl mx-10 p-2">
      <div className='text-2xl font-semibold mb-4 border-b-2 border-black pb-2'>
        {title}
      </div>
      <Slider {...settings}>
        {provinces.length > 0 ? (
          provinces.map((province) => (
            <div 
              key={province.NAME} // Sử dụng tên tỉnh làm key
              className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleProvinceClick(province.NAME)} // Truyền tên tỉnh vào hàm điều hướng
            >
              <img
                src={province.BACKGROUND} // Sử dụng URL hình ảnh từ thuộc tính BACKGROUND
                alt={province.NAME}
                className="w-full h-48 object-cover rounded-md mb-4" // Kiểu dáng cho hình ảnh
              />
              <h1 className="text-xl font-bold">
                {province.NAME}
              </h1>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No provinces available</p>
        )}
      </Slider>
    </div>
  );
};

export default AttractionSlider;
