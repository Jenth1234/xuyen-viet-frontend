import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
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

  const isLoggedIn = () => !!localStorage.getItem('accessToken');

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
    <>
    
     <MapContainer className="map-container" center={[16, 109]} zoom={6} style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
  <TileLayer
    url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
    id="mapbox/streets-v11"
  />
  <GeoJSON data={vietnamData} style={style} onEachFeature={onEachFeature} />
</MapContainer>

{/* {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full z-60">
      <h2 className="text-xl font-semibold mb-4">Actions for {selectedProvince}</h2>
      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleUploadPhoto} className="w-full border p-2 rounded"/>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
        <button
          onClick={handleMistake}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Selected by Mistake
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)} */}

    </>
  );
};

export default Map;
