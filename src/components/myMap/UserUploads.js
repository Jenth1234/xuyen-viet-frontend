import React, { useState, useEffect, useCallback } from "react";
import { getProvince, uploadPhoto } from "../../api/callApi";
import defaultPhotos from "../../assets/img/defaultPhotos.json";
import PhotoUploadModal from "./modal/PhotoUploadModal";
import FullSizePhotoModal from "./modal/FullSizePhotoModal";
import AllPhotosModal from "./modal/AllPhotosModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faCalendarAlt, 
  faMapMarkerAlt,
  faImages,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { message, Spin } from 'antd';

const UserUploads = () => {
  // States
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arrivalDates, setArrivalDates] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fullSizePhoto, setFullSizePhoto] = useState(null);
  const [photoList, setPhotoList] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isViewingAllPhotos, setIsViewingAllPhotos] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProvince();
      setUploads(data.visitedProvinces);
      
      // Process arrival dates
      const datesData = data.visitedProvinces.reduce((acc, province) => {
        const latestDate = province.ARRIVAL_DATES?.reduce((latest, current) => {
          const currentDate = new Date(current.date);
          return !latest || currentDate > latest ? currentDate : latest;
        }, null);
        
        acc[province.PROVINCE] = latestDate ? 
          latestDate.toISOString().split("T")[0] : null;
        
        return acc;
      }, {});
      
      setArrivalDates(datesData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handlePhotoClick = useCallback((photoUrl, province) => {
    const defaultProvincePhotos = defaultPhotos[province] || [];
    const uploadedProvincePhotos = uploads.find(u => u.PROVINCE === province)?.PHOTOURLS || [];
    const combinedPhotos = [...defaultProvincePhotos, ...uploadedProvincePhotos];
    
    const index = combinedPhotos.indexOf(photoUrl);
    if (index !== -1) {
      setPhotoList(combinedPhotos);
      setCurrentPhotoIndex(index);
      setFullSizePhoto(photoUrl);
      setIsViewingAllPhotos(combinedPhotos.length > 6 && index >= 6);
    }
  }, [uploads]);

  const handleUpload = useCallback(async (files, arrivalDate) => {
    if (!files.length || !selectedProvince || !arrivalDate) {
      message.warning("Vui lòng chọn ảnh, tỉnh và ngày để tải lên.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      for (let i = 0; i < files.length; i++) {
        await uploadPhoto(files[i], selectedProvince, arrivalDate, token);
      }
      
      message.success(`Đã tải lên thành công các ảnh của tỉnh ${selectedProvince}`);
      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error);
      message.error("Có lỗi xảy ra khi tải lên ảnh.");
    } finally {
      setLoading(false);
    }
  }, [selectedProvince, fetchData]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedProvince("");
  }, []);

  const handleCloseFullSizeModal = useCallback(() => {
    setFullSizePhoto(null);
    setPhotoList([]);
    setCurrentPhotoIndex(0);
    setIsViewingAllPhotos(false);
  }, []);

  // Loading and Error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-4xl mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kỷ niệm du lịch của bạn</h1>
      <div className="space-y-8">
        {uploads.map((upload, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Province Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                {upload.PROVINCE}
              </h3>
              <div className="flex items-center text-blue-100 mt-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>
                  {arrivalDates[upload.PROVINCE] 
                    ? new Date(arrivalDates[upload.PROVINCE]).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Chưa có thông tin ngày đến"}
                </span>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Default Photos */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                    <FontAwesomeIcon icon={faImages} className="mr-2" />
                    Ảnh Tham Khảo
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(defaultPhotos[upload.PROVINCE] || [])
                      .slice(0, 4)
                      .map((photo, i) => (
                        <div 
                          key={`default-${i}`}
                          className="relative group rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={photo}
                            alt={`${upload.PROVINCE} ${i + 1}`}
                            className="w-full h-48 object-cover transform transition-all duration-500 group-hover:scale-110"
                            onClick={() => handlePhotoClick(photo, upload.PROVINCE)}
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        </div>
                    ))}
                  </div>
                </div>

                {/* User Photos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                      <FontAwesomeIcon icon={faImages} className="mr-2" />
                      Ảnh Của Bạn
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedProvince(upload.PROVINCE);
                        setShowModal(true);
                      }}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg 
                        hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Thêm Ảnh
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {upload.PHOTOURLS && upload.PHOTOURLS.length > 0 ? (
                      upload.PHOTOURLS.slice(0, 4).map((url, i) => (
                        <div 
                          key={`uploaded-${i}`}
                          className="relative group rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={url}
                            alt={`Uploaded ${i + 1}`}
                            className="w-full h-48 object-cover transform transition-all duration-500 group-hover:scale-110"
                            onClick={() => handlePhotoClick(url, upload.PROVINCE)}
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-48 bg-gray-50 
                        rounded-lg border-2 border-dashed border-gray-300">
                        <FontAwesomeIcon icon={faImages} className="text-gray-400 text-3xl mb-2" />
                        <p className="text-gray-500 text-center">
                          Chưa có ảnh nào được tải lên
                        </p>
                      </div>
                    )}
                  </div>

                  {upload.PHOTOURLS?.length > 4 && (
                    <button
                      onClick={() => setIsViewingAllPhotos(true)}
                      className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-center 
                        transition-colors duration-300 hover:bg-blue-50 rounded-lg"
                    >
                      Xem tất cả ({upload.PHOTOURLS.length} ảnh)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Modals */}
        <PhotoUploadModal
          showModal={showModal}
          selectedProvince={selectedProvince}
          onClose={handleCloseModal}
          onUpload={handleUpload}
        />
        <FullSizePhotoModal
          isOpen={!isViewingAllPhotos && fullSizePhoto}
          onClose={handleCloseFullSizeModal}
          photoUrl={fullSizePhoto}
          photoList={photoList}
          currentPhotoIndex={currentPhotoIndex}
          setCurrentPhotoIndex={setCurrentPhotoIndex}
          setFullSizePhoto={setFullSizePhoto}
        />
        <AllPhotosModal
          isOpen={isViewingAllPhotos}
          onClose={handleCloseFullSizeModal}
          photoList={photoList}
          currentPhotoIndex={currentPhotoIndex}
          setCurrentPhotoIndex={setCurrentPhotoIndex}
        />
      </div>
    </div>
  );
};

export default UserUploads;