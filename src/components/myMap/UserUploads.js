import React, { useState, useEffect } from "react";
import {getProvince,uploadPhoto,updateArrivalDates,} from "../../api/callApi";
import defaultPhotos from "../../assets/img/defaultPhotos.json";
import PhotoUploadModal from "./modal/PhotoUploadModal";
import FullSizePhotoModal from "./modal/FullSizePhotoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AllPhotosModal from "./modal/AllPhotosModal"; // Import modal mới

const UserUploads = () => {
  const [provinces, setProvinces] = useState([]);

  const [arrivalDates, setArrivalDates] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState('');

  const [uploads, setUploads] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fullSizePhoto, setFullSizePhoto] = useState(null);
  const [photoList, setPhotoList] = useState([]); // Danh sách ảnh hiện tại
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Chỉ số ảnh hiện tại
  const [isViewingAllPhotos, setIsViewingAllPhotos] = useState(false); // Trạng thái xem tất cả ảnh

  // Hook useEffect để lấy danh sách tỉnh từ API khi component được mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        setUploads(data.visitedProvinces);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tỉnh:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchArrivalDates = async () => {
      try {
        const data = await getProvince();
        const datesData = data.visitedProvinces.reduce((acc, province) => {
          const latestDate = province.ARRIVAL_DATES.reduce((latest, current) => {
            const currentDate = new Date(current.date);
            return !latest || currentDate > latest ? currentDate : latest;
          }, null);
          
          if (latestDate) {
            acc[province.PROVINCE] = latestDate.toISOString().split("T")[0];
          } else {
            acc[province.PROVINCE] = null;
          }
          
          return acc;
        }, {});
        setArrivalDates(datesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ngày:", error);
      }
    };

    fetchArrivalDates();
  }, []);
  
  
  
  const handleEditDates = (province) => {
    setSelectedProvince(province);
    updateArrivalDates(true);
  };

  const handleSaveDates = async () => {
    try {
      await updateArrivalDates(
        selectedProvince,
        arrivalDates[selectedProvince]
      );
      alert("Đã lưu thay đổi.");
      updateArrivalDates(false);
    } catch (error) {
      console.error("Lỗi khi lưu thay đổi:", error);
      alert("Có lỗi xảy ra khi lưu thay đổi.");
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setArrivalDates({
      ...arrivalDates,
      [selectedProvince]: value
        .split("\n")
        .map((date) => new Date(date).toISOString()),
    });
  };

  // Hàm mở modal tải ảnh cho tỉnh được chọn
  const handleOpenModal = (province) => {
    setSelectedProvince(province);
    setShowModal(true);
  };

  // Hàm đóng modal tải ảnh
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProvince("");
  };

  // Hàm xử lý việc tải ảnh lên cho tỉnh được chọn
  const handleUpload = async (files, arrivalDate) => {
    if (!files.length || !selectedProvince || !arrivalDate) {
      alert("Vui lòng chọn ảnh, tỉnh và ngày để tải lên.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      for (let i = 0; i < files.length; i++) {
        await uploadPhoto(files[i], selectedProvince, arrivalDate, token);
      }
      alert(`Đã tải lên thành công các ảnh của tỉnh ${selectedProvince}`);

      const data = await getProvince();
      setUploads(data.visitedProvinces);
      handleCloseModal(); // Ẩn modal sau khi tải lên
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error);
      alert("Có lỗi xảy ra khi tải lên ảnh.");
    }
  };

  // Hàm xử lý khi người dùng nhấp vào một ảnh để xem ảnh full-size
  const handlePhotoClick = (photoUrl, province) => {
    // Tạo danh sách tất cả các ảnh liên quan đến tỉnh được nhấp
    const defaultProvincePhotos = defaultPhotos[province] || [];
    const uploadedProvincePhotos =
      uploads.find((u) => u.PROVINCE === province)?.PHOTOURLS || [];
    
    // Sắp xếp ảnh theo thứ tự: ảnh mặc định trước, ảnh đã tải lên sau
    const combinedPhotos = [
      ...defaultProvincePhotos,
      ...uploadedProvincePhotos,
    ];
  
    // Xác định chỉ số của ảnh được nhấp
    const index = combinedPhotos.indexOf(photoUrl);
  
    if (index !== -1) {
      // Cập nhật danh sách ảnh và chỉ số ảnh hiện tại
      setPhotoList(combinedPhotos);
      setCurrentPhotoIndex(index);
      setFullSizePhoto(photoUrl);
  
      // Kiểm tra xem ảnh có phải là ảnh cuối cùng của stacked ảnh không
      const isViewingAllPhotos = combinedPhotos.length > 6 && index >= 6;
      setIsViewingAllPhotos(isViewingAllPhotos); // Xác định trạng thái xem tất cả ảnh
    }
  };
  

  const handleCloseFullSizeModal = () => {
    setFullSizePhoto(null);
    setPhotoList([]);
    setCurrentPhotoIndex(0);
    setIsViewingAllPhotos(false);
  };

  return (
    <div className="p-4 space-y-6 mr-16 bg-gray-100 rounded-lg shadow-lg">
      {uploads.map((upload, index) => (
        <div
          key={index}
          className="flex flex-col  p-4 bg-white rounded-lg shadow-md transition-transform transform "
        >
          <div className="flex space-x-4 ">
          <div className="flex-[2] border  p-0 rounded-lg">
  <div className="w-full">
    {/* Hiển thị các bức ảnh đầu tiên */}
    <div className="mb-4">
      {(defaultPhotos[upload.PROVINCE] || [])
        .slice(0, 6)
        .map((photo, i) => (
          <img
            key={`default-${i}`}
            src={photo}
            alt={`Default ${i}`}
            className="object-cover  w-full h-72 rounded-tl-lg rounded-tr-lg border border-gray-400 shadow-md mb-2 cursor-pointer"
            onClick={() => handlePhotoClick(photo, upload.PROVINCE)}
          />
        ))}
    </div>

    {/* Hiển thị các bức ảnh chồng lên nhau nếu có nhiều hơn 6 bức ảnh */}
    {defaultPhotos[upload.PROVINCE]?.length > 6 && (
      <div className="relative w-full h-32 mb-4">
        {defaultPhotos[upload.PROVINCE].slice(6).map((photo, i) => (
          <img
            key={`stacked-${i}`}
            src={photo}
            alt={`Stacked ${i}`}
            className="absolute object-cover cursor-pointer w-24 h-24 sm:w-32 sm:h-32 rounded-lg border border-gray-400 shadow-md"
            style={{
              top: `${i * 5}px`,
              left: `${i * 5}px`,
              zIndex: i,
            }}
            onClick={() => handlePhotoClick(photo, upload.PROVINCE)}
          />
        ))}
      </div>
    )}
    <div className="p-2">  
       {/* Hiển thị tên tỉnh thành */}
      <h4 className="text-lg font-bold text-gray-800 mb-3">
      {upload.PROVINCE}
    </h4>
 {/* Hiển thị ngày đến gần nhất */}
     <div>
      <h2 className="text-lg font-semibold mb-2">Đặt chân</h2>
      {arrivalDates[upload.PROVINCE] ? (
        <p className="text-gray-700">{arrivalDates[upload.PROVINCE]}</p>
      ) : (
        <p className="text-gray-500">No arrival date available</p>
      )}
    </div>
  </div>
</div>
    </div>
   
  

   




              




            <div className="flex-[5] pl-2 pr-2 rounded-lg">
              <div className="flex flex-wrap   rounded-lg">
                {upload.PHOTOURLS && upload.PHOTOURLS.length > 0 ? (
                  upload.PHOTOURLS.slice(0, 4).map((url, i) => (
                    <div key={`uploaded-${i}`} className="w-1/3 p-2  ">
                      <img
                        src={url}
                        alt={`Uploaded ${i}`}
                        className="w-full h-40 object-cover cursor-pointer hover:scale-90 duration-500 rounded-lg border border-gray-400 shadow-md"
                        onClick={() => handlePhotoClick(url, upload.PROVINCE)} // Truyền thêm province
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 w-full">
                    Chưa có ảnh nào được tải lên cho tỉnh này.
                  </p>
                )}
                {upload.PHOTOURLS?.length > 5 && (
                 
                
                   <div className="w-1/3 p-2">
                      <div className="relative  h-40 mt-2 ml-2">
                    {upload.PHOTOURLS.slice(0, 5).map((url, i) => (
                      <img
                        key={`displayed-uploaded-${i}`}
                        src={url}
                        alt={`Displayed Uploaded ${i}`}
                        className="absolute inset-0 w-4/5 h-5/6 object-cover rounded-lg border border-gray-400 shadow-md"
                        style={{
                          top: `${i * 5}px`,
                          left: `${i * 5}px`,
                          zIndex: i + 1, // Đảm bảo rằng ảnh sau cùng sẽ ở trên cùng
                        }}
                        onClick={() => handlePhotoClick(url, upload.PROVINCE)}
                      />
                    ))}
                    {/* Hiển thị số lượng ảnh bị ẩn */}
                    {upload.PHOTOURLS.length > 5 && (
                       
                      <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-semibold ">
                         onClick={() => setIsViewingAllPhotos(true)} 
                        <span className="text-xl">
                          +{upload.PHOTOURLS.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                   </div>
                )}
        <div className=" w-1/3 p-12">
  <button
    onClick={() => handleOpenModal(upload.PROVINCE)} // Thêm onClick để mở modal
    className="w-20 h-20 flex justify-center items-center p-2 rounded-full hover:rotate-180 duration-500 text-white font-semibold border-2 border-green-600 hover:bg-green-700 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
  >
    <FontAwesomeIcon
      icon={faPlus}
      className="w-6 h-6 text-green-400 transition-transform duration-500"
    />{" "}
    {/* Biểu tượng dấu cộng với màu xanh lá và xoay khi hover */}
  </button>
</div>


              </div>
            </div>
          </div>

          <PhotoUploadModal
            showModal={showModal && selectedProvince === upload.PROVINCE}
            selectedProvince={selectedProvince}
            onClose={handleCloseModal}
            onUpload={handleUpload}
          />
        </div>
      ))}
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
  );
};

export default UserUploads;
