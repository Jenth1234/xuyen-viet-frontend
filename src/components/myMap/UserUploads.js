import React, { useState, useEffect } from "react";
import { getProvince, uploadPhoto } from "../../api/callApi";
import defaultPhotos from "../../assets/img/defaultPhotos.json";

const UserUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        setUploads(data.visitedProvinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleFileChange = (province, event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedProvince(province);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProvince) {
      alert("Vui lòng chọn ảnh và tỉnh để tải lên.");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await uploadPhoto(selectedFile, selectedProvince, token);
      alert(`Đã tải lên thành công ảnh của tỉnh ${selectedProvince}`);

      const data = await getProvince();
      setUploads(data.visitedProvinces);
      setSelectedFile(null);
      setSelectedProvince("");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Có lỗi xảy ra khi tải lên ảnh.");
    }
  };

  // Hàm để lấy tháng và năm từ ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Tháng (0-11)
    const year = date.getFullYear(); // Năm
    return `${month}/${year}`;
  };

  // Hàm để lấy tháng đầu tiên và tháng cuối cùng
  const getFirstAndLastVisit = (photos) => {
    if (!photos || photos.length === 0) return { firstVisit: null, lastVisit: null };

    const dates = photos.map(photo => new Date(photo.UPLOAD_DATE));
    dates.sort((a, b) => a - b);

    const firstVisit = formatDate(dates[0]);
    const lastVisit = formatDate(dates[dates.length - 1]);

    return { firstVisit, lastVisit };
  };

  return (
    <div className="p-4 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      {uploads.map((upload, index) => {
        const { firstVisit, lastVisit } = getFirstAndLastVisit(upload.PHOTOS);
        
        return (
          <div
            key={index}
            className="flex flex-col p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <h4 className="text-lg font-bold text-gray-800 mb-3">{upload.PROVINCE}</h4>
            <div className="flex mb-4 border border-gray-300 rounded-lg p-4">
              <div className="flex-3 border-r border-gray-300 pr-4">
                <h5 className="text-base font-semibold text-gray-700 mb-2">Ảnh mặc định:</h5>
                <div className="relative flex flex-wrap gap-4">
                  {defaultPhotos[upload.PROVINCE] && defaultPhotos[upload.PROVINCE].slice(0, 5).map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Default ${i}`}
                      className={`w-32 h-32 object-cover rounded-lg shadow-md ${i === 0 ? 'relative' : ''}`}
                      style={i === 0 ? { zIndex: 10 } : {}}
                    />
                  ))}
                  {defaultPhotos[upload.PROVINCE] && defaultPhotos[upload.PROVINCE].length > 5 && (
                    <div className="absolute top-0 left-0 w-32 h-32">
                      <div className="relative w-full h-full">
                        {defaultPhotos[upload.PROVINCE].slice(5).map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Default ${i + 5}`}
                            className="w-32 h-32 object-cover rounded-lg absolute"
                            style={{
                              top: `${i * 10}px`,
                              left: `${i * 10}px`,
                              zIndex: 20 - i
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-gray-700 text-sm">
                  <strong>Số kỉ niệm đã lưu giữ:</strong> {upload.PHOTOS ? upload.PHOTOS.length : 0}
                  {upload.PHOTOS && upload.PHOTOS.length > 0 && (
                    <div className="mt-2 text-gray-600 text-sm">
                      <strong>Bước chân :</strong> {firstVisit}
                      <br />
                      <strong>gần nhất:</strong> {lastVisit}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-7 pl-4">
                <h5 className="text-base font-semibold text-gray-700 mb-2">Ảnh đã tải lên:</h5>
                <div className="relative flex flex-wrap gap-4">
                  {upload.PHOTOS && upload.PHOTOS.slice(0, 5).map((photo, i) => (
                    <img
                      key={i}
                      src={photo.URL}
                      alt={`Upload ${i}`}
                      className={`w-32 h-32 object-cover rounded-lg shadow-md ${i === 0 ? 'relative' : ''}`}
                      style={i === 0 ? { zIndex: 10 } : {}}
                    />
                  ))}
                  {upload.PHOTOS && upload.PHOTOS.length > 5 && (
                    <div className="absolute top-0 left-0 w-32 h-32">
                      <div className="relative w-full h-full">
                        {upload.PHOTOS.slice(5).map((photo, i) => (
                          <img
                            key={i}
                            src={photo.URL}
                            alt={`Upload ${i + 5}`}
                            className="w-32 h-32 object-cover rounded-lg absolute"
                            style={{
                              top: `${i * 10}px`,
                              left: `${i * 10}px`,
                              zIndex: 20 - i
                            }}
                          />
                        ))}
                      </div>
                    </div>
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
        );
      })}
    </div>
  );
};

export default UserUploads;
