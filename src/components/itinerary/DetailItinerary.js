// src/pages/DetailPage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';

const provinces = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  // Thêm các tỉnh thành khác vào đây
].map(province => ({ value: province, label: province }));

const DetailPage = () => {
  const location = useLocation();
  const { state } = location;
  const { days = 'Không có thông tin', activities = [] } = state || {};
  
  // Convert days to a number
  const numberOfDays = parseInt(days, 30);
  
  // State to manage activities and selected provinces for each day
  const [activitiesState, setActivitiesState] = useState(activities);
  const [selectedProvinces, setSelectedProvinces] = useState(
    Array.from({ length: Math.min(numberOfDays, 30) }, () => provinces[0])
  );

  // Function to handle adding a new activity
  const handleAddActivity = (dayIndex) => {
    const newActivity = prompt("Nhập hoạt động mới:");
    if (newActivity && selectedProvinces[dayIndex]) {
      const updatedActivities = [...activitiesState];
      if (!updatedActivities[dayIndex]) {
        updatedActivities[dayIndex] = [];
      }
      updatedActivities[dayIndex].push({
        activity: newActivity,
        province: selectedProvinces[dayIndex].value
      });
      setActivitiesState(updatedActivities);
    } else {
      alert("Vui lòng chọn tỉnh thành.");
    }
  };

  // Handle province change
  const handleProvinceChange = (dayIndex, selectedOption) => {
    const updatedProvinces = [...selectedProvinces];
    updatedProvinces[dayIndex] = selectedOption;
    setSelectedProvinces(updatedProvinces);
  };

  return (
    <div className="flex flex-col min-h-screen mr-60 ml-60">
      <nav className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl">Chi Tiết Lịch Trình</h1>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Chi Tiết Chuyến Đi</h1>

        <div className="mb-8 p-6 border rounded shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4">Thông Tin Lịch Trình</h2>
          <p className="mb-4">Số ngày chuyến đi: {days} ngày</p>

          {numberOfDays > 0 ? (
            Array.from({ length: Math.min(numberOfDays, 4) }).map((_, dayIndex) => (
              <div key={dayIndex} className="mb-4">
                <h3 className="text-xl mb-2">Ngày {dayIndex + 1}</h3>
                <ul>
                  {activitiesState[dayIndex] && activitiesState[dayIndex].length > 0 ? (
                    activitiesState[dayIndex].map((activityObj, activityIndex) => (
                      <li key={activityIndex} className="mb-1">
                        - {activityObj.activity} (Tỉnh thành: {activityObj.province})
                      </li>
                    ))
                  ) : (
                    <li>Không có thông tin hoạt động cho ngày này.</li>
                  )}
                </ul>
                <div className="mb-4">
                  <label htmlFor={`province-select-${dayIndex}`} className="block text-sm font-medium text-gray-700">
                    Chọn tỉnh thành:
                  </label>
                  <Select
                    id={`province-select-${dayIndex}`}
                    value={selectedProvinces[dayIndex]}
                    onChange={(selectedOption) => handleProvinceChange(dayIndex, selectedOption)}
                    options={provinces}
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
                <button 
                  onClick={() => handleAddActivity(dayIndex)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Thêm hoạt động
                </button>
              </div>
            ))
          ) : (
            <p>Không có thông tin hoạt động.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DetailPage;
