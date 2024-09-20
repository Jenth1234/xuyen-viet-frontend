import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Select from 'react-select';
import ActivityModal from './modal/ActivityModal';
import { getItinerary } from '../../api/callApi';

const provinces = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  // Thêm các tỉnh thành khác vào đây
].map(province => ({ value: province, label: province }));

const DetailPage = () => {
  const { itineraryId } = useParams();
  const location = useLocation();
  const { state } = location;
  const [activitiesState, setActivitiesState] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItinerary(itineraryId);
        console.log("Response từ API:", response);  // Kiểm tra toàn bộ phản hồi API

        if (response) {
          setItinerary(response);
          const daysData = response.DAYS || [];
          setActivitiesState(daysData.map(day => day.ACTIVITIES || []));
          setSelectedProvinces(response.selectedProvinces || Array.from({ length: response.days }, () => provinces[0]));
          // Cập nhật startDate và endDate từ API
          setStartDate(response.START_DATE);
          setEndDate(response.END_DATE);
        } else {
          console.error("Không tìm thấy dữ liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, [itineraryId]);

  const calculateDateRange = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const dateRange = calculateDateRange(startDate, endDate);

  const handleProvinceChange = (dayIndex, selectedOption) => {
    setSelectedProvinces(prevProvinces => {
      const updatedProvinces = [...prevProvinces];
      updatedProvinces[dayIndex] = selectedOption;
      return updatedProvinces;
    });
  };

  const handleAddActivity = (dayIndex) => {
    setCurrentDayIndex(dayIndex);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (newActivity) => {
    setActivitiesState(prevActivities => {
      const updatedActivities = [...prevActivities];
      if (!updatedActivities[currentDayIndex]) {
        updatedActivities[currentDayIndex] = [];
      }
      updatedActivities[currentDayIndex].push(newActivity);
      return updatedActivities;
    });
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto mt-32 p-4">
      <h1 className="text-3xl font-bold mb-6">Chi tiết hành trình</h1>
      <div className="itinerary-details mb-8">
        <h1>Chi tiết hành trình: {itinerary.NAME}</h1>
        <h2 className="text-2xl font-semibold">Thông tin hành trình</h2>
        <p><strong>Số ngày:</strong> {itinerary.days || 'Không có thông tin'}</p>
        <p><strong>Ngày bắt đầu:</strong> {startDate ? new Date(startDate).toLocaleDateString() : 'Chưa xác định'}</p>
        <p><strong>Ngày kết thúc:</strong> {endDate ? new Date(endDate).toLocaleDateString() : 'Chưa xác định'}</p>
      </div>
      {dateRange.map((date, dayIndex) => (
        <div key={dayIndex} className="day-section mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Ngày {dayIndex + 1}: {date.toDateString()}
          </h2>
{/* 
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Chọn tỉnh:</label>
            <Select
              value={selectedProvinces[dayIndex]}
              onChange={(selectedOption) => handleProvinceChange(dayIndex, selectedOption)}
              options={provinces}
              className="w-full max-w-md"
            />
          </div> */}

          <div className="activities">
            <h3 className="text-xl font-medium mb-2">Hoạt động:</h3>
            {activitiesState[dayIndex] && activitiesState[dayIndex].length > 0 ? (
              <ul className="list-disc pl-5">
                {activitiesState[dayIndex].map((activity, idx) => (
                  <li key={idx} className="mb-1">
                    {activity.DESCRIPTION} - {activity.LOCATION} - {activity.COST} VND
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Chưa có hoạt động nào.</p>
            )}
          </div>

          <button
            onClick={() => handleAddActivity(dayIndex)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Thêm hoạt động
          </button>
        </div>
      ))}

      {isModalOpen && (
        <ActivityModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onSave={handleSaveActivity}
          date={dateRange[currentDayIndex]}
        />
      )}
    </div>
  );
};

export default DetailPage;
