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
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
          {/* Header - fixed at top */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Thêm kỷ niệm tại {selectedProvince}
                </h3>
                <p className="text-sm text-gray-500">Chia sẻ những khoảnh khắc đẹp trong chuyến đi của bạn</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center 
                hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer
                group relative overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 
                  rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faImage} className="text-4xl text-blue-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </h4>
                <p className="text-gray-500">Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB/ảnh)</p>
              </div>
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
            <div className="bg-gray-50 p-3 rounded-lg space-y-1">
              <label className="block text-sm font-medium text-gray-700">Ngày chụp</label>
              <div className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-gray-200">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={handleDateChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-500" />
                    Ảnh đã chọn ({previewImages.length})
                  </h4>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previewImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative group aspect-square rounded-lg overflow-hidden shadow-sm 
                        hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={image}
                        alt={`preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white 
                            p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTimes} className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions - fixed at bottom */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg
                  hover:bg-gray-200 transition-all duration-300"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg
                  hover:bg-blue-600 hover:shadow-md transform hover:-translate-y-0.5
                  transition-all duration-300 disabled:opacity-50 disabled:hover:transform-none"
                onClick={handleUpload}
                disabled={!selectedFiles.length || !arrivalDate}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Tải lên
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PhotoUploadModal;