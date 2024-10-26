import React, { useState, useEffect } from "react";
import { updateItinerary, getItinerary } from "../../../api/callApi";

const UpdateItinerary = ({ isOpen, onClose, itineraryId, onUpdate }) => {
  const [formData, setFormData] = useState({
    NAME: "",
    START_DATE: "",
    END_DATE: "",
  });
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchItinerary = async () => {
      if (isOpen && itineraryId) {
        try {
          const response = await getItinerary(itineraryId);
          console.log("Fetched itinerary:", response); // Ghi lại dữ liệu nhận được
          
          const startDate = new Date(response.START_DATE).toISOString().split("T")[0];
          const endDate = new Date(response.END_DATE).toISOString().split("T")[0];
          const fetchedData = {
            NAME: response.NAME || "",
            START_DATE: startDate,
            END_DATE: endDate,
          };
          setFormData(fetchedData);
          setInitialData(fetchedData);
        } catch (error) {
          console.error("Error fetching itinerary:", error);
        }
      }
    };
    fetchItinerary();
  }, [isOpen, itineraryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      try {
        const updatedData = {
          ...formData,
          START_DATE: new Date(formData.START_DATE).toISOString(),
          END_DATE: new Date(formData.END_DATE).toISOString(),
        };
        await updateItinerary(itineraryId, updatedData);
        onUpdate(updatedData);
        onClose();
      } catch (error) {
        console.error("Error updating itinerary:", error);
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
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hành trình</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">
                Tên hành trình:
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
                {/* Bạn có thể bỏ comment này để sử dụng lại input cho ngày */}
                {/* <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày bắt đầu:
                    <input
                      type="date"
                      name="START_DATE"
                      value={formData.START_DATE}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày kết thúc:
                    <input
                      type="date"
                      name="END_DATE"
                      value={formData.END_DATE}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </label>
                </div> */}
              </div>
            </div>
            <div className="flex justify-end">
              <button
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

export default UpdateItinerary;
