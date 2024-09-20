import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import ActivityModal from "./modal/ActivityModal";
import UpdateActivity from "./modal/UpdateActivityModal";
import { getItinerary, updateActivity } from "../../api/callApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faInfoCircle , faCalendarAlt, faDollarSign, faEdit, faMapMarkerAlt, faGlassCheers, faClock } from "@fortawesome/free-solid-svg-icons";
import bgItinerary from "../../style/img/lienkhuong2.jpg";


const DetailPage = () => {
  const location = useLocation();
  const { itineraryId } = useParams();
  const { state } = location;

  const { activities = [], startDate: initialStartDate = "", endDate: initialEndDate = "" } = state || {};
  
  const [days, setDays] = useState(0);
  const [activitiesState, setActivitiesState] = useState(activities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const dayRefs = useRef([]);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [totalCost, setTotalCost] = useState("0");
  const [dateArray, setDateArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItinerary(itineraryId);
        if (response) {
          setItinerary(response);
          setStartDate(response.START_DATE);
          setEndDate(response.END_DATE);
          const daysData = response.DAYS || [];
          const activitiesData = response.ACTIVITIES || [];

          const activitiesMap = activitiesData.reduce((map, activity) => {
            map[activity._id] = activity;
            return map;
          }, {});

          const startDateObj = new Date(response.START_DATE);
          const endDateObj = new Date(response.END_DATE);
          const dayCount = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

          setDateArray(Array.from({ length: dayCount }, (_, index) => {
            const currentDate = new Date(startDateObj);
            currentDate.setDate(currentDate.getDate() + index);
            return currentDate.toISOString().split('T')[0];
          }));

          const activitiesByDay = daysData.map(day =>
            (day.ACTIVITIES || []).map(id => activitiesMap[id] || {})
          );

          setActivitiesState(activitiesByDay);
          setDays(dayCount);
          setTotalCost(calculateTotalCost(activitiesByDay));
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("API call error:", error);
      }
    };

    fetchData();
  }, [itineraryId]);

  const calculateTotalCost = (activitiesByDay) => {
    if (!Array.isArray(activitiesByDay)) return "0";
    const total = activitiesByDay.reduce((total, day) => {
      return total + (day.reduce(
        (dayTotal, activity) => dayTotal + (parseFloat(activity.COST) || 0),
        0
      ) || 0);
    }, 0);
    return total.toLocaleString();
  };

  const handleScrollToDay = (index) => {
    dayRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddActivity = (dayIndex) => {
    console.log("Opening modal for day:", dayIndex);
    setCurrentDayIndex(dayIndex);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (newActivity) => {
    setActivitiesState(prev => {
      const updatedActivities = [...prev];
      if (!updatedActivities[currentDayIndex]) {
        updatedActivities[currentDayIndex] = [];
      }
      updatedActivities[currentDayIndex].push(newActivity);
      setTotalCost(calculateTotalCost(updatedActivities)); // Cập nhật tổng chi phí
      return updatedActivities;
    });
    setIsModalOpen(false);
  };
  

  const closeModal = () => setIsModalOpen(false);

  const handleEditActivity = (activity) => {
    setCurrentActivity(activity);
    setIsEditing(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const updatedActivity = await updateActivity(currentActivity._id, updatedData);
      setActivitiesState(prev => {
        const updatedActivities = [...prev];
        const activityIndex = updatedActivities[currentDayIndex].findIndex(
          act => act._id === currentActivity._id
        );
        updatedActivities[currentDayIndex][activityIndex] = updatedActivity;
        setTotalCost(calculateTotalCost(updatedActivities)); // Cập nhật tổng chi phí
        return updatedActivities;
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };
  console.log(activities.NAME)
  return (
    <div className="max-w-7xl mx-auto mt-24 flex">
      <aside className="w-1/5 p-6 bg-gray-100 rounded-lg shadow-lg sticky top-20">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          Tóm tắt hành trình
        </h2>
        <ul className="space-y-2">
          {Array.from({ length: days }).map((_, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 text-black hover:text-blue-300 transition-colors flex items-center"
              onClick={() => handleScrollToDay(index)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Ngày {index + 1}
            </li>
          ))}
        </ul>
        <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-md border border-gray-600">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Tổng chi phí:
          </h3>
          <p className="text-xl font-bold">{totalCost} VND</p>
        </div>
      </aside>

      <div className="relative w-3/4">
        <div className="relative w-full h-96">
          <img src={bgItinerary} alt="Nền" className="w-full h-80 object-cover" />
          <div className="absolute bottom-0 left-1/2 w-2/3 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transform -translate-x-1/2 border border-gray-300">
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Hành Trình: {itinerary.NAME || "Chưa có tên"}
            </h1>
            <p className="text-lg mb-2"><strong>Số ngày:</strong> {days || "Không có thông tin"}</p>
            <p className="text-lg mb-4">
              <strong>Ngày bắt đầu:</strong> {startDate ? new Date(startDate).toLocaleDateString() : "Chưa xác định"}
              <br />
              <strong>Ngày kết thúc:</strong> {endDate ? new Date(endDate).toLocaleDateString() : "Chưa xác định"}
            </p>
            <button
              onClick={() => console.log("Chỉnh sửa hành trình")}
              className="absolute bottom-4 right-4 py-2 px-2 bg-gray-600 text-white rounded-lg shadow-md flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Chỉnh sửa
            </button>
          </div>
        </div>
        {Array.from({ length: days }).map((_, dayIndex) => (
          <div
            key={dayIndex}
            ref={(el) => (dayRefs.current[dayIndex] = el)}
            className="day-section pl-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mt-6 mb-2 flex items-center">
              Ngày {dayIndex + 1}: {dateArray[dayIndex]} 
            </h2>
         
            <div className="activities w-3/4">
  <h3 className="text-xl font-medium mb-2">Hoạt động:</h3>
  {activitiesState[dayIndex] && activitiesState[dayIndex].length > 0 ? (
    <div className="space-y-4">
      {activitiesState[dayIndex].map((activity, idx) => (
        <div
          key={activity._id || idx}
          className="p-8  bg-gray-200 shadow-xl rounded-md flex justify-between items-start"
        >
          {/* Phần Thời gian nằm chung một hàng */}
          <div className="flex flex-col mr-4">
            <div className="flex space-x-4">
              <p className="font-medium">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                {new Date(activity.STARTTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="font-medium">
           
                {new Date(activity.ENDTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Phần thông tin còn lại */}
          <div className="flex-1 pl-10">
            <h4 className="text-lg font-semibold">
              <FontAwesomeIcon icon={faGlassCheers} className="mr-1 h-9" />
              {activity.NAME}
            </h4>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
              {activity.LOCATION}
            </p>
            <p className="flex items-center">
    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
    {activity.DESCRIPTION}
  </p>
          </div>

          {/* Phần Chi phí và Nút chỉnh sửa */}
          <div className="flex flex-col items-end">
            <p className="font-bold">{activity.COST} VND</p>
            <button
              onClick={() => handleEditActivity(activity._id)}
              className="mt-10 py-1 px-3 bg-yellow-500 text-white rounded-md shadow-sm"
            >
              Chỉnh sửa
            </button>
            
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>Chưa có hoạt động nào cho ngày này.</p>
  )}
  <button
    onClick={() => handleAddActivity(dayIndex)}
    className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg shadow-md"
  >
    Thêm hoạt động
  </button>
</div>



          </div>
        ))}
      </div>

      {isModalOpen && (
        <ActivityModal 
        onClose={closeModal} 
        onSave={handleSaveActivity}
        dayIndex={currentDayIndex} // Đảm bảo dayIndex được truyền
         />
      )}
      {isEditing && (
        <UpdateActivity
          activity={currentActivity}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default DetailPage;
