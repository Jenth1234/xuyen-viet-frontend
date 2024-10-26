import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faCalendarAlt,
  faCheckCircle,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/nav/NavBar";
import Footer from "../components/Footer";
import bgItinerary from "../style/img/lienkhuong2.jpg";
import MyItinerary from "../components/itinerary/MyItinerary";

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      activities: ["Khám phá thành phố", "Ăn tối tại nhà hàng địa phương"],
    },
    { day: 2, activities: ["Tham quan bảo tàng", "Dạo quanh công viên"] },
  ]);

  const navigate = useNavigate();

  const handleNavigateCreateItinerary = () => {
    navigate("/create-itinerary");
  };

  const handleCreateIdea = () => {
    alert("Tạo ý tưởng cho riêng bạn!");
  };

  const handleAddMyItinerary = () => {
    alert("Thêm lịch trình của tôi!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> {/* Nền tổng thể xám nhạt */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">
          Lên Lịch Trình
        </h1>

        {/* Phần tạo lịch trình với hình nền */}
        <div className="relative mb-8">
          <img
            src={bgItinerary}
            alt="Nền"
            className="w-full h-96 object-cover rounded border border-gray-300" 
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
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
            >
              Tạo Ý Tưởng Cho Riêng Bạn
            </button>
          </div>
        </div>

        <div className="mx-32">
          <div>
            <MyItinerary />
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="mb-8 p-6  rounded  "> {/* Thêm viền */}
            <h2 className="text-2xl text-center font-semibold mb-4">Hướng Dẫn Sử Dụng</h2>
            <div className="flex justify-between space-x-4">
              <div className="flex-1 text-center p-4 rounded  "> 
                <FontAwesomeIcon
                  icon={faEarthAmericas}
                  className="h-10 w-10 text-green-200  mb-2"
                />
                <h3 className="text-lg font-semibold mb-2">Bước 1</h3>
                <p className="text-gray-700">
                  Tạo Lịch Trình bằng cách nhấn vào nút "Tạo Lịch Trình".
                </p>
              </div>
              <div className="flex-1 text-center p-4 rounded  ">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="h-10 w-10 text-green-200  mb-2"
                />
                <h3 className="text-lg font-semibold mb-2">Bước 2</h3>
                <p className="text-gray-700">
                  Nhập thông tin điểm đến và thời gian cho chuyến đi của bạn.
                </p>
              </div>
              <div className="flex-1 text-center p-4 rounded ">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="h-10 w-10 text-green-200  mb-2"
                />
                <h3 className="text-lg font-semibold mb-2">Bước 3</h3>
                <p className="text-gray-700">
                  Thêm các hoạt động vào từng ngày trong lịch trình của bạn.
                </p>
              </div>
              <div className="flex-1 text-center p-4 rounded  "> 
                <FontAwesomeIcon
                  icon={faShare}
                  className="h-10 w-10 text-green-200  mb-2"
                />
                <h3 className="text-lg font-semibold mb-2">Bước 4</h3>
                <p className="text-gray-700">
                  Lưu trữ và chia sẻ hành trình của riêng bạn với bạn bè.
                </p>
              </div>
            </div>
          </div>

          {/* Lịch trình nổi bật */}
          <div className="mb-8 p-6  rounded ">
            <h2 className="text-2xl font-semibold mb-4">Lịch Trình Nổi Bật</h2>
            <ul className="list-disc ml-5">
              {itinerary
                .filter((item) => item.day === 1)
                .map((item, index) => (
                  <li key={index} className="text-gray-700">
                    Ngày {item.day}: {item.activities.join(", ")}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Itinerary;
