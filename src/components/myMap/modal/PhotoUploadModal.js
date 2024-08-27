import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const PhotoUploadModal = ({ showModal, selectedProvince, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  // Đặt giá trị mặc định cho ngày hiện tại
  useEffect(() => {
    if (showModal) {
      const today = new Date().toISOString().split("T")[0];
      setArrivalDate(today);
    }
  }, [showModal]);

  // Cập nhật ảnh xem trước
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const previews = Array.from(selectedFiles).map(file =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);

      // Dọn dẹp URL object sau khi không cần nữa
      return () => {
        previews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setPreviewImages([]);
    }
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleDateChange = (event) => {
    setArrivalDate(event.target.value);
  };

  const handleUpload = () => {
    if (!selectedFiles.length || !arrivalDate) {
      alert("Vui lòng chọn ảnh và ngày để tải lên.");
      return;
    }

    onUpload(selectedFiles, arrivalDate);
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
          <h5 className="text-base font-semibold text-gray-700 mb-2">
            Thêm ảnh cho {selectedProvince}:
          </h5>
          <div className="mb-4 p-1   border-green-500 border">
            <button
              className="flex  items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
              onClick={() => fileInputRef.current.click()}

            >
             
              <FontAwesomeIcon icon={faPlus} className="text-xl text-gray-700" />
            </button>
             <p className="ml-2">Hay chuyen ki niem vao day</p>
            <input 
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden  "
            />
          </div>
          <label className="block text-gray-700 mb-2">Ngày đến:</label>
          <input
            type="date"
            value={arrivalDate}
            onChange={handleDateChange}
            className="mb-4 border border-gray-300 rounded-lg p-2"
          />
          <div className="mb-4">
            {previewImages.length > 0 && (
              <div className="flex flex-wrap">
                {previewImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`preview ${index}`}
                    className="w-24 h-24 object-cover mr-2 mb-2 border rounded"
                  />
                ))}
              </div>
            )}
          </div>
          <button
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onClick={handleUpload}
          >
            Tải lên ảnh mới
          </button>
          <button
            className="ml-4 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    )
  );
};

export default PhotoUploadModal;
