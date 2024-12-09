// src/components/modal/AllPhotosModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { deletePhoto } from "../../../api/callApi";

const AllPhotosModal = ({ isOpen, onClose, photoList, province, onPhotoDelete }) => {
  if (!isOpen) return null;
 

  const handleDeletePhoto = async (photo) => {
    try {
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
      if (!isConfirmed) return;

      if (!photo.id) {
        throw new Error('Không tìm thấy ID của ảnh');
      }

      await deletePhoto(province, photo.id);
      
      if (onPhotoDelete) {
        onPhotoDelete(photo);
      }

    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      alert('Có lỗi xảy ra khi xóa ảnh. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Tất cả hình ảnh ({photoList.length})
            </h2>
            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {photoList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photoList.map((photo, index) => (
                <div 
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <Zoom>
                    <img
                      src={photo.url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                      onError={(e) => {
                        console.error('Lỗi tải ảnh:', photo.url);
                        e.target.src = '/placeholder-image.jpg';
                        e.target.classList.add('error-image');
                      }}
                      loading="lazy"
                    />
                  </Zoom>
                  
                  {/* Nút xóa */}
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200
                             hover:bg-red-600"
                    title="Xóa ảnh"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>

                  {/* Hiển thị ngày tải lên */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs">
                      {new Date(photo.uploadDate).toLocaleDateString('vi-VN')}
                    </p>
                    {photo.description && (
                      <p className="text-xs mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500">Chưa có hình ảnh nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPhotosModal;
