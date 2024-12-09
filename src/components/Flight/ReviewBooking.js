import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaUser, FaBirthdayCake, FaFlag, FaPhone, FaEnvelope, 
  FaPlaneDeparture, FaPlaneArrival, FaMoneyBillWave,
  FaClock, FaTicketAlt, FaArrowRight,FaPlane
} from "react-icons/fa";
import data from '../../data/Flight.json';
import { Payment } from '../../api/ApiFlight';

const ReviewBookingFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contactInfo = {}, passengerInfo = [], flightInfo = {} } = location.state || {};
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    setAirports(data.airports);
    setAirlines(data.airlines);
  }, []);

  const toUpperCaseKeys = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key.toUpperCase()] = obj[key];
      }
    }
    return newObj;
  };

  const transformedFlightInfo = toUpperCaseKeys(flightInfo);
  const airlineInfo = airlines.find(airline => airline.code === transformedFlightInfo.AIRLINECODE);
  const newTotalPrice = transformedFlightInfo.TOTALPRICE * 21000;
  const MAX_PRICE = 50000000;
  const finalPrice = newTotalPrice > MAX_PRICE ? MAX_PRICE : newTotalPrice;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(finalPrice);

  const handleConfirm = async () => {
    const bookingData = {
      contactInfo: {
        ...contactInfo,
        passengerInfo
      },
      flightInfo: {
        ...transformedFlightInfo,
        TOTALPRICE: finalPrice,
      }
    };

    try {
      const response = await Payment(bookingData);
      console.log("Booking successful:", response);
      window.open(response.shortLink, "_blank");
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Xác Nhận Đặt Vé</h1>
          <p className="text-gray-600 mt-2">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Flight Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {airlineInfo && (
                  <img src={airlineInfo.logo} alt={airlineInfo.name} className="h-12 w-12 rounded-full bg-white p-1" />
                )}
                <div>
                  <h2 className="text-xl font-bold">{airlineInfo?.name}</h2>
                  <p className="text-sm opacity-90">Chuyến bay: {transformedFlightInfo.FLIGHTNUMBER}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formattedPrice}</p>
                <p className="text-sm opacity-90">Tổng giá vé</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90">Khởi hành</p>
                <p className="text-xl font-semibold">{transformedFlightInfo.DEPARTURE}</p>
                <p className="text-sm">{transformedFlightInfo.DEPARTURETIME}</p>
              </div>
              <div className="flex-none px-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="flex-1 h-0.5 w-24 bg-white"></div>
                  <FaPlane className="mx-2 transform rotate-90" />
                  <div className="flex-1 h-0.5 w-24 bg-white"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-center mt-2 text-sm">{transformedFlightInfo.FLIGHTDURATION}</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm opacity-90">Đến</p>
                <p className="text-xl font-semibold">{transformedFlightInfo.ARRIVAL}</p>
                <p className="text-sm">{transformedFlightInfo.ARRIVALTIME}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Passenger Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaUser className="text-blue-500 mr-2" />
                Thông Tin Hành Khách
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">
                          {`${passenger.TITLE} ${passenger.FIRST_NAME} ${passenger.MIDDLE_NAME || ''}`}
                        </p>
                        <p className="text-gray-600 text-sm">Hành khách {index + 1}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <FaBirthdayCake className="text-blue-500 mr-2" />
                        <span>{passenger.DATE_OF_BIRTH}</span>
                      </div>
                      <div className="flex items-center">
                        <FaFlag className="text-blue-500 mr-2" />
                        <span>{passenger.NATIONALITY}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaPhone className="text-blue-500 mr-2" />
                Thông Tin Liên Hệ
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Họ và tên</p>
                    <p className="font-semibold">{`${contactInfo.FIRST_NAME} ${contactInfo.MIDDLE_NAME || ''}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số điện thoại</p>
                    <p className="font-semibold">{contactInfo.MOBILE}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{contactInfo.EMAIL}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Quay lại
            </button>
            <button 
              onClick={handleConfirm}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <span>Xác nhận & Thanh toán</span>
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingFlight;
