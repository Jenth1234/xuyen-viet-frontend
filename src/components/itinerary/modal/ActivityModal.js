import { createActivity } from '../../../api/callApi'; // Import the createActivity function
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Đảm bảo import useParams

const ActivityModal = ({ onClose, onSave, dayIndex }) => {
  const { itineraryId } = useParams();

  const [activity, setActivity] = useState({
    NAME: '',
    STARTTIME: '',
    ENDTIME: '',
    LOCATION: '',
    DESCRIPTION: '',
    COST: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({
      ...activity,
      [name]: value,
    });
  };

  const formatDateTime = (time) => {
    if (time) {
      return `${new Date().toISOString().split('T')[0]}T${time}`;
    }
    return null;
  };

  const handleSave = async () => {
    const newActivity = {
      activity: {
        NAME:activity.NAME,
        LOCATION: activity.LOCATION,
        DESCRIPTION: activity.DESCRIPTION,
        STARTTIME: formatDateTime(activity.STARTTIME),
        ENDTIME: formatDateTime(activity.ENDTIME),
        COST: activity.COST,
      },
      itineraryId: itineraryId,
    };

    try {
      const response = await createActivity(newActivity);
      console.log("Activity saved successfully:", response);
      onSave(dayIndex, newActivity);
      onClose();
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-xl font-semibold mb-4">Thêm Hoạt Động</h2>
        <div className="mb-4">
          <label className="block mb-2">
            Tên hoạt động:
            <input
              type="text"
              name="NAME"
              value={activity.NAME}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </label>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian bắt đầu:
                <input 
                  type="time" 
                  name="STARTTIME"
                  value={activity.STARTTIME}
                  onChange={handleChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian kết thúc:
                <input 
                  type="time" 
                  name="ENDTIME"
                  value={activity.ENDTIME}
                  onChange={handleChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
          </div>
          <label className="block mb-2">
            Địa điểm:
            <input
              type="text"
              name="LOCATION"
              value={activity.LOCATION}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </label>
          <label className="block mb-2">
            Mô tả:
            <textarea
              name="DESCRIPTION"
              value={activity.DESCRIPTION}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </label>
          <label className="block mb-2">
            Chi phí:
            <input
              type="number"
              name="COST"
              value={activity.COST}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2">
            Lưu
          </button>
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
