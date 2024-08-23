import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Đảm bảo modal không gây ra vấn đề với screen readers

const ItineraryDetail = () => {
  const location = useLocation();
  const { itinerary, startDate, endDate } = location.state || { itinerary: [], startDate: '', endDate: '' };

  // Tải dữ liệu từ local storage khi trang được tải
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : itinerary.reduce((acc, item) => ({
      ...acc,
      [item.day]: item.activities || []
    }), {});
  });

  const [newActivity, setNewActivity] = useState({
    day: '',
    activity: '',
    startTime: '',
    endTime: '',
    link: ''
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Lưu dữ liệu vào local storage mỗi khi activities thay đổi
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Log khi thay đổi giá trị input
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = () => {
    console.log("Adding activity:", newActivity);

    if (!newActivity.day || !newActivity.activity) return;

    setActivities(prev => {
      const updatedActivities = {
        ...prev,
        [newActivity.day]: [...(prev[newActivity.day] || []), newActivity]
      };
      console.log("Updated activities:", updatedActivities);
      return updatedActivities;
    });

    // Reset state
    setNewActivity({ day: '', activity: '', startTime: '', endTime: '', link: '' });
    setSelectedDay(null); 
    setModalIsOpen(false); // Đóng modal sau khi thêm hoạt động
  };

  const handleRemoveActivity = (day, index) => {
    console.log(`Removing activity ${index} for day ${day}`);
    setActivities(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    console.log("Form submitted with:", newActivity);
    handleAddActivity();
  };

  return (
    <div className="flex min-h-screen">
      {/* Thanh bên trái */}
      <aside className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Thanh Bên Trái</h2>
        {/* Thêm nội dung cho thanh bên trái */}
      </aside>

      <main className="flex-1 mx-4">
        <nav className="bg-gray-800 p-4 text-white mb-4">
          <h1 className="text-2xl">Chi Tiết Lịch Trình</h1>
          <p className="text-gray-700">Từ ngày: {startDate} đến ngày: {endDate}</p>
        </nav>

        {itinerary.length > 0 ? (
          itinerary.map((item, index) => (
            <div key={index} className="mb-8 p-6 border rounded shadow-sm bg-white">
              <h1 className="text-4xl font-bold mb-6 text-blue-600">Ngày {item.day} - {item.location}</h1>

              {/* Hiển thị các hoạt động */}
              {activities[item.day]?.length > 0 ? (
                activities[item.day].map((activity, i) => (
                  <div key={i} className="mb-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-xl font-bold">Hoạt Động {i + 1}</h2>
                    <p><strong>Hoạt Động:</strong> {activity.activity}</p>
                    <p><strong>Thời Gian Bắt Đầu:</strong> {activity.startTime}</p>
                    <p><strong>Thời Gian Kết Thúc:</strong> {activity.endTime}</p>
                    <p><strong>Đường Link:</strong> <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{activity.link}</a></p>
                    <button
                      onClick={() => handleRemoveActivity(item.day, i)}
                      className="mt-2 text-red-500 hover:underline"
                    >
                      Xóa Hoạt Động
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">Không có hoạt động nào cho ngày này.</p>
              )}

              {/* Nút thêm hoạt động cho ngày cụ thể */}
              <button
                onClick={() => {
                  console.log(`Opening modal for day ${item.day}`);
                  setSelectedDay(item.day);
                  setModalIsOpen(true);
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm Hoạt Động
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-700">Không có lịch trình nào để hiển thị.</p>
        )}

        {/* Modal thêm hoạt động */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => {
            console.log("Modal closed");
            setModalIsOpen(false);
          }}
          className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white"
        >
          <h2 className="text-2xl font-semibold mb-4">Thêm Hoạt Động Cho Ngày {selectedDay}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="activity" className="block text-gray-700">Hoạt Động</label>
              <input
                type="text"
                id="activity"
                name="activity"
                value={newActivity.activity}
                onChange={handleNewActivityChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-gray-700">Thời Gian Bắt Đầu</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={newActivity.startTime}
                onChange={handleNewActivityChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-gray-700">Thời Gian Kết Thúc</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={newActivity.endTime}
                onChange={handleNewActivityChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="link" className="block text-gray-700">Đường Link Google Maps</label>
              <input
                type="url"
                id="link"
                name="link"
                value={newActivity.link}
                onChange={handleNewActivityChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <button
              type="submit" // Đổi thành type="submit" để kích hoạt sự kiện onSubmit của form
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Hoàn tất
            </button>
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="ml-4 text-gray-500 hover:underline"
            >
              Hủy
            </button>
          </form>
        </Modal>
      </main>

      {/* Thanh bên phải */}
      <aside className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Thanh Bên Phải</h2>
        {/* Thêm nội dung cho thanh bên phải */}
      </aside>
    </div>
  );
};

export default ItineraryDetail;
