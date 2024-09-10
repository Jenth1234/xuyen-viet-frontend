import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAttractionSubField } from "../../api/callApi";
import ImageModal from "./modal/ImageModal";
import PanoramaViewer from "./modal/PanoramaModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AttractionDetail = () => {
  const { provinceName, type, provinceNameSub } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [panoramaImage, setPanoramaImage] = useState("");

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
  };

  const closePanorama = () => {
    setIsPanoramaOpen(false);
    setPanoramaImage("");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 slides cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (!attraction) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="max-w-6xl mt-16 mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{attraction.NAME}</h1>

      {/* Slider ảnh */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Ảnh Chi Tiết</h2>
        {Array.isArray(attraction.IMAGES?.NORMAL) && attraction.IMAGES.NORMAL.length > 0 ? (
          <Slider {...sliderSettings}>
            {attraction.IMAGES.NORMAL.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={attraction.NAME}
                  className="w-full h-80 object-cover"
                  onClick={() => openModal(image, attraction.NAME)} // Click để mở modal xem ảnh
                />
                {attraction.IMAGES.PANORAMA?.[index] && (
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(attraction.IMAGES.PANORAMA[index])}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-600">Chưa có ảnh nào.</p>
        )}
      </section>

      {/* Địa chỉ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Địa Chỉ</h2>
        <p className="text-gray-700">{attraction.ADDRESS || "Không có thông tin địa chỉ."}</p>
      </section>

      {/* Mô tả */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Mô Tả</h2>
        <p className="text-gray-700">{attraction.DESCRIPTIONPLACE || "Không có mô tả."}</p>
      </section>

      {/* Địa chỉ URL */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Địa Chỉ URL</h2>
        {attraction.URLADDRESS ? (
          <p className="text-gray-700">
            <a href={attraction.URLADDRESS} target="_blank" rel="noopener noreferrer">
              {attraction.URLADDRESS}
            </a>
          </p>
        ) : (
          <p className="text-gray-600">Không có địa chỉ URL.</p>
        )}
      </section>

      {/* Modal Image */}
      <ImageModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        image={modalImage}
        title={modalTitle}
      />
      
      {/* Panorama Viewer */}
      <PanoramaViewer
        isOpen={isPanoramaOpen}
        onClose={closePanorama}
        image={panoramaImage}
      />
    </div>
  );
};

export default AttractionDetail;
