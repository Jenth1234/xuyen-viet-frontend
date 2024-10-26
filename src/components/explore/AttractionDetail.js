import React, { useState, useEffect } from 'react';
import { getAttractionSubField } from "../../api/callApi";
import { useParams } from "react-router-dom";

const ImageSlider = () => {
  const { provinceName, type, provinceNameSub } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const name = decodeURIComponent(provinceName);
  const typeField = decodeURIComponent(type);
  const field = decodeURIComponent(provinceNameSub);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttractionSubField(name, typeField, field);
        if (response && response.data) {
          setAttraction(response.data);
        } else {
          console.error("Không tìm thấy dữ liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [name, typeField, field]);

 
  const nextSlide = () => {
    if (attraction?.IMAGES?.NORMAL) {
      setCurrentIndex((prevIndex) =>
        prevIndex === attraction.IMAGES.NORMAL.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (attraction?.IMAGES?.NORMAL) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? attraction.IMAGES.NORMAL.length - 1 : prevIndex - 1
      );
    }
  };

  if (!attraction || !attraction.IMAGES || !attraction.IMAGES.NORMAL.length) {
    return <div>Không có hình ảnh để hiển thị.</div>;
  }

  const images = attraction.IMAGES.NORMAL;

  return (
    <div className="max-w-6xl mx-auto mt-20 p-8">
      {/* Phần slider và nội dung */}
      <div className="flex">
        {/* Phần slider */}
        <div className="flex-[2] relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div className="min-w-full h-96" key={index}>
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full focus:outline-none z-10"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full focus:outline-none z-10"
          >
            ❯
          </button>
        </div>

        {/* Phần nội dung */}
        <div className="flex-[1] ml-8">
        <h2 className="text-2xl font-bold mb-4">{attraction.NAME}</h2>
           <h3 className="text-xl font-bold mb-4">Ý kiến của khách hàng</h3>
        <p className="text-md text-gray-700">
          Đây là phần để bạn thêm ý kiến của khách hàng hoặc đánh giá từ người dùng.
        </p>
        </div>
      </div>

      {/* Phần ý kiến */}
      <div className="mt-8">
    
          <p className="text-sm text-gray-600">{attraction.ADDRESS}</p>
          <p className="text-md text-gray-700 mt-2">{attraction.DESCRIPTIONPLACE}</p>
          {attraction.URLADDRESS && (
            <a href={attraction.URLADDRESS} className="text-blue-500 underline mt-2">
              Tham quan thêm
            </a>

          )}
      </div>
    </div>
  );
};

export default ImageSlider;
