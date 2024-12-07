import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

const PhotoUploadModal = ({ showModal, selectedProvince, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      const today = new Date().toISOString().split("T")[0];
      setArrivalDate(today);
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const previews = Array.from(selectedFiles).map(file =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);
      return () => previews.forEach(url => URL.revokeObjectURL(url));
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

  const removeImage = (index) => {
    const newFiles = Array.from(selectedFiles).filter((_, i) => i !== index);
    setSelectedFiles(new FileList(newFiles));
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Thêm kỷ niệm tại {selectedProvince}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600">Kéo thả ảnh vào đây hoặc click để chọn</p>
              <p className="text-sm text-gray-500 mt-2">Hỗ trợ: JPG, PNG, GIF</p>
              <input 
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Date Picker */}
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
              <input
                type="date"
                value={arrivalDate}
                onChange={handleDateChange}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Ảnh đã chọn:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={handleUpload}
              disabled={!selectedFiles.length || !arrivalDate}
            >
              Tải lên
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PhotoUploadModal;