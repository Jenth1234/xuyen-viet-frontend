import React, { useState } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import internationalData from "../../data/international.json";
import airData from "../../data/Flight.json";
import { format, parse } from "date-fns";
import { addPassengerInfo } from "../../api/ApiFlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faPhone,
  faEnvelope,
  faInfoCircle,
  faQuestionCircle,
  faArrowRight,
  faCalendar,
  faPlane,
  faTimes,
  faSave,
  faSuitcase,
  faClock,
  faLuggageCart,
  faCircleDot,
  faPlaneArrival,
  faPlaneDeparture ,
  faExchange,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { vi } from "date-fns/locale";
const BookingFlightForm = () => {
  const location = useLocation(); // Lấy thông tin location
  const { flight } = location.state || {}; // Nhận dữ liệu chuyến bay từ state
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy thông tin cần thiết từ đối tượng flightOffer
  const departureAirport = flight.itineraries[0].segments[0].departure.iataCode; // Mã sân bay đi (HAN)
  const arrivalAirport = flight.itineraries[0].segments[0].arrival.iataCode; // Mã sân bay đến (SGN)
  const airlineCode = flight.itineraries[0].segments[0].carrierCode; // Mã hãng bay (VN)
  const flightNumber = flight.itineraries[0].segments[0].number; // Số hiệu chuyến bay (223)
  const departureTime = new Date(
    flight.itineraries[0].segments[0].departure.at
  ); // Giờ bay
  const arrivalTime = new Date(flight.itineraries[0].segments[0].arrival.at); // Giờ đến
  const totalPrice = flight.price.total; // Tổng giá chuyến bay
  const flightDuration = flight.itineraries[0].duration; // Thời gian bay (duration)

  // Hàm ánh xạ mã sân bay với tỉnh
  const mapAirportsToProvinces = (airportCode) => {
    const airport = airData.airports.find(
      (airport) => airport.code === airportCode
    );
    return airport ? airport.province : "không tồn tại";
  };

  const getAirlineInfo = (code) => {
    const airline = airData.airlines.find((airline) => airline.code === code);
    return airline
      ? { name: airline.name, logo: airline.logo || "Logo không có" }
      : null;
  };

  // In kết quả ra console
  const airlineInfo = getAirlineInfo(airlineCode); // Truy vấn thông tin cho mã hãng
  console.log(airlineInfo);
  const departureProvince = mapAirportsToProvinces(departureAirport); // Tỉnh của sân bay đi
  const arrivalProvince = mapAirportsToProvinces(arrivalAirport); // Tỉnh của sân bay đến
  // Hàm để lấy tên thứ trong tuần
  const getWeekday = (date) => {
    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return weekdays[date.getDay()];
  };
  // Lấy giờ, phút, ngày và thứ từ thời gian
  // Sử dụng date-fns để định dạng thời gian
  const formattedDepartureTime = format(
    departureTime,
    "eeee, d'/'M'/'yyyy",
    { locale: vi }
  );
  const formattedArrivalTime = format(
    arrivalTime,
    "eeee, d 'tháng' M 'năm' yyyy - HH:mm",
    { locale: vi }
  );

  // Tách thời gian bay thành giờ và phút
  const durationMatch = flightDuration.match(/PT(\d+)H(\d+)M/);
  const flightHours = durationMatch ? durationMatch[1] : 0; // Số giờ
  const flightMinutes = durationMatch ? durationMatch[2] : 0; // Số phút
  const formattedFlightDuration = `${flightHours} giờ ${flightMinutes} phút`;
  // Hiển thị thông tin
  console.log(`Thời gian bay: ${formattedFlightDuration}`);
  console.log(`Sân bay đi: ${departureAirport}`);
  console.log(`Sân bay đến: ${arrivalAirport}`);
  console.log(`Hãng máy bay: ${airlineCode}`);
  console.log(`Số hiệu chuyến bay: ${flightNumber}VN`);
  console.log(`Giờ bay: ${formattedDepartureTime}`);
  console.log(`Giờ đến: ${formattedArrivalTime}`);
  console.log(
    `Tổng chi phí chuyến bay: ${(totalPrice * 21000).toLocaleString(
      "vi-VN"
    )} VND`
  );

  // Khởi tạo trạng thái cho thông tin liên hệ và hành khách
  const [contactInfo, setContactInfo] = useState({
    FIRST_NAME: "",
    MIDDLE_NAME: "",
    LAST_NAME: "",
    MOBILE: "",
    EMAIL: "",
  });

  const [passengerInfo, setPassengerInfo] = useState([
    {
        TITLE: "",
        FIRST_NAME: "",
        MIDDLE_NAME: "",
        DATE_OF_BIRTH: "",
        NATIONALITY: "",
    }
]);

  const [flightInfo, setFlightInfo] = useState({
    flightNumber: '',
    departure: '',
    arrival: '',
    date: '',
  });
  
  const handleAddPassenger = () => {
    // Thêm hành khách mới vào mảng
    setPassengerInfo((prevInfo) => [
      ...prevInfo,
      { TITLE: "", FIRST_NAME: "", MIDDLE_NAME: "", DATE_OF_BIRTH: "", NATIONALITY: "" }
    ]);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;

    // Cập nhật thông tin hành khách theo chỉ số (index)
    setPassengerInfo((prevInfo) => {
        const updatedPassengers = [...prevInfo]; // Tạo một bản sao mảng hành khách
        updatedPassengers[index] = { ...updatedPassengers[index], [name]: value }; // Cập nhật thông tin hành khách tại chỉ số index
        return updatedPassengers; // Trả về mảng đã cập nhật
    });
};
console.log(passengerInfo)
const handleSubmit = async (e) => {
  e.preventDefault();

  // Tạo đối tượng dữ liệu cần gửi qua trang mới
  const dataToSend = {
      contactInfo: contactInfo,
      passengerInfo: passengerInfo,
      flightInfo: {
          flightNumber: flightNumber, 
          airlineCode: airlineCode,  
          departure: departureAirport,  
          arrival: arrivalAirport,      
          departureTime: formattedDepartureTime, 
          arrivalTime: formattedArrivalTime,   
          totalPrice: totalPrice,      
          flightDuration: formattedFlightDuration 
      }
  };

 
  console.log("Dữ liệu hành khách và chuyến bay đã được chuẩn bị:", dataToSend);

  // Chuyển hướng đến trang xác nhận mà không gửi đến server
  navigate('/review-booking-flight', { state: dataToSend });
};


  
  
  
  // Hàm mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex space-x-8 mt-32">
      {/* Cột 1: Form Thông tin liên hệ và Hành khách */}
      <form onSubmit={handleSubmit} className="w-2/3 space-y-6 p-6">
  {/* Contact Information */}
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h2>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Họ (vd: Nguyen)*
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faUser} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            id="FIRST_NAME"
            name="FIRST_NAME"
            placeholder="như trên CMND (không dấu)"
            value={contactInfo.FIRST_NAME}
            onChange={handleContactChange}
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên Đệm & Tên (vd: Trung Thong)*
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faUser} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            id="MIDDLE_NAME"
            name="MIDDLE_NAME"
            placeholder="như trên CMND (không dấu)"
            value={contactInfo.MIDDLE_NAME}
            onChange={handleContactChange}
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Điện thoại di động*
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faPhone} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="tel"
            id="MOBILE"
            name="MOBILE"
            placeholder="VD: +84 901234567"
            value={contactInfo.MOBILE}
            onChange={handleContactChange}
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email*
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faEnvelope} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="email"
            id="EMAIL"
            name="EMAIL"
            placeholder="VD: email@example.com"
            value={contactInfo.EMAIL}
            onChange={handleContactChange}
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Passenger Information */}
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Thông tin hành khách</h2>
    </div>

    {/* Warning Box */}
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <FontAwesomeIcon icon={faInfoCircle} className="text-amber-500 mt-1" />
        <div>
          <p className="text-sm text-amber-700 mb-2">
            Vui lòng nhập chính xác tên như trong CCCD của mình.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
            Hướng dẫn nhập tên
          </button>
        </div>
      </div>
    </div>

    {/* Passenger Forms */}
    {passengerInfo.map((passenger, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 hover:border-blue-300 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
          Hành khách {index + 1}
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh xưng*
            </label>
            <select
              id={`TITLE-${index}`}
              name="TITLE"
              value={passenger.TITLE}
              onChange={(e) => handlePassengerChange(index, e)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh xưng</option>
              <option value="Mr">Ông</option>
              <option value="Ms">Bà</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ (vd: Nguyen)*
            </label>
            <input
              type="text"
              id={`FIRST_NAME-${index}`}
              name="FIRST_NAME"
              placeholder="như trên CMND (không dấu)"
              value={passenger.FIRST_NAME}
              onChange={(e) => handlePassengerChange(index, e)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Đệm & Tên (vd: Trung Thong)*
            </label>
            <input
              type="text"
              id={`MIDDLE_NAME-${index}`}
              name="MIDDLE_NAME"
              placeholder="như trên CMND (không dấu)"
              value={passenger.MIDDLE_NAME}
              onChange={(e) => handlePassengerChange(index, e)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh*
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faCalendar} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <input
                type="date"
                id={`DATE_OF_BIRTH-${index}`}
                name="DATE_OF_BIRTH"
                value={passenger.DATE_OF_BIRTH}
                onChange={(e) => handlePassengerChange(index, e)}
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quốc tịch*
            </label>
            <select
              id={`NATIONALITY-${index}`}
              name="NATIONALITY"
              value={passenger.NATIONALITY}
              onChange={(e) => handlePassengerChange(index, e)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn quốc tịch</option>
              {internationalData.international.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg 
      transition-colors duration-200 flex items-center justify-center space-x-2"
  >
    <span>Tiếp tục</span>
    <FontAwesomeIcon icon={faArrowRight} />
  </button>
</form>

      {/* Cột 2: Thông tin chuyến bay */}
      <div className="w-1/3">
  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
    {/* Header with Gradient */}
    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faPlane} className="text-white text-lg" />
      </div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Thông tin chuyến bay
      </h2>
    </div>

    {/* Flight Route with Enhanced Design */}
    <div className="mb-8">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="text-lg font-semibold text-gray-800">{departureProvince}</div>
        <div className="px-4">
          <FontAwesomeIcon icon={faArrowRight} className="text-blue-500" />
        </div>
        <div className="text-lg font-semibold text-gray-800">{arrivalProvince}</div>
      </div>

      {/* Airline Info with Better Spacing */}
      {airlineInfo && (
        <div className="flex items-center space-x-4 mt-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <img
            src={airlineInfo.logo}
            alt={airlineInfo.name}
            className="w-12 h-12 object-contain"
          />
          <div>
            <p className="font-semibold text-gray-800">{airlineInfo.name}</p>
            <p className="text-sm text-gray-600">
              {formattedFlightDuration > 1 ? (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faExchange} className="mr-2 text-orange-500" />
                  Chuyến bay có điểm dừng
                </span>
              ) : (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
                  Chuyến bay thẳng
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Flight Timeline with Animation */}
    <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl mb-8">
      <div className="flex items-center justify-between">
        {/* Departure Section */}
        <div className="text-center relative">
        <div className="text-2xl font-bold text-gray-800 mb-2">
  {new Date(departureTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })}
</div>
          <div className="space-y-1">
            <div className="text-base font-semibold text-blue-600">{departureAirport}</div>
            <div className="text-sm text-gray-500">
              {new Date(departureTime).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Animated Flight Path */}
        <div className="flex-1 px-8 relative">
          <div className="absolute w-full top-1/2 border-t-2 border-blue-200 border-dashed"></div>
          <div className="absolute w-full top-1/2 flex justify-center -mt-3">
            <div className="bg-white p-2 rounded-full shadow-md transform hover:scale-110 transition-transform">
              <FontAwesomeIcon 
                icon={faPlane} 
                className="text-blue-500 transform -rotate-45 animate-pulse" 
              />
            </div>
          </div>
          <div className="absolute w-full -bottom-8 flex justify-center">
            <span className="bg-blue-100 px-4 py-1.5 rounded-full text-sm font-medium text-blue-700 flex items-center shadow-sm">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {formattedFlightDuration}
            </span>
          </div>
        </div>

        {/* Arrival Section */}
        <div className="text-center relative">
        <div className="text-2xl font-bold text-gray-800 mb-2">
  {new Date(arrivalTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })}
</div>
          <div className="space-y-1">
            <div className="text-base font-semibold text-blue-600">{arrivalAirport}</div>
            <div className="text-sm text-gray-500">
              {new Date(arrivalTime).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Flight Details with Icons */}
    <div className="space-y-4 mb-8">
      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faSuitcase} className="text-blue-500 w-5" />
        <span className="ml-3 text-gray-700">Hành lý xách tay: 7kg</span>
      </div>
      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faLuggageCart} className="text-blue-500 w-5" />
        <span className="ml-3 text-gray-700">Hành lý ký gửi: 23kg</span>
      </div>
    </div>

    {/* Price Summary with Enhanced Design */}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Tổng tiền</span>
        <div className="text-right">
          <span className="block text-2xl font-bold text-blue-600">
            {(totalPrice * 21000).toLocaleString("vi-VN")} VND
          </span>
          <span className="text-sm text-gray-500">Đã bao gồm thuế và phí</span>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default BookingFlightForm;
