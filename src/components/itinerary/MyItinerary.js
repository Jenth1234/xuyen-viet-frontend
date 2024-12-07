import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItineraryByUserId } from '../../api/callApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const MyItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        const response = await getItineraryByUserId();
        if (Array.isArray(response)) {
          setItineraries(response);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleEdit = (id) => {
    navigate(`/itinerary/${id}`);
    setShowOptions(null);
  };

  const handleDelete = (id) => {
    setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
    setShowOptions(null);
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch Trình Của Bạn</h2>

      {itineraries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Bạn chưa có lịch trình nào. Hãy tạo lịch trình đầu tiên!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{itinerary.NAME}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(showOptions === itinerary._id ? null : itinerary._id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} className="h-5 w-5 text-gray-500" />
                    </button>
                    {showOptions === itinerary._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                        <button onClick={() => handleEdit(itinerary._id)} className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50">Chỉnh sửa</button>
                        <button onClick={() => handleDelete(itinerary._id)} className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50">Xóa lịch trình</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
                    <span className="text-sm">{new Date(itinerary.START_DATE).toLocaleDateString('vi-VN')} - {new Date(itinerary.END_DATE).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2" />
                    <span className="text-sm">{Math.ceil((new Date(itinerary.END_DATE) - new Date(itinerary.START_DATE)) / (1000 * 60 * 60 * 24))} ngày</span>
                  </div>
                </div>

                <button onClick={() => handleEdit(itinerary._id)} className="mt-4 w-full py-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors text-center border border-green-600 rounded-lg hover:bg-green-50">Xem chi tiết →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItinerary;