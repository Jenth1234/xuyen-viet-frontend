import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  ZoomControl,
  ScaleControl 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import vietnamData from '../province/diaphantinh.json';
import { saveProvince, getProvince, updateProvinceStatus } from '../../api/callApi';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faCompass, 
  faCircleInfo,
  faSpinner,
  faUpload,
  faTimes,
  faCheck,
  faArrowLeft,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

const accessToken = 'pk.eyJ1IjoidGhvbmdqMjMwMiIsImEiOiJjbHlxdzk2YTQwMGVxMmtzNnExcnRxcnJvIn0.Wysl-OPdOW5GPg7B8LBgfw';

// Mảng màu đẹm hơn cho tỉnh đã đến
const VISITED_COLORS = [
  '#FF6B6B', // Đỏ đậm
  '#4ECDC4', // Xanh ngọc đậm
  '#45B7D1', // Xanh dương đậm
  '#96CEB4', // Xanh lá đậm
  '#FF9F1C', // Cam đậm
  '#9B5DE5', // Tím đậm
  '#F15BB5', // Hồng đậm
  '#00BBF9', // Xanh biển đậm
  '#00F5D4', // Xanh mint đậm
  '#FEE440', // Vàng đậm
  '#FF85A1', // Hồng san hô
  '#7209B7', // Tím đậm
  '#FF7F50', // San hô đậm
  '#4CAF50', // Xanh lục đậm
  '#FB5607', // Cam đỏ
  '#3A86FF', // Xanh dương royal
  '#8338EC', // Tím hoàng gia
  '#F15BB5'  // Hồng fuchsia
];

const Map = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceStatus, setProvinceStatus] = useState({});
  const [provinceColors, setProvinceColors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null); // 'upload', 'unmark', hoặc 'initial'
  const [notification, setNotification] = useState({
    show: false,
    province: null,
    type: null // 'initial', 'upload', 'unmark'
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        const status = {};
        const colors = {};
        
        data.visitedProvinces.forEach((province, index) => {
          status[province.PROVINCE] = province.STATUS;
          if (province.STATUS) {
            // Gán màu ngẫu nhiên cho tỉnh đã đến
            colors[province.PROVINCE] = VISITED_COLORS[Math.floor(Math.random() * VISITED_COLORS.length)];
          }
        });
        
        setProvinceStatus(status);
        setProvinceColors(colors);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const style = (feature) => {
    const provinceName = feature.properties.ten_tinh;
    const isVisited = provinceStatus[provinceName];
    
    return {
      fillColor: isVisited ? provinceColors[provinceName] : '#F1F0E8',
      weight: 1.2,
      opacity: 1,
      color: '#7C9D96',
      fillOpacity: isVisited ? 0.65 : 0.45,
      className: 'province-path',
    };
  };

  const isLoggedIn = () => !!localStorage.getItem('token');

  const onEachFeature = (feature, layer) => {
    const province = feature.properties.ten_tinh;

    layer.on({
      click: async () => {
        if (!isLoggedIn()) {
          alert('Bạn cần đăng nhập trước khi lưu tỉnh.');
          navigate('/login');
          return;
        }

        setSelectedProvince(province);
        setNotification({
          show: true,
          province: province,
          type: 'initial'
        });
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.bindTooltip(province, { permanent: false, direction: 'center' }).openTooltip();
      },
      mouseout: (e) => {
        e.target.closeTooltip();
      }
    });
  };

  const handleUploadPhoto = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleMistake = () => {
    setProvinceStatus(prevStatus => ({
      ...prevStatus,
      [selectedProvince]: false,
    }));
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (photo) {
      console.log('Uploading photo:', photo);
      // Add your photo upload logic here
    }
    setShowModal(false);
  };

  // Hàm xử lý cập nhật trạng thái tỉnh
  const handleUpdateProvinceStatus = async (province, newStatus) => {
    setIsLoading(true);
    try {
      await updateProvinceStatus(province);
      
      // Cập nhật UI
      setProvinceStatus(prevStatus => ({
        ...prevStatus,
        [province]: newStatus
      }));
      
      if (!newStatus) {
        // Xóa màu nếu hủy đánh dấu
        setProvinceColors(prev => {
          const newColors = { ...prev };
          delete newColors[province];
          return newColors;
        });
      }
      
      // Thng báo thành công
      alert(
        newStatus 
          ? `Đã thêm ${province} vào danh sách đã đến` 
          : `Đã hủy đánh dấu tỉnh ${province}`
      );
      
    } catch (error) {
      console.error('Error updating province status:', error);
      alert(error.message || 'Không thể cập nhật trạng thái tỉnh');
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  // Hàm xử lý đóng modal và reset state
  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setPhoto(null); // Reset photo state khi đóng modal
  };

  return (
    <div className="relative">
      <style>
        {`
          .leaflet-container {
            background: #f8f9fa;
          }

          .leaflet-tile-container {
            filter: saturate(1) brightness(1);
          }

          .leaflet-tile-loaded {
            filter: none;
          }

          .leaflet-control {
            box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
          }

          .province-path {
            transition: all 0.2s ease-out;
            cursor: pointer;
          }
          
          .province-path:hover {
            filter: brightness(1.15) saturate(1.2);
            transform: translateY(-1px) scale(1.01);
            transition: all 0.2s ease-out;
            stroke-width: 2;
            stroke: #4a6741;
            z-index: 1000 !important;
          }

          .province-path:active {
            transform: translateY(0) scale(1);
            transition: all 0.1s ease-out;
          }

          .map-container {
            filter: contrast(1.05);
          }

          /* Tooltip style */
          .leaflet-tooltip {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #7C9D96;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <MapContainer 
          className="map-container z-20" 
          center={[16, 109]} 
          zoom={6} 
          style={{ 
            height: 'calc(100vh - 100px)', 
            width: '100%',
            borderRadius: '1rem'
          }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            attribution='&copy; CartoDB'
            opacity={1}
          />
          
          <GeoJSON 
            data={vietnamData} 
            style={style} 
            onEachFeature={onEachFeature}
          />

          <ZoomControl position="bottomright" />
          <ScaleControl position="bottomleft" />
  
          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 
            rounded-xl shadow-md z-[1000] border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <FontAwesomeIcon icon={faCompass} className="text-[#7C9D96]" />
              <h3 className="font-semibold text-gray-700">Chú thích bản đồ</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg" 
                  style={{ backgroundColor: '#9ED2BE' }}></div>
                <span className="text-sm text-gray-600">Đã khám phá</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg" 
                  style={{ backgroundColor: '#F1F0E8' }}></div>
                <span className="text-sm text-gray-600">Chưa khám phá</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
  
      {/* Province Info */}
      {selectedProvince && (
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 
          rounded-xl shadow-md z-[1000] max-w-xs border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-[#9ED2BE]/20">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#7C9D96]" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {selectedProvince}
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2 text-[#7C9D96]" />
            Click để đánh dấu đã đến
          </div>
        </div>
      )}
  
      {/* Notification nổi */}
      {notification.show && (
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-4 
          rounded-xl shadow-lg z-[1000] w-80 border border-gray-100 transition-all duration-300">
          
          {notification.type === 'initial' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  {notification.province}
                </h3>
                <button 
                  onClick={() => setNotification({ show: false, province: null, type: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Trạng thái */}
                <div className="text-sm">
                  {provinceStatus[notification.province] ? (
                    <p className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Đã ghé thăm
                    </p>
                  ) : (
                    <p className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Chưa ghé thăm
                    </p>
                  )}
                </div>

                {/* Các nút tác vụ */}
                <div className="space-y-2">
                  {/* Nút ghé thăm - chỉ hiển thị khi chưa ghé thăm */}
                  {!provinceStatus[notification.province] && (
                    <button
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          await saveProvince(notification.province, true);
                          // Gán màu ngẫu nhiên cho tỉnh mới
                          const newColor = VISITED_COLORS[Math.floor(Math.random() * VISITED_COLORS.length)];
                          setProvinceColors(prev => ({
                            ...prev,
                            [notification.province]: newColor
                          }));
                          setProvinceStatus(prev => ({
                            ...prev,
                            [notification.province]: true
                          }));
                          alert(`Đã đánh dấu ghé thăm ${notification.province}`);
                        } catch (error) {
                          console.error('Error marking province:', error);
                          alert(error.message || 'Không thể đánh dấu tỉnh');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                      <span>Đánh dấu ghé thăm</span>
                    </button>
                  )}

                  {/* Nút upload ảnh */}
                  <button
                    onClick={() => setNotification(prev => ({ ...prev, type: 'upload' }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#7C9D96] text-white hover:bg-[#6b8c89] text-sm flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faUpload} className="text-xs" />
                    <span>Tải lên hình ảnh</span>
                  </button>

                  {/* Nút hủy ghé thăm - chỉ hiển thị khi đã ghé thăm */}
                  {provinceStatus[notification.province] && (
                    <button
                      onClick={() => setNotification(prev => ({ ...prev, type: 'unmark' }))}
                      className="w-full px-3 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 text-sm flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      <span>Hủy ghé thăm</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {notification.type === 'upload' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Tải ảnh - {notification.province}
                </h3>
                <button 
                  onClick={() => setNotification(prev => ({ ...prev, type: 'initial' }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  onChange={handleUploadPhoto}
                  accept="image/*"
                  className="w-full text-sm border rounded-lg p-2"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!photo}
                  className="w-full px-3 py-2 rounded-lg bg-[#7C9D96] text-white hover:bg-[#6b8c89] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Xác nhận
                </button>
              </div>
            </>
          )}

          {notification.type === 'unmark' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-red-600">
                  Hủy ghé thăm
                </h3>
                <button 
                  onClick={() => setNotification(prev => ({ ...prev, type: 'initial' }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Bạn có chắc muốn hủy đánh dấu đã ghé thăm tỉnh {notification.province}?
                </p>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await updateProvinceStatus(notification.province);
                      setProvinceStatus(prev => ({
                        ...prev,
                        [notification.province]: false
                      }));
                      setProvinceColors(prev => {
                        const newColors = { ...prev };
                        delete newColors[notification.province];
                        return newColors;
                      });
                      setNotification({ show: false, province: null, type: null });
                      alert(`Đã hủy đánh dấu tỉnh ${notification.province}`);
                    } catch (error) {
                      console.error('Error unmarking province:', error);
                      alert(error.message || 'Không thể hủy đánh dấu tỉnh');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                >
                  Xác nhận hủy
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm 
          flex items-center justify-center z-[1001]">
          <div className="bg-white/90 p-6 rounded-2xl shadow-md flex items-center space-x-3">
            <FontAwesomeIcon icon={faSpinner} className="text-[#7C9D96] text-2xl animate-spin" />
            <span className="text-gray-700 font-medium">Đang tải...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
