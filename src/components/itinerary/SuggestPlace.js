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
  const { province } = location.state || {}; 

  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (province) {
          const result = await getAttractionByName(province.attractionName);
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
    navigate('/create-itinerary', { 
      state: { 
        selectedPlaces: Array.from(selectedPlaces),
        provinceName: province.attractionName,
        coordinates: province.URLADDRESS
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
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} />
      
      {/* Hero Section */}
      <div className="relative h-[300px] mb-8">
        <img 
          src={province?.backgroundImage} 
          alt={province?.attractionName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">{province?.attractionName}</h1>
          <p className="text-xl text-gray-200">Chọn những địa điểm bạn muốn khám phá</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Places Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place, index) => {
                const averageRating = calculateAverageRating(place.REVIEWS);
                return (
                  <div 
                    key={index}
                    onClick={() => handlePlaceSelect(place)}
                    className={`
                      group relative overflow-hidden rounded-xl shadow-md transition-all duration-300
                      ${selectedPlaces.has(place._id) 
                        ? 'ring-2 ring-indigo-500 transform scale-[1.02]' 
                        : 'hover:shadow-xl hover:scale-[1.01]'
                      }
                    `}
                  >
                    {/* Image Container */}
                    <div className="relative h-48">
                      <img 
                        src={place.IMAGES.NORMAL[0]} 
                        alt={place.NAME}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Selection Indicator */}
                      {selectedPlaces.has(place._id) && (
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{place.NAME}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {place.DESCRIPTIONPLACE}
                      </p>

                      {/* Rating */}
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
                          ({place.REVIEWS.length} đánh giá)
                        </span>
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
                  px-6 py-3 rounded-full font-medium text-white shadow-lg
                  transition-all duration-300 transform hover:scale-105
                  ${selectedPlaces.size === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25'
                  }
                `}
              >
                Chọn {selectedPlaces.size} địa điểm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuggestPlace;
