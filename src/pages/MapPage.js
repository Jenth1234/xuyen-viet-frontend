import React, { useState, useEffect, useCallback } from 'react';
import Map from '../components/myMap/Map';
import ProvinceList from '../components/myMap/ProvinceList';
import Statistics from '../components/myMap/Statistics';

import Modal from '../components/Modal';
import UserInfo from '../components/UserInfo';
import SummaryInformation from '../components/myMap/SummaryInformation';
import UserUploads from '../components/myMap/UserUploads';
import { getProvince, saveProvince, uploadPhoto } from '../api/callApi';
import UploadPhotoModal from '../components/myMap/modal/UploadPhotoModal';

const MapPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [visitedProvinces, setVisitedProvinces] = useState([]);
  const [token, setToken] = useState(null);

  // Fetch token (Assuming it's stored in localStorage)
  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem('accessToken');
      setToken(storedToken);
    };
    
    fetchToken();
  }, []);

  // Fetch provinces data from API
  const fetchProvinces = useCallback(async () => {
    try {
      const data = await getProvince(token); // Pass token here if needed
      setVisitedProvinces(data.visitedProvinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Handlers for modals
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openUploadModal = (province) => {
    setSelectedProvince(province);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => setUploadModalOpen(false);

  // Save province and refresh the list
  const handleSaveProvince = async (province) => {
    try {
      await saveProvince(province, token); // Pass token here if needed
      await fetchProvinces();
    } catch (error) {
      console.error('Error saving province:', error);
    }
  };

  // Handle photo upload and refresh the list
  const handleUploadPhoto = useCallback(async (file) => {
    try {
      await uploadPhoto(file, selectedProvince, token); // Pass token here if needed
      await fetchProvinces();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }, [fetchProvinces, selectedProvince, token]);

  // Prepare uploads data for display
  const uploads = visitedProvinces.map(province => ({
    province: province.PROVINCE,
    photos: province.PHOTOS || []
  }));

  return (
    <div className="relative min-h-screen bg-gray-100">

      <div className="pt-16 md:pt-20">
        <div className="px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-6"></h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-3/4">
              <Map onAddProvince={handleSaveProvince} />
            </div>
            <aside className="w-full md:w-1/4 md:ml-4">
              <Statistics />
            </aside>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/5">
              <SummaryInformation token={token} /> {/* Pass token here */}
            </div>
            <div className="w-full md:w-4/5 md:ml-4">
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
