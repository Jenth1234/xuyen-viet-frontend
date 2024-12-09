import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShareableItems, copyItinerary } from '../../api/ApiItinerary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faCopy, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

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
        if (response.success && response.data.success) {
          setHighlightItems(response.data.data || []);
        } else {
          throw new Error(response.message || 'Không thể tải dữ liệu');
        }
      } catch (error) {
        console.error('Error fetching highlight items:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightItems();
  }, []);

  const handleCopy = async (itineraryId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để sao chép lịch trình');
        navigate('/login');
        return;
      }

      const response = await copyItinerary(itineraryId);
      if (response.success) {
        toast.success(
          <div className="flex flex-col">
            <span>Đã sao chép lịch trình thành công!</span>
            <span className="text-sm text-gray-600">
              Bạn có thể xem trong phần "Lịch trình của tôi"
            </span>
          </div>,
          {
            duration: 4000,
            style: {
              minWidth: '300px',
            },
          }
        );
      }
    } catch (error) {
      console.error('Error copying itinerary:', error);
      toast.error(
        error.message || 'Không thể sao chép lịch trình',
        { duration: 3000 }
      );
    }
  };

  const handleViewDetails = (item) => {
    navigate(`/shared-itinerary/${item._id}`, {
      state: { 
        viewOnly: true,
        itineraryData: item 
      }
    });
  };

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
        {error.message || 'Có lỗi xảy ra khi tải dữ liệu.'}
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
                  src={item.USERID.AVATAR || "https://via.placeholder.com/400x300"}
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
                <div className="flex items-center space-x-2 mb-3">
                  <img
                    src={item.USERID.AVATAR}
                    alt={item.USERID.USERNAME}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    {item.USERID.FULLNAME}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(item.START_DATE).toLocaleDateString('vi-VN')} - 
                    {new Date(item.END_DATE).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t flex gap-2">
                  {/* <button
                    onClick={() => handleViewDetails(item)}
                    className="flex-1 py-2 text-green-600 hover:text-green-700 
                      text-sm font-medium transition-colors border border-green-600 
                      rounded-lg hover:bg-green-50 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                 
                  </button> */}
                  
                  {!item.isOwner && (
                    <button
                      onClick={() => handleCopy(item._id)}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 
                        text-sm font-medium transition-colors border border-blue-600 
                        rounded-lg hover:bg-blue-50 flex items-center justify-center"
                      title="Sao chép lịch trình này"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  )}
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