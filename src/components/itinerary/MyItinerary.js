import { getItineraryByUserId } from '../../api/callApi'; // Import hàm getItinerary
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const MyItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await getItineraryByUserId();
        console.log(response);

        // Đảm bảo response là một mảng các lịch trình
        if (Array.isArray(response)) {
          setItineraries(response);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchItineraries();
  }, []);

  const handleEdit = (id) => {
    // Điều hướng đến trang chi tiết lộ trình
    navigate(`/itinerary/${id}`);
  };

  const handleDelete = (id) => {
    // Xử lý hành động xóa
    console.log('Delete:', id);
    // Cập nhật state để xóa item khỏi danh sách
    setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Lịch Trình Của Bạn nè</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4">
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} className="w-60 p-4 flex-shrink-0 relative">
              <div className="border rounded-lg p-4 bg-white shadow">
                <h3 className="text-xl font-bold mb-2 flex justify-between items-center">
                  {itinerary.NAME}
                  <button 
                    onClick={() => setShowOptions(showOptions === itinerary._id ? null : itinerary._id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} className="h-6 w-6" />
                  </button>
                </h3>
                <p><strong>Ngày đi:</strong> {new Date(itinerary.START_DATE).toLocaleDateString()}</p>
                <p><strong>Ngày về:</strong> {new Date(itinerary.END_DATE).toLocaleDateString()}</p>
                {showOptions === itinerary._id && (
                  <div className="absolute top-0 right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <ul>
                      <li>
                        <button 
                          onClick={() => handleEdit(itinerary._id)} 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Sửa
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => handleDelete(itinerary._id)} 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Xóa
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyItinerary;
