import React, { useState, useEffect } from 'react';
import Map from '../components/myMap/Map';
import ProvinceList from '../components/myMap/ProvinceList';
import Statistics from '../components/myMap/Statistics';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import UserInfo from '../components/UserInfo';
import UserUploads from '../components/myMap/UserUploads';
import { getProvince } from '../api/callApi'; // Import hàm lấy dữ liệu từ API
import UploadPhotoModal from '../components/myMap/UploadPhotoModal'; // Import modal upload ảnh

const MapPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false); // Modal upload ảnh
  const [selectedProvince, setSelectedProvince] = useState(null); // Tỉnh đang chọn để upload ảnh
  const [visitedProvinces, setVisitedProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        setVisitedProvinces(data.visitedProvinces);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openUploadModal = (province) => {
    setSelectedProvince(province);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => setUploadModalOpen(false);

  const uploads = visitedProvinces.map(province => ({
    province: province.PROVINCE,
    photos: province.PHOTOS || [] // Đảm bảo PHOTOS là một mảng
  }));

  const user = {
    avatar: 'https://via.placeholder.com/150',
    name: 'Nguyễn Văn A',
    visitedCount: visitedProvinces.length,
    remainingCount: 63 - visitedProvinces.length
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavBar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />
      <div className="pt-16 md:pt-20">
        <div className="px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-6">Trang Bản Đồ</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-3/4">
              <Map />
            </div>
            <aside className="w-full md:w-1/4 md:ml-4">
              <Statistics />
            </aside>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <UserInfo user={user} />
            </div>
            <div className="w-full ">
              <h3 className="text-xl font-bold mb-4">Ảnh Tỉnh Thành Đã Tải Lên</h3>
              <UserUploads uploads={uploads} onUploadClick={openUploadModal} />
            </div>
          </div>
          <div className="mb-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onClick={openModal}
            >
              Hiển thị danh sách tỉnh
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProvinceList provinces={visitedProvinces} />
      </Modal>

      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        province={selectedProvince} // Truyền tỉnh đang chọn vào modal upload
      />
    </div>
  );
};

export default MapPage;
