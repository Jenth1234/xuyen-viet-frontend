import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  ZoomControl,
  ScaleControl 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import vietnamData from '../province/diaphantinh.json';
import { saveProvince, getProvince } from '../../api/callApi';
import { useNavigate } from 'react-router-dom';

const accessToken = 'pk.eyJ1IjoidGhvbmdqMjMwMiIsImEiOiJjbHlxdzk2YTQwMGVxMmtzNnExcnRxcnJvIn0.Wysl-OPdOW5GPg7B8LBgfw';

const Map = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceStatus, setProvinceStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        const status = data.visitedProvinces.reduce((acc, province) => {
          acc[province.PROVINCE] = province.STATUS;
          return acc;
        }, {});
        setProvinceStatus(status);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const style = (feature) => {
    const yellowColor = '#d4a8a2';
    const blueColor = '#add8e6';
    const provinceName = feature.properties.ten_tinh;
    const fillColor = provinceStatus[provinceName] ? yellowColor : blueColor;
    
    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
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
        setShowModal(true);

        try {
          await saveProvince(province, true);
          setProvinceStatus(prevStatus => ({
            ...prevStatus,
            [province]: true,
          }));
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
          alert('Lỗi khi lưu tỉnh. Vui lòng thử lại sau.');
        }
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
  return (
    <div className="relative">
      {/* Map Container with Enhanced Styling */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer 
          className="map-container z-20" 
          center={[16, 109]} 
          zoom={6} 
          style={{ 
            height: 'calc(100vh - 80px)', 
            width: '100%',
            borderRadius: '0.75rem'
          }}
          zoomControl={false}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
            id="mapbox/streets-v11"
          />
          
          <GeoJSON 
            data={vietnamData} 
            style={style} 
            onEachFeature={onEachFeature}
          />
  
          {/* Legend */}
          <div className="absolute bottom-5 right-5 bg-white p-4 rounded-lg shadow-md z-[1000]">
            <h3 className="font-semibold text-gray-700 mb-2">Chú thích</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">Đã đến</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span className="text-sm">Chưa đến</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
  
      {/* Province Info Overlay */}
      {selectedProvince && (
        <div className="absolute top-5 left-5 bg-white p-4 rounded-lg shadow-md z-[1000] max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-2">
            {selectedProvince}
          </h3>
          <div className="text-sm text-gray-600">
            Click để thêm vào danh sách đã đến
          </div>
        </div>
      )}
  
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1001]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
