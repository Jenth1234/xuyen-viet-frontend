import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAttractionByName } from '../../api/ApiAttraction';
import ProgressBar from './ProgressBar'; // Assuming you have a ProgressBar component

const getCurrentStep = (pathname) => {
  switch (pathname) {
    case '/suggest-itinerary':
      return 1;
    case '/suggest-place':
      return 2;
    case '/create-itinerary':
      return 3;
    default:
      return 4; // Default step for itinerary details page
  }
};

const SuggestPlace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = getCurrentStep(location.pathname);
  const { province, provinceName } = location.state || {};
  console.log('Received Province:', province);
  console.log('Province Name:', provinceName);

  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (province) {
          const result = await getAttractionByName(provinceName);
          const allPlaces = [
            ...result.data[0].CAFES,
            ...result.data[0].HOTELS,
            ...result.data[0].MOUNTAINS,
            ...result.data[0].BEACHES,
            ...result.data[0].ATTRACTIONS,
            ...result.data[0].FESTIVAL,
            ...result.data[0].CULTURAL
          ];
          setPlaces(allPlaces);
        }
      } catch (error) {
        setError('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    if (province) fetchData();
  }, [province]);

  const handlePlaceSelect = (place) => {
    setSelectedPlaces((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(place._id)) {
        newSelected.delete(place._id);
      } else {
        newSelected.add(place._id);
      }
      return newSelected;
    });
  };

  const handleSubmit = () => {
    // Lấy thông tin chi tiết của các địa điểm được chọn
    const selectedPlacesDetails = Array.from(selectedPlaces).map(placeId => {
      const place = places.find(p => p._id === placeId);
      return {
        id: place._id,
        name: place.NAME,
        description: place.DESCRIPTIONPLACE,
        images: place.IMAGES,
        coordinates: place.URLADDRESS,
        reviews: place.REVIEWS
      };
    });
  
    // Log để kiểm tra dữ liệu trước khi gửi
    console.log('About to send:', {
      selectedPlaces: selectedPlacesDetails,
      provinceName: province.name // Gửi toàn bộ object province
    });
  
    navigate('/create-itinerary', { 
      state: { 
        selectedPlaces: selectedPlacesDetails,
        provinceName: province.name, // Gửi toàn bộ object province
        province: province // Để đảm bảo có đủ dữ liệu
      } 
    });
  };

  // Calculate average rating for a place
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!province) {
    return <div>Không có thông tin tỉnh thành.</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <ProgressBar currentStep={currentStep} />
      
      {/* Hero Section */}
      <div className="relative h-[400px] mb-12 group">
        <img 
          src={province?.background} 
          alt={province?.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-landscape.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">{province?.name}</h1>
          <p className="text-xl text-gray-200 max-w-2xl text-center">
            Khám phá và lựa chọn những địa điểm tuyệt vời tại {province?.name}
          </p>
          {province?.region && (
            <div className="mt-4 flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>Khu vực {province?.region}</span>
            </div>
          )}
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-gray-600">Đang tải địa điểm...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-2xl shadow-sm">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {/* Filter/Sort Options */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {places.length} địa điểm để khám phá
              </h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500">
                  <option>Sắp xếp theo đánh giá</option>
                  <option>Mới nhất</option>
                  <option>Phổ biến nhất</option>
                </select>
              </div>
            </div>
  
            {/* Places Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {places.map((place, index) => {
                const averageRating = calculateAverageRating(place.REVIEWS);
                return (
                  <div 
                    key={index}
                    onClick={() => handlePlaceSelect(place)}
                    className={`
                      group relative bg-white rounded-2xl shadow-lg overflow-hidden
                      transition-all duration-300 hover:shadow-xl
                      ${selectedPlaces.has(place._id) 
                        ? 'ring-2 ring-indigo-500 transform scale-[1.02]' 
                        : 'hover:scale-[1.01]'
                      }
                    `}
                  >
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={place.IMAGES.NORMAL[0]} 
                        alt={place.NAME}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Selection Indicator */}
                      {selectedPlaces.has(place._id) && (
                        <div className="absolute top-3 right-3 bg-indigo-500 text-white p-2 rounded-full shadow-lg">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
  
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{place.NAME}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {place.DESCRIPTIONPLACE}
                      </p>
  
                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({place.REVIEWS.length})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
  
            {/* Submit Button */}
            <div className="fixed bottom-8 right-8">
              <button
                onClick={handleSubmit}
                disabled={selectedPlaces.size === 0}
                className={`
                  px-8 py-4 rounded-xl font-medium text-white shadow-xl
                  transition-all duration-300 transform hover:scale-105
                  ${selectedPlaces.size === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <span>Tiếp tục với {selectedPlaces.size} địa điểm</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuggestPlace;
