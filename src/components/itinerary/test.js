import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import ActivityModal from "./modal/ActivityModal";
import { getItinerary } from "../../api/callApi";
import bgItinerary from "../../style/img/lienkhuong2.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faDollarSign, faEdit, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const provinces = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  // Thêm các tỉnh thành khác vào đây
].map((province) => ({ value: province, label: province }));

const DetailPage = () => {
  const { itineraryId } = useParams();
  const location = useLocation();
  const { state } = location;
  const [activitiesState, setActivitiesState] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allActivities, setAllActivities] = useState({});
  const [totalCost, setTotalCost] = useState("0");
  const dayRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItinerary(itineraryId);
        console.log("Response từ API:", response);

        if (response) {
          setItinerary(response);
          const daysData = response.DAYS || [];
          const activitiesData = response.ACTIVITIES || [];

          const activitiesMap = activitiesData.reduce((map, activity) => {
            map[activity._id] = activity;
            return map;
          }, {});

          const activitiesByDay = daysData.map((day) =>
            (day.ACTIVITIES || []).map((id) => activitiesMap[id] || {})
          );

          setActivitiesState(activitiesByDay);
          setSelectedProvinces(
            response.selectedProvinces ||
              Array.from({ length: daysData.length }, () => provinces[0])
          );
          setStartDate(response.START_DATE);
          setEndDate(response.END_DATE);
          setAllActivities(activitiesMap);
        } else {
          console.error("Không tìm thấy dữ liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, [itineraryId]);

  const calculateTotalCost = () => {
    let totalCost = 0;

    activitiesState.forEach((dayActivities) => {
      dayActivities.forEach((activity) => {
        totalCost += parseFloat(activity.COST) || 0;
      });
    });

    return totalCost.toLocaleString(); // Định dạng số tiền
  };

  useEffect(() => {
    // Cập nhật tổng chi phí khi activitiesState thay đổi
    setTotalCost(calculateTotalCost());
  }, [activitiesState]);

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
    setSelectedProvinces((prevProvinces) => {
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
  setActivitiesState((prevState) => {
      const updatedActivities = [...prevState];
      if (!updatedActivities[currentDayIndex]) {
          updatedActivities[currentDayIndex] = [];
      }
      updatedActivities[currentDayIndex].push(newActivity);
      return updatedActivities;
  });
  closeModal();
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleScrollToDay = (index) => {
    if (dayRefs.current[index]) {
      dayRefs.current[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEditClick = () => {
    alert('Chỉnh sửa hành trình');
  };

  return (
    <div className="max-w-7xl mx-auto mt-24 flex">
      {/* Sidebar/Aside */}
      <aside className="w-1/5 p-6 bg-gray-100 text-white rounded-lg shadow-lg sticky top-20">
        <h2 className="text-xl font-semibold mb-4 text-black flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-black" />
          Tóm tắt hành trình
        </h2>
        <ul className="space-y-2">
          {dateRange.map((date, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 text-black hover:text-blue-300 transition-colors flex items-center"
              onClick={() => handleScrollToDay(index)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-black" />
              Ngày {index + 1}: {date.toDateString()}
            </li>
          ))}
        </ul>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-black flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-black" />
            Tổng chi phí:
          </h3>
          <p className="text-xl font-bold text-black">{totalCost} VND</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 relative">
        <div className="relative w-full h-96">
          <img
            src={bgItinerary}
            alt="Nền"
            className="w-full h-4/5 object-cover"
          />
          <div className="absolute bottom-0 left-1/2 w-2/3 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transform -translate-x-1/2 border border-gray-300">
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Hành Trình: {itinerary.NAME || "Chưa có tên"}
            </h1>
            <p className="text-lg mb-2">
              <strong>Số ngày:</strong> {itinerary.DAYS?.length || "Không có thông tin"}
            </p>
            <p className="text-lg mb-4">
              <strong>Ngày bắt đầu:</strong> {startDate ? new Date(startDate).toLocaleDateString() : "Chưa xác định"}
              <br />
              <strong>Ngày kết thúc:</strong> {endDate ? new Date(endDate).toLocaleDateString() : "Chưa xác định"}
            </p>
            <button
              onClick={handleEditClick}
              className="absolute bottom-4 right-4 py-2 px-2 bg-gray-600 text-white rounded-lg shadow-md flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Chỉnh sửa
            </button>
          </div>
        </div>

        {dateRange.map((date, dayIndex) => (
          <div
            key={dayIndex}
            ref={(el) => (dayRefs.current[dayIndex] = el)}
            className="day-section mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Ngày {dayIndex + 1}: {date.toDateString()}
            </h2>

            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Chọn tỉnh:</label>
              <Select
                value={selectedProvinces[dayIndex]}
                onChange={(selectedOption) =>
                  handleProvinceChange(dayIndex, selectedOption)
                }
                options={provinces}
                className="w-full max-w-md"
              />
            </div>

            <div className="activities">
              <h3 className="text-xl font-medium mb-2">Hoạt động:</h3>
              {activitiesState[dayIndex] && activitiesState[dayIndex].length > 0 ? (
                <div className="space-y-4">
                  {activitiesState[dayIndex].map((activity, idx) => (
                    <div
                      key={activity._id || idx}
                      className="p-4 bg-gray-100 shadow-xl rounded-md flex relative"
                    >
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{activity.NAME}</h4>
                        <p>{activity.DESCRIPTION}</p>
                        <p className="font-bold">{activity.COST} VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có hoạt động nào cho ngày này.</p>
              )}
              <button
                onClick={() => handleAddActivity(dayIndex)}
                className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md"
              >
                Thêm hoạt động
              </button>
            </div>
          </div>
        ))}

{isModalOpen && (
    <ActivityModal
        onSave={handleSaveActivity}
        onClose={closeModal}
        allActivities={allActivities}
    />
)}
      </div>
    </div>
  );
};

export default DetailPage;
