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
import HighlightItinerary from '../components/itinerary/HighlightItinerary';

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
    // Thay vì alert, chuyển hướng đến trang SuggestItinerary
    navigate('/suggest-itinerary');
  };

  const handleAddMyItinerary = () => {
    alert("Thêm lịch trình của tôi!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] mb-12">
          <img
            src={bgItinerary}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-white">
                Khám Phá Chuyến Đi Của Bạn
              </h1>
              <p className="text-xl text-gray-200">
                Lên kế hoạch dễ dàng, tận hưởng trọn vẹn!
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={handleNavigateCreateItinerary}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Tạo Lịch Trình
                </button>
                <button
                  onClick={handleCreateIdea}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                  Tạo Ý Tưởng
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <div className="max-w-6xl mx-auto px-4">
          {/* My Itinerary Section */}
          <div className="mb-12">
            <MyItinerary />
          </div>
  
          {/* Guide Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Hướng Dẫn Sử Dụng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: faEarthAmericas,
                  title: "Bước 1",
                  description: "Tạo Lịch Trình mới",
                },
                {
                  icon: faCalendarAlt,
                  title: "Bước 2",
                  description: "Nhập thông tin và thời gian",
                },
                {
                  icon: faCheckCircle,
                  title: "Bước 3",
                  description: "Thêm hoạt động cho từng ngày",
                },
                {
                  icon: faShare,
                  title: "Bước 4",
                  description: "Lưu trữ và chia sẻ hành trình",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-3">
                      <FontAwesomeIcon
                        icon={step.icon}
                        className="h-6 w-6 text-green-600"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Highlight Itinerary Section */}
          <div className="mb-12">
            <HighlightItinerary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Itinerary;
