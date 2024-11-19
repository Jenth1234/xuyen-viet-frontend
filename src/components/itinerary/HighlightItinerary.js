import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShareableItems } from '../../api/ApiItinerary';

const HighlightItinerary = () => {
  const [highlightItems, setHighlightItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighlightItems = async () => {
      try {
        setLoading(true);
        const response = await getShareableItems();
        // Lấy mảng items từ response
        setHighlightItems(response.items || []);
      } catch (error) {
        console.error('Error fetching highlight items:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightItems();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Lịch Trình Nổi Bật
      </h2>

      {highlightItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt={item.NAME}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {item.NAME}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    {new Date(item.START_DATE).toLocaleDateString('vi-VN')} - {new Date(item.END_DATE).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {item.DAYS.length} ngày
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/itinerary/${item._id}`)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Chưa có lịch trình nổi bật nào.
        </div>
      )}
    </div>
  );
};

export default HighlightItinerary;