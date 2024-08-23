import React, { useState, useEffect, useCallback } from 'react';
import Map from '../components/myMap/Map';
import ProvinceList from '../components/myMap/ProvinceList';
import Statistics from '../components/myMap/Statistics';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import UserInfo from '../components/UserInfo';
import UserUploads from '../components/myMap/UserUploads';
import { getProvince, saveProvince, uploadPhoto } from '../api/callApi'; // Cập nhật hàm API
import UploadPhotoModal from '../components/myMap/UploadPhotoModal';

const MapPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [visitedProvinces, setVisitedProvinces] = useState([]);

  const fetchProvinces = useCallback(async () => {
    try {
      const data = await getProvince();
      setVisitedProvinces(data.visitedProvinces);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh:', error);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openUploadModal = (province) => {
    setSelectedProvince(province);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => setUploadModalOpen(false);

  const handleSaveProvince = async (province) => {
    try {
      await saveProvince(province); // Sử dụng hàm saveProvince
      const data = await getProvince(); // Cập nhật danh sách các tỉnh đã thăm
      setVisitedProvinces(data.visitedProvinces);
    } catch (error) {
      console.error('Lỗi khi lưu tỉnh:', error);
    }
  };

  const handleUploadPhoto = useCallback(async (file) => {
    try {
      await uploadPhoto(file, selectedProvince);
      await fetchProvinces(); // Cập nhật danh sách các tỉnh đã thăm
    } catch (error) {
      console.error('Lỗi khi tải lên ảnh:', error);
    }
  }, [fetchProvinces, selectedProvince]);

  const uploads = visitedProvinces.map(province => ({
    province: province.PROVINCE,
    photos: province.PHOTOS || []
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
              <Map onAddProvince={handleSaveProvince} /> {/* Cập nhật prop */}
            </div>
            <aside className="w-full md:w-1/4 md:ml-4">
              <Statistics />
            </aside>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <UserInfo user={user} />
            </div>
            <div className="w-full">
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
        province={selectedProvince}
        onUpload={handleUploadPhoto}
      />
    </div>
  );
};

export default MapPage;
