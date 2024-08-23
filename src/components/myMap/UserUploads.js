import React, { useState, useEffect } from "react";
import { getProvince, uploadPhoto } from "../../api/callApi"; // Import cả uploadPhoto
import defaultPhotos from "../../assets/img/defaultPhotos.json"; // Import file JSON chứa ảnh mặc định

const UserUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince(); // Gọi API để lấy dữ liệu
        setUploads(data.visitedProvinces); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces(); // Thực thi hàm gọi API
  }, []);

  // Hàm xử lý khi chọn file
  const handleFileChange = (province, event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedProvince(province);
  };

  // Hàm xử lý khi nhấn nút tải ảnh lên
  const handleUpload = async () => {
    if (!selectedFile || !selectedProvince) {
      alert("Vui lòng chọn ảnh và tỉnh để tải lên.");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await uploadPhoto(selectedFile, selectedProvince, token);
      alert(`Đã tải lên thành công ảnh của tỉnh ${selectedProvince}`);
      
      // Sau khi tải ảnh thành công, cập nhật lại danh sách ảnh
      const data = await getProvince();
      setUploads(data.visitedProvinces);
      setSelectedFile(null);
      setSelectedProvince("");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Có lỗi xảy ra khi tải lên ảnh.");
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      {uploads.map((upload, index) => (
        <div
          key={index}
          className="flex flex-col p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h4 className="text-xl font-bold text-gray-800 mb-3">{upload.PROVINCE}</h4>
          <div className="flex flex-row gap-6 mb-4">
            {/* Phần ảnh đã tải lên */}
            <div className="flex flex-col flex-1">
              <h5 className="text-lg font-semibold text-gray-700 mb-2">Ảnh đã tải lên:</h5>
              <div className="flex flex-wrap gap-4">
                {upload.PHOTOS && upload.PHOTOS.length > 0 ? (
                  upload.PHOTOS.map((photo, i) => (
                    <img
                      key={i}
                      src={photo.URL}
                      alt={`Upload ${i}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <div className="text-gray-500">Chưa có ảnh nào được tải lên.</div>
                )}
              </div>
            </div>

            {/* Phần ảnh mặc định */}
            <div className="flex flex-col flex-1">
              <h5 className="text-lg font-semibold text-gray-700 mb-2">Ảnh mặc định:</h5>
              <div className="flex flex-wrap gap-4">
                {defaultPhotos[upload.PROVINCE] ? (
                  defaultPhotos[upload.PROVINCE].map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Default ${i}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <div className="text-gray-500">Chưa có ảnh mặc định.</div>
                )}
              </div>
            </div>
          </div>
          
          <input
            type="file"
            onChange={(event) => handleFileChange(upload.PROVINCE, event)}
            className="mb-4"
          />
          <button
            className="self-start px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onClick={handleUpload}
          >
            Tải lên ảnh mới
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserUploads;
