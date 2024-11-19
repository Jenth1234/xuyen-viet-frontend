import React from 'react';
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AttractionSlider = ({ title, provinces }) => {
  const navigate = useNavigate();

  const handleProvinceClick = (provinceName) => {
    navigate(`/attraction/${provinceName}`, { state: { name: provinceName } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      }
    ]
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 -mr-6 group hidden md:block"
      >
        <svg 
          className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 -ml-6 group hidden md:block"
      >
        <svg 
          className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-50">
      {/* Title Section */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          {title}
        </motion.h2>
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"
        />
      </div>

      {/* Slider Section */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <Slider {...settings} className="!-mx-4">
          {provinces.length > 0 ? (
            provinces.map((province, index) => (
              <motion.div
                key={province.NAME}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="px-4"
              >
                <div 
                  onClick={() => handleProvinceClick(province.NAME)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={province.BACKGROUND}
                      alt={province.NAME}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="px-6 py-3 bg-white/90 hover:bg-white text-gray-900 rounded-full font-medium transform -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Khám phá ngay
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {province.NAME}
                    </h3>
                    {province.description && (
                      <p className="text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {province.description}
                      </p>
                    )}
                    
                    {/* Additional Info */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{province.REGION || 'Miền Nam'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>{province.PLACES || '10+ địa điểm'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl">Chưa có dữ liệu</p>
            </motion.div>
          )}
        </Slider>
      </div>

      {/* Custom Styles for Slider Dots */}
      <style jsx global>{`
        .slick-dots {
          @apply -bottom-10;
        }
        .slick-dots li {
          @apply mx-1;
        }
        .slick-dots li button {
          @apply w-2 h-2 rounded-full bg-gray-300 transition-all duration-300 before:hidden;
        }
        .slick-dots li.slick-active button {
          @apply w-6 rounded bg-blue-600;
        }
      `}</style>
    </div>
  );
};

export default AttractionSlider;