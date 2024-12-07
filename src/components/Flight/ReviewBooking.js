import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBirthdayCake, FaFlag, FaPhone, FaEnvelope, FaPlaneDeparture, FaPlaneArrival, FaMoneyBillWave } from "react-icons/fa";
import data from '../../data/Flight.json'; // Path to the JSON file
import { Payment } from '../../api/ApiFlight'; // Import your Payment function

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
    <div className="main bg-gray-100">
      <div className="mx-32 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Xác Nhận Đặt Vé</h1>

        <div className="flex">
          {/* Passenger Information */}
          <div className="w-2/3 pr-4">
            <h2 className="text-xl font-semibold mt-4">Thông Tin Hành Khách:</h2>
            {passengerInfo.length > 0 ? (
              <div className="rounded-lg border bg-gray-50 mb-4 p-4">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <div className="flex items-center">
                      <FaUser className="text-blue-500 mr-2" />
                      <strong>{`${passenger.TITLE} ${passenger.FIRST_NAME} ${passenger.MIDDLE_NAME || ''}`}</strong>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p>Ngày Sinh: <strong>{passenger.DATE_OF_BIRTH}</strong></p>
                      </div>
                      <div>
                        <p>Quốc Tịch: <strong>{passenger.NATIONALITY}</strong></p>
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 mb-4">
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

          {/* Flight Information */}
          <div className="w-1/3 pl-4">
            <h2 className="text-xl font-semibold mt-4">Thông Tin Chuyến Bay:</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 mb-4">
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

        {/* Confirm Button */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleConfirm} 
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Xác Nhận & Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingFlight;
