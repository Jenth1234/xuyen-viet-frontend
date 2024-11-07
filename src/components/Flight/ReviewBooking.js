import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBirthdayCake, FaFlag, FaPhone, FaEnvelope, FaPlaneDeparture, FaPlaneArrival, FaMoneyBillWave } from "react-icons/fa";
import data from '../../data/Flight.json'; // Path to the JSON file
import { Payment } from '../../api/ApiFlight'; // Import your Payment function

const ReviewBookingFlight = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const { contactInfo = {}, passengerInfo = [], flightInfo = {} } = location.state || {};
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    // Load static data from JSON file
    setAirports(data.airports);
    setAirlines(data.airlines);
  }, []);

  // Hàm đổi tên trường thành chữ hoa
  const toUpperCaseKeys = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key.toUpperCase()] = obj[key]; // Đổi tên trường thành chữ hoa
      }
    }
    return newObj;
  };

  // Đổi tên các trường trong flightInfo thành chữ hoa
  const transformedFlightInfo = toUpperCaseKeys(flightInfo);

  // Find airline information based on flight code
  const airlineInfo = airlines.find(airline => airline.code === transformedFlightInfo.AIRLINECODE);

  // Nhân giá tiền với 2100 và kiểm tra giới hạn
  const newTotalPrice = transformedFlightInfo.TOTALPRICE * 21000; // Nhân giá với 21000
  const MAX_PRICE = 50000000; // Giới hạn tối đa 50 triệu VND
  const finalPrice = newTotalPrice > MAX_PRICE ? MAX_PRICE : newTotalPrice; // Kiểm tra nếu vượt quá giới hạn

  // Đổi định dạng giá tiền
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(finalPrice);

  // Hàm xử lý nhấn nút xác nhận
  const handleConfirm = async () => {
    const bookingData = {
      contactInfo: {
        ...contactInfo,
        passengerInfo
      },
      flightInfo: {
        ...transformedFlightInfo,
        TOTALPRICE: finalPrice, // Sử dụng giá đã được điều chỉnh
      }
    };

    try {
      // Call the Payment function with booking data
      const response = await Payment(bookingData);
      console.log("Booking successful:", response);

      // Chuyển hướng đến trang thanh toán QR
      window.open(response.shortLink, "_blank"); // Mở liên kết ngắn
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Có lỗi xảy ra khi đặt vé. Vui lòng thử lại."); // Display an error message
    }
  };

  return (
    <div className="main bg-gray-100">
      <div className="mx-32 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Xác Nhận Đặt Vé</h1>

        {/* Passenger and flight information columns */}
        <div className="flex">
          {/* Passenger information column */}
          <div className="w-2/3 pr-4">
            <h2 className="text-xl font-semibold mt-4">Thông Tin Hành Khách:</h2>
            {passengerInfo.length > 0 ? (
              <div className="rounded-lg border bg-white mb-4">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="mb-4">
                    <div className="border p-4 flex items-center">
                      <FaUser className="text-blue-500 mr-2" />
                      <strong>{`${passenger.TITLE} ${passenger.FIRST_NAME} ${passenger.MIDDLE_NAME || ''}`}</strong>
                    </div>
                    <div className="flex justify-between mt-2 p-4">
                      <div className="w-1/2">
                        <p>Ngày Sinh:</p><strong>{passenger.DATE_OF_BIRTH}</strong>
                      </div>
                      <div className="w-1/2">
                        <p>Quốc Tịch:</p><strong>{passenger.NATIONALITY}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có thông tin hành khách.</p>
            )}

            <h2 className="text-xl font-semibold mt-4">Thông Tin Liên Hệ:</h2>
            {contactInfo ? (
              <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
                <FaUser className="text-blue-500 mb-1" />
                <div>{`${contactInfo.FIRST_NAME} ${contactInfo.MIDDLE_NAME || ''}`}</div>
                <div className="flex">
                  <div className="w-1/2">
                    <p><FaPhone className="inline mr-1" /><strong>Điện Thoại:</strong> {contactInfo.MOBILE}</p>
                  </div>
                  <div className="w-1/2">
                    <p><FaEnvelope className="inline mr-1" /><strong>Email:</strong> {contactInfo.EMAIL}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Không có thông tin liên hệ.</p>
            )}
          </div>

          {/* Flight information column */}
          <div className="w-1/2 pl-4">
            <h2 className="text-xl font-semibold mt-4">Thông Tin Chuyến Bay:</h2>
            <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
              {airlineInfo && (
                <div className="flex items-center mb-4">
                  <img src={airlineInfo.logo} alt={airlineInfo.name} className="h-8 w-8 mr-2" />
                  <span className="font-semibold">{airlineInfo.name}</span>
                </div>
              )}
              <p><FaPlaneDeparture className="inline mr-1" /><strong>Số Hiệu Chuyến Bay:</strong> {transformedFlightInfo.FLIGHTNUMBER}</p>
              <p><FaPlaneDeparture className="inline mr-1" /><strong>Sân Bay Đi:</strong> {transformedFlightInfo.DEPARTURE}</p>
              <p><FaPlaneArrival className="inline mr-1" /><strong>Sân Bay Đến:</strong> {transformedFlightInfo.ARRIVAL}</p>
              <p><FaPlaneDeparture className="inline mr-1" /><strong>Thời Gian Khởi Hành:</strong> {transformedFlightInfo.DEPARTURETIME}</p>
              <p><FaPlaneArrival className="inline mr-1" /><strong>Thời Gian Đến:</strong> {transformedFlightInfo.ARRIVALTIME}</p>
              <p><FaMoneyBillWave className="inline mr-1" /><strong>Tổng Giá:</strong> {formattedPrice}</p>
              <p><FaPlaneDeparture className="inline mr-1" /><strong>Thời Gian Bay:</strong> {transformedFlightInfo.FLIGHTDURATION}</p>
            </div>
          </div>
        </div>

        {/* Nút xác nhận để chuyển đến trang thanh toán QR */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleConfirm} 
            className="bg-blue-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Xác Nhận & Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingFlight;
