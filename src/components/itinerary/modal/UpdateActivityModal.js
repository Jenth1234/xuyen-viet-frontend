import React, { useState, useEffect } from "react";
import { updateActivity, getActivity } from "../../../api/callApi";

const UpdateActivity = ({ isOpen, onClose, activity, onUpdate }) => {
  const [formData, setFormData] = useState({
    NAME: "",
    LOCATION: "",
    DESCRIPTION: "",
    COST: "",
    STARTTIME: "",
    ENDTIME: "",
  });
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (isOpen && activity) {
      try {
        // Sử dụng trực tiếp dữ liệu từ prop activity thay vì gọi API
        const startTime = new Date(activity.STARTTIME).toISOString().slice(11, 16);
        const endTime = activity.ENDTIME ? new Date(activity.ENDTIME).toISOString().slice(11, 16) : '';
        
        const activityData = {
          NAME: activity.NAME || "",
          LOCATION: activity.LOCATION || "",
          DESCRIPTION: activity.DESCRIPTION || "",
          COST: activity.COST || "",
          STARTTIME: startTime,
          ENDTIME: endTime,
        };
        
        setFormData(activityData);
        setInitialData(activityData);
      } catch (error) {
        console.error("Error setting activity data:", error);
      }
    }
  }, [isOpen, activity]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      try {
        const { STARTTIME, ENDTIME, ...rest } = formData;
        const updatedData = {
          ...rest,
          STARTTIME: new Date(new Date().toISOString().split("T")[0] + "T" + STARTTIME + ":00"),
          ENDTIME: new Date(new Date().toISOString().split("T")[0] + "T" + ENDTIME + ":00"),
        };
        // Không gọi API ở đây nữa
        // await updateActivity(activity, updatedData);
        
        // Chỉ cập nhật state tạm thời
        onUpdate({
          ...activity, // Giữ lại _id và các trường khác
          ...updatedData
        });
        onClose();
      } catch (error) {
        console.error("Error updating activity:", error);
      }
    } else {
      console.log("No changes detected.");
      onClose();
    }
  };
  

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-1/2">
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hoạt động</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">
                Tên hoạt động:
                <input
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
              </label>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian bắt đầu:
                    <input
                      type="time"
                      name="STARTTIME"
                      value={formData.STARTTIME}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian kết thúc:
                    <input
                      type="time"
                      name="ENDTIME"
                      value={formData.ENDTIME}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </label>
                </div>
              </div>
              <label className="block mb-2">
                Địa điểm:
                <input
                  type="text"
                  name="LOCATION"
                  value={formData.LOCATION}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
              </label>
              <label className="block mb-2">
                Mô tả:
                <textarea
                  name="DESCRIPTION"
                  value={formData.DESCRIPTION}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
              </label>
              <label className="block mb-2">
                Chi phí:
                <input
                  type="number"
                  name="COST"
                  value={formData.COST}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
              onClick={handleSubmit}
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateActivity;
