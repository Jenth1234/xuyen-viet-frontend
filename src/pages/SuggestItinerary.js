import React, { useState } from 'react';
import { searchByCategory } from '../api/ApiAttraction';
import { useNavigate,useLocation  } from 'react-router-dom';
import ProgressBar from '../components/itinerary/ProgressBar'
const SuggestItinerary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const navigate = useNavigate();


  const getCurrentStep = (pathname) => {
    switch (pathname) {
      case '/suggest-itinerary':
        return 1;
      case '/suggest-place':
        return 2;
      case '/create-itinerary':
        return 3;
      default:
        return 4; // Mặc định là bước 4 cho trang chi tiết lịch trình
    }
  };
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);
  const handleSearchChange = async (event) => {
    const query = event.target.value.toUpperCase();
    setSearchTerm(query);

    if (query) {
      try {
        const results = await searchByCategory(query);
        if (results && results.data.length > 0) {
          setFilteredProvinces(results.data);
        } else {
          setFilteredProvinces([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setFilteredProvinces([]);
    }
  };

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setFilteredProvinces([]);
    setSearchTerm(province.name); // Sửa từ province.attractionName thành province.name
  };

  const handlePlaceToggle = (place) => {
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.includes(place.name)
        ? prevSelectedPlaces.filter((item) => item !== place.name)
        : [...prevSelectedPlaces, place.name]
    );
  };
  const handleNavigate = () => {
    console.log('Selected Province:', selectedProvince); // Để debug
    if (selectedProvince) {
      navigate('/suggest-place', { 
        state: { 
          province: selectedProvince,  
          provinceName: selectedProvince.name,
          provinceId: selectedProvince.id 
        } 
      });
    } else {
      alert('Vui lòng chọn một địa điểm trước khi tiếp tục.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-xl mx-auto relative">
        <ProgressBar currentStep={1} />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Tìm kiếm điểm đến
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá điểm đến tiếp theo của bạn. Nhập tên tỉnh, địa điểm hoặc loại hình du lịch bạn muốn.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm (ví dụ: Đà Lạt, biển, núi...)"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
          />
          <svg 
            className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {filteredProvinces.length > 0 && !selectedProvince && (
          <div className="mt-6 bg-white rounded-xl shadow-lg max-h-[60vh] overflow-y-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredProvinces.map((province) => (
                <li
                  key={province.id}
                  className="group p-4 rounded-xl hover:bg-blue-50 cursor-pointer transition-all transform hover:scale-105 border border-gray-100 hover:border-blue-200"
                  onClick={() => handleProvinceSelect(province)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={province.background}
                        alt={province.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                        {province.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {province.region ? `Khu vực ${province.region}` : 'Khám phá ngay'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {province.description || 'Du lịch - Khám phá - Trải nghiệm'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedProvince && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={selectedProvince.background}
                    alt={selectedProvince.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedProvince.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {selectedProvince.region ? `Khu vực ${selectedProvince.region}` : ''}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {selectedProvince.description || 'Khám phá vẻ đẹp và văn hóa độc đáo của địa phương'}
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Các địa điểm nổi bật
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedProvince.places || {}).map(([category, places]) => (
                    places && places.length > 0 && (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-700 capitalize mb-2">
                          {category}
                        </h4>
                        <ul className="space-y-2">
                          {places.map((place, index) => (
                            <li 
                              key={index}
                              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                              onClick={() => handlePlaceToggle(place)}
                            >
                              <span className={`w-2 h-2 rounded-full ${selectedPlaces.includes(place.name) ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                              <span>{place.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPlaces.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Địa điểm đã chọn
            </h3>
            <div className="flex flex-wrap gap-3">
              {selectedPlaces.map((place, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <button
            className={`px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg 
                       hover:bg-blue-700 transform hover:scale-105 transition-all 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       ${!selectedProvince && 'opacity-50 cursor-not-allowed'}`}
            onClick={handleNavigate}
            disabled={!selectedProvince}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestItinerary;