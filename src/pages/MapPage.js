import React, { useState, useEffect, useCallback } from 'react';
import Map from '../components/myMap/Map';
import ProvinceList from '../components/myMap/ProvinceList';
import Statistics from '../components/myMap/Statistics';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faList, 
  faUpload 
} from "@fortawesome/free-solid-svg-icons";
import Modal from '../components/Modal';
import UserInfo from '../components/UserInfo';
import UserUploads from '../components/myMap/UserUploads';
import { getProvince, saveProvince, uploadPhoto } from '../api/callApi';
import UploadPhotoModal from '../components/myMap/modal/UploadPhotoModal';
import SummaryInformation from '../components/myMap/SummaryInformation';
const MapPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [visitedProvinces, setVisitedProvinces] = useState([]);
  const [token, setToken] = useState(null);

  // Define fetchProvinces using useCallback
  const fetchProvinces = useCallback(async () => {
    try {
      const data = await getProvince();
      setVisitedProvinces(data.visitedProvinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  }, []); // No dependencies needed for this function

  // Initial fetch
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
      await saveProvince(province, token);
      await fetchProvinces();
    } catch (error) {
      console.error('Error saving province:', error);
    }
  };

  // Handle photo upload and refresh the list
  const handleUploadPhoto = useCallback(async (file) => {
    try {
      await uploadPhoto(file, selectedProvince, token);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bản đồ du lịch Việt Nam
          </h1>
          <p className="mt-2 text-gray-600">
            Khám phá và lưu giữ kỷ niệm của bạn tại các tỉnh thành
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Map and Statistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <Map onAddProvince={handleSaveProvince} />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <Statistics />
              </div>
            </div>
          </div>

          {/* Summary and Uploads Section */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <SummaryInformation />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <UserUploads uploads={uploads} onUploadClick={openUploadModal} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={openModal}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                text-white font-medium rounded-lg shadow-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              Danh sách tỉnh đã đến
            </button>
            
            <button
              onClick={openUploadModal}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 
                text-white font-medium rounded-lg shadow-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Tải ảnh lên
            </button>
          </div>
        </div>

        {/* Modals */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          className="bg-white rounded-xl shadow-xl max-w-2xl mx-auto"
        >
          <ProvinceList provinces={visitedProvinces} />
        </Modal>

        <UploadPhotoModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
          province={selectedProvince}
          onUpload={handleUploadPhoto}
          className="bg-white rounded-xl shadow-xl max-w-2xl mx-auto"
        />
      </div>
    </div>
  );
};

export default MapPage;