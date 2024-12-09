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
    const uploadedProvincePhotos = uploads.find(u => u.PROVINCE === province)?.PHOTOS.map(p => p.URL) || [];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Kỷ niệm du lịch của bạn</h1>
      <p className="text-gray-600 mb-8">Lưu giữ những khoảnh khắc đẹp trên hành trình khám phá Việt Nam</p>
      
      <div className="space-y-10">
        {uploads.map((upload, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Province Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-bold text-white flex items-center mb-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                    {upload.PROVINCE}
                  </h3>
                  <div className="flex items-center text-blue-100">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    <span className="text-lg">
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
                <button
                  onClick={() => {
                    setSelectedProvince(upload.PROVINCE);
                    setShowModal(true);
                  }}
                  className="flex items-center px-5 py-3 bg-white/10 text-white rounded-xl
                    hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Thêm Ảnh
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Default Photos */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faImages} className="mr-3 text-blue-500" />
                    Ảnh Tham Khảo
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {(defaultPhotos[upload.PROVINCE] || [])
                      .slice(0, 4)
                      .map((photo, i) => (
                        <div 
                          key={`default-${i}`}
                          className="relative group rounded-2xl overflow-hidden cursor-pointer aspect-square shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                          <img
                            src={photo}
                            alt={`${upload.PROVINCE} ${i + 1}`}
                            className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                            onClick={() => handlePhotoClick(photo, upload.PROVINCE)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                  </div>
                </div>

                {/* User Photos */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faImages} className="mr-3 text-blue-500" />
                    Ảnh Của Bạn ({upload.PHOTOS?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {upload.PHOTOS && upload.PHOTOS.length > 0 ? (
                      upload.PHOTOS.slice(0, 4).map((photo, i) => (
                        <div 
                          key={photo._id}
                          className="relative group rounded-2xl overflow-hidden cursor-pointer aspect-square shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                          <img
                            src={photo.URL}
                            alt={`Uploaded ${i + 1}`}
                            className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                            onClick={() => handlePhotoClick(photo.URL, upload.PROVINCE)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-sm font-medium">
                              {new Date(photo.UPLOAD_DATE).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            {photo.DESCRIPTION && (
                              <p className="text-sm mt-2 opacity-90 line-clamp-2">
                                {photo.DESCRIPTION}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <FontAwesomeIcon icon={faImages} className="text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 text-lg">Chưa có ảnh nào được tải lên</p>
                        <p className="text-gray-400 mt-2">Hãy thêm những kỷ niệm đẹp của bạn</p>
                      </div>
                    )}
                  </div>

                  {upload.PHOTOS?.length > 4 && (
                    <button
                      onClick={() => {
                        setPhotoList(upload.PHOTOS.map(photo => ({
                          url: photo.URL,
                          id: photo._id,
                          uploadDate: photo.UPLOAD_DATE,
                          description: photo.DESCRIPTION
                        })));
                        setSelectedProvince(upload.PROVINCE);
                        setIsViewingAllPhotos(true);
                      }}
                      className="w-full py-3 mt-4 text-blue-600 hover:text-blue-700 font-medium text-center 
                        bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                    >
                      <FontAwesomeIcon icon={faImages} className="mr-2" />
                      Xem tất cả ({upload.PHOTOS.length} ảnh)
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
          onClose={() => {
            handleCloseFullSizeModal();
            setSelectedProvince("");
          }}
          photoList={photoList}
          currentPhotoIndex={currentPhotoIndex}
          setCurrentPhotoIndex={setCurrentPhotoIndex}
          province={selectedProvince}
          onPhotoDelete={(deletedPhoto) => {
            setUploads(prevUploads => {
              return prevUploads.map(prov => {
                if (prov.PROVINCE === selectedProvince) {
                  return {
                    ...prov,
                    PHOTOS: prov.PHOTOS.filter(photo => photo._id !== deletedPhoto.id)
                  };
                }
                return prov;
              });
            });
            
            setPhotoList(prev => prev.filter(photo => photo.id !== deletedPhoto.id));
          }}
        />
      </div>
    </div>
  );
};

export default UserUploads;