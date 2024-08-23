import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import bgItinerary from "../style/img/lienkhuong2.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faCalendarAlt, faCheckCircle, faShare } from '@fortawesome/free-solid-svg-icons';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      activities: ["Khám phá thành phố", "Ăn tối tại nhà hàng địa phương"],
    },
    { day: 2, activities: ["Tham quan bảo tàng", "Dạo quanh công viên"] },
  ]);

  const navigate = useNavigate();

  // Hàm xử lý sự kiện khi nhấn nút tạo lịch trình
  const handleNavigateCreateItinerary = () => {
    navigate("/create-itinerary");
  };

  // Thêm hoặc cập nhật lịch trình
  const addActivity = (day, activity) => {
    setItinerary((prev) => {
      const newItinerary = [...prev];
      const dayIndex = newItinerary.findIndex((item) => item.day === day);
      if (dayIndex > -1) {
        newItinerary[dayIndex].activities.push(activity);
      } else {
        newItinerary.push({ day, activities: [activity] });
      }
      return newItinerary;
    });
  };

  // Hàm xử lý sự kiện khi nhấn nút tạo ý tưởng
  const handleCreateIdea = () => {
    alert("Tạo ý tưởng cho riêng bạn!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">
          Lên Lịch Trình
        </h1>

        {/* Phần tạo lịch trình với hình nền */}
        <div className="relative mb-8">
          <img
            src={bgItinerary}
            alt="Nền"
            className="w-full h-64 object-cover rounded"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <h2 className="text-white text-5xl font-bold">
                Khám phá chuyến đi của bạn, bắt đầu từ đây!
              </h2>
              <p className="text-white text-4xl">
                Lên kế hoạch dễ dàng, tận hưởng trọn vẹn!
              </p>
            </div>
            <button
              onClick={handleNavigateCreateItinerary}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
            >
              Tạo Lịch Trình
            </button>
            <button
              onClick={handleCreateIdea}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Tạo Ý Tưởng Cho Riêng Bạn
            </button>
          </div>
        </div>

        {/* Hướng dẫn sử dụng */}
        <div className="mb-8 p-6 border rounded shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4">Hướng Dẫn Sử Dụng</h2>
          <div className="flex justify-between space-x-4">
            <div className="flex-1 text-center p-4 bg-blue-50 rounded shadow">
              <FontAwesomeIcon icon={faMapPin} className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold mb-2">Bước 1</h3>
              <p className="text-gray-700">
                Tạo Lịch Trình bằng cách nhấn vào nút "Tạo Lịch Trình".
              </p>
            </div>
            <div className="flex-1 text-center p-4 bg-blue-50 rounded shadow">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold mb-2">Bước 2</h3>
              <p className="text-gray-700">
                Nhập thông tin điểm đến và thời gian cho chuyến đi của bạn.
              </p>
            </div>
            <div className="flex-1 text-center p-4 bg-blue-50 rounded shadow">
              <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold mb-2">Bước 3</h3>
              <p className="text-gray-700">
                Thêm các hoạt động vào từng ngày trong lịch trình của bạn.
              </p>
            </div>
            <div className="flex-1 text-center p-4 bg-blue-50 rounded shadow">
              <FontAwesomeIcon icon={faShare} className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Bước 4</h3>
              <p className="text-gray-700">
                Lưu trữ và chia sẻ hành trình của riêng bạn với bạn bè.
              </p>
            </div>
          </div>
        </div>

        {/* Lịch trình nổi bật */}
        <div className="mb-8 p-6 border rounded shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4">Lịch Trình Nổi Bật</h2>
          <ul className="list-disc ml-5">
            {itinerary
              .filter((item) => item.day === 1) // Ví dụ lọc theo ngày 1, có thể thay đổi điều kiện lọc
              .map((item, index) => (
                <li key={index} className="text-gray-700">
                  Ngày {item.day}: {item.activities.join(", ")}
                </li>
              ))}
          </ul>
        </div>

        {/* Hiển thị lịch trình */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lịch Trình Của Bạn</h2>
          {itinerary.length === 0 ? (
            <p>Chưa có hoạt động nào được thêm vào.</p>
          ) : (
            <div>
              {itinerary.map((item, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border rounded shadow-sm bg-white"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Ngày {item.day}
                  </h3>
                  <ul className="list-disc ml-5">
                    {item.activities.map((activity, i) => (
                      <li key={i} className="text-gray-700">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Itinerary;
