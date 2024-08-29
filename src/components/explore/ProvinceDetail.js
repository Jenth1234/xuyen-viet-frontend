// src/components/ProvinceDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getAttractionDetail } from '../../api/callApi';
import ImageModal from './modal/ImageModal'; // Modal cho ảnh thông thường
import PanoramaViewer from './PanoramaViewer'; // Thêm PanoramaViewer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../NavBar';

const ProvinceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [province, setProvince] = useState({ cafes: [], beaches: [] });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [panoramaImage, setPanoramaImage] = useState('');
  const provinceName = location.state?.name || 'Unknown Province';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttractionDetail(id);
        if (data) {
          setProvince(data);
        } else {
          console.error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching province data:', error);
      }
    };

    fetchData();
  }, [id]);

  const openModal = (image, title) => {
    setModalImage(image);
    setModalTitle(title);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage('');
    setModalTitle('');
  };

  const openPanorama = (image) => {
    setPanoramaImage(image);
    setIsPanoramaOpen(true);
  };

  const closePanorama = () => {
    setIsPanoramaOpen(false);
    setPanoramaImage('');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">{provinceName}</h1>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Quán Cafe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.cafes && province.cafes.length > 0 ? (
              province.cafes.map((cafe, index) => (
                <div key={index} className="relative">
                  <img
                    src={cafe.images[0]?.normal}
                    alt={cafe.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => openModal(cafe.images[0]?.normal, cafe.name)}
                  />
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(cafe.images[0]?.panorama)}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{cafe.name}</h3>
                    <p className="mt-2 text-gray-600">{cafe.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có quán cafe nào.</p>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Bãi Biển</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.beaches && province.beaches.length > 0 ? (
              province.beaches.map((beach, index) => (
                <div key={index} className="relative">
                  <img
                    src={beach.images[0]?.normal}
                    alt={beach.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => openModal(beach.images[0]?.normal, beach.name)}
                  />
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(beach.images[0]?.panorama)}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{beach.name}</h3>
                    <p className="mt-2 text-gray-600">{beach.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có bãi biển nào.</p>
            )}
          </div>
        </section>

        {/* Modal cho ảnh thông thường */}
        <ImageModal isOpen={modalIsOpen} onRequestClose={closeModal} imageUrl={modalImage} title={modalTitle} />

        {/* Modal cho panorama */}
        {isPanoramaOpen && <PanoramaViewer imageUrl={panoramaImage} onClose={closePanorama} />}
      </div>
    </>
  );
};

export default ProvinceDetail;
