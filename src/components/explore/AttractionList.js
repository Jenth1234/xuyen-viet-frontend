import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAttractionByName } from "../../api/callApi";
import ImageModal from "./modal/ImageModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faCalendar, faMapMarkerAlt  } from "@fortawesome/free-solid-svg-icons";

import PanoramaViewer from "./PanoramaViewer";
const AttractionList = () => {
  const { provinceName } = useParams();
  const [province, setProvince] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [panoramaImage, setPanoramaImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttractionByName(provinceName);
 
        if (response.data && response.data.length > 0) {
          setProvince(response.data[0]);
        } 
        else {
          console.error("Không tìm thấy dữ liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [provinceName]);

  const openModal = (image, title) => {
    setModalImage(image);
    setModalTitle(title);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage("");
    setModalTitle("");
  };

  const openPanorama = (image) => {
    setPanoramaImage(image);
    setIsPanoramaOpen(true);
    console.log(image)
  };

  const closePanorama = () => {
    setIsPanoramaOpen(false);
    setPanoramaImage("");
  };

  if (!province || Object.keys(province).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
     
     {/* Hero Section */}
<div className="relative h-[600px] mt-10">
  {/* Background Image with Parallax Effect */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-1000"
    style={{
      backgroundImage: `url(${province.BACKGROUND || "https://images.unsplash.com/photo-1528127269322-539801943592"})`,
    }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
  </div>

  {/* Hero Content */}
  <div className="relative h-full container mx-auto px-6 flex items-center">
    <div className="max-w-3xl space-y-8">
      {/* Province Name */}
      <h1 className="text-5xl md:text-7xl font-bold text-white animate-fade-in">
        {province.NAME || "Tên tỉnh"}
      </h1>

      {/* Province Description */}
      <p className="text-xl text-white/90 leading-relaxed animate-fade-in-delay">
        {province.DESCRIPTION || "Chưa có mô tả."}
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 animate-fade-in-delay-2">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl font-bold text-white mb-1">
            {province.ATTRACTIONS?.length || 0}+
          </div>
          <div className="text-sm text-white/80">Điểm đến</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl font-bold text-white mb-1">
            {province.CULTURAL?.length || 0}+
          </div>
          <div className="text-sm text-white/80">Di tích</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl font-bold text-white mb-1">
            {province.FESTIVAL?.length || 0}+
          </div>
          <div className="text-sm text-white/80">Lễ hội</div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex gap-4 animate-fade-in-delay-3">
        <a 
          href="#attractions"
          className="px-6 py-3 bg-white/90 hover:bg-white rounded-full text-gray-800 font-medium transition-all hover:shadow-lg"
        >
          Khám phá ngay
        </a>
        <a 
          href="#cultural"
          className="px-6 py-3 bg-transparent border-2 border-white/50 hover:border-white rounded-full text-white font-medium transition-all"
        >
          Di sản văn hóa
        </a>
      </div>
    </div>
  </div>

  {/* Decorative Wave Effect */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
      <defs>
        <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g className="moving-waves">
        <use href="#wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
        <use href="#wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
        <use href="#wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
        <use href="#wave" x="48" y="7" fill="#ffffff" />
      </g>
    </svg>
  </div>
</div>
 
<div className="container mx-auto px-4 py-16 max-w-7xl">
  {/* Section Navigation */}
  <div className="flex overflow-x-auto gap-6 mb-12 pb-4 scrollbar-hide">
    {[
      { icon: '🏖️', title: 'Bãi Biển', type: 'BEACHES' },
      { icon: '☕', title: 'Quán Cà Phê', type: 'CAFÉ' },
      { icon: '🏛️', title: 'Điểm Tham Quan', type: 'ATTRACTION' },
      { icon: '🏺', title: 'Di Tích Văn Hóa', type: 'CULTURAL' },
      { icon: '🎭', title: 'Lễ Hội', type: 'FESTIVAL' }
    ].map((section, index) => (
      <button
        key={index}
        className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap"
      >
        <span className="text-xl">{section.icon}</span>
        <span className="font-medium">{section.title}</span>
      </button>
    ))}
  </div>

  {/* Content Sections */}
  {[
    { title: 'Bãi Biển', data: province.BEACHES, type: 'BEACHES', icon: '🏖️' },
    { title: 'Quán Cà Phê', data: province.CAFES, type: 'CAFÉ', icon: '☕' },
    { title: 'Điểm Tham Quan', data: province.ATTRACTIONS, type: 'ATTRACTION', icon: '🏛️' },
    { title: 'Di Tích Văn Hóa', data: province.CULTURAL, type: 'CULTURAL', icon: '🏺' },
    { title: 'Lễ Hội', data: province.FESTIVAL, type: 'FESTIVAL', icon: '🎭' }
  ].map((section, sectionIndex) => (
    <section key={sectionIndex} className="mb-16" id={section.type.toLowerCase()}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{section.icon}</span>
        <h2 className="text-3xl font-bold">{section.title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {section.data && section.data.length > 0 ? (
          section.data.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Link to={`/attraction/${province.NAME}/${section.type}/${item.NAME}`}>
                  <img
                    src={item.IMAGES?.NORMAL?.[0] || `default-${section.type.toLowerCase()}.jpg`}
                    alt={item.NAME}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>

                {/* Panorama Button */}
                {item.IMAGES?.PANORAMA?.[0] && (
                  <button
                    onClick={() => openPanorama(item.IMAGES.PANORAMA[0])}
                    className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-all group-hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700 group-hover:text-blue-600" />
                  </button>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                  {section.icon} {section.title}
                </div>
              </div>

              <div className="p-6">
                <Link 
                  to={`/attraction/${province.NAME}/${section.type}/${item.NAME}`}
                  className="block group"
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                    {item.NAME}
                  </h3>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.DESCRIPTION || `${section.title} tại ${province.NAME}`}
                </p>

                {section.type === 'FESTIVAL' && item.DATE && (
                  <div className="flex items-center text-sm text-gray-500 mt-4 pt-4 border-t">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    {new Date(item.DATE).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-4">{section.icon}</div>
              <p className="text-gray-500 mb-2">Chưa có {section.title.toLowerCase()} nào.</p>
              <p className="text-sm text-gray-400">Chúng tôi sẽ cập nhật sớm!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  ))}
</div>  

      {/* {modalIsOpen && (
        <ImageModal isOpen={modalIsOpen} onClose={closeModal} image={modalImage} title={modalTitle} />
      )} */}

      {/* {isPanoramaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div>toàn cảnh</div>
          <button
            
            className="oj"
            onClick={closePanorama}
          >
            &times;
          </button>
          <img src={panoramaImage} alt="Panorama" className="max-w-full max-h-full" />
        </div>
      )} */}

{isPanoramaOpen && (
  <PanoramaViewer
  
    image={panoramaImage}
    onClose={closePanorama}
  />
)}
    </>
  );
};

export default AttractionList;
