import React, { useState } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import internationalData from "../../data/international.json";
import airData from "../../data/Flight.json";
import { format, parse } from "date-fns";
import { addPassengerInfo } from "../../api/ApiFlight";
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
          flightNumber: flightNumber, // Số hiệu chuyến bay
          airlineCode: airlineCode,   // Mã hãng bay
          departure: departureAirport,  // Mã sân bay đi
          arrival: arrivalAirport,      // Mã sân bay đến
          departureTime: formattedDepartureTime, // Thời gian khởi hành
          arrivalTime: formattedArrivalTime,     // Thời gian đến
          totalPrice: totalPrice,      // Tổng giá chuyến bay
          flightDuration: formattedFlightDuration // Thời gian bay
      }
  };

  // Ghi log dữ liệu trước khi chuyển trang
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
      <form className="ml-32 w-2/3 p-6" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
        <form
          onSubmit={handleSubmit}
          className="flex space-x-8 p-6 border border-gray-300 rounded"
        >
          {/* Cột 1 */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block mb-1" htmlFor="lastName">
                Họ (vd: Nguyen)*
              </label>
              <input
                type="text"
                id="FIRST_NAME"
                name="FIRST_NAME"
                placeholder="như trên CMND (không dấu)"
                value={contactInfo.FIRST_NAME}
                onChange={handleContactChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="mobile">
                Điện thoại di động*
              </label>
              <input
                type="tel"
                id="MOBILE"
                name="MOBILE"
                placeholder="VD: +84 901234567"
                value={contactInfo.MOBILE}
                onChange={handleContactChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block mb-1" htmlFor="MIDDLE_NAME">
                Tên Đệm & Tên (vd: Trung Thong)*
              </label>
              <input
                type="text"
                id="MIDDLE_NAME"
                name="MIDDLE_NAME"
                placeholder="như trên CMND (không dấu)"
                value={contactInfo.MIDDLE_NAME}
                onChange={handleContactChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="EMAIL"
                name="EMAIL"
                placeholder="VD: email@example.com"
                value={contactInfo.EMAIL}
                onChange={handleContactChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </form>

        <h2>Thông tin hành khách</h2>

        <form
          onSubmit={handleSubmit}
          className="p-6 border border-gray-300 rounded"
        >
          <div className="bg-amber-100 p-4">
            <p className="mb-4 ">
              Vui lòng chú ý cho những điều sau đây: Bạn phải nhập chính xác tên
              như trong CCCD của mình.
            </p>
            <button
              type="button"
              onClick={openModal} // Gọi hàm mở modal
              className=" bg-blue-200 py-2 px-4 rounded"
            >
              Hướng dẫn nhập tên
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">
            Thông tin liên hệ (nhận vé/phiếu thanh toán)
          </h2>
          {passengerInfo.map((passenger, index) => (
  <div className="flex" key={index}>
    {/* Cột 1 */}
    <div className="w-1/2 pr-4">
      <div className="mb-4">
        <label className="block mb-1" htmlFor={`TITLE-${index}`}>
          Danh xưng*
        </label>
        <select
          id={`TITLE-${index}`} // Cung cấp id duy nhất
          name="TITLE"
          value={passenger.TITLE} // Sử dụng passenger.TITLE
          onChange={(e) => handlePassengerChange(index, e)} // Gọi với index
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Chọn danh xưng</option>
          <option value="Mr">Ông</option>
          <option value="Ms">Bà</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor={`FIRST_NAME-${index}`}>
          Họ (vd: Nguyen)*
        </label>
        <input
          type="text"
          id={`FIRST_NAME-${index}`} // Cung cấp id duy nhất
          name="FIRST_NAME"
          placeholder="như trên CMND (không dấu)"
          value={passenger.FIRST_NAME} // Sử dụng passenger.FIRST_NAME
          onChange={(e) => handlePassengerChange(index, e)} // Gọi với index
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor={`DATE_OF_BIRTH-${index}`}>
          Ngày sinh*
        </label>
        <input
          type="date"
          id={`DATE_OF_BIRTH-${index}`} // Cung cấp id duy nhất
          name="DATE_OF_BIRTH"
          value={passenger.DATE_OF_BIRTH} // Sử dụng passenger.DATE_OF_BIRTH
          onChange={(e) => handlePassengerChange(index, e)} // Gọi với index
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </div>
    {/* Cột 2 */}
    <div className="w-1/2 pl-4">
      <div className="mb-4 opacity-0">
        <label className="block mb-1" htmlFor={`middleName-${index}`}>
          null
        </label>
        <input
          type="text"
          placeholder=""
          value={contactInfo.middleName} // Chắc chắn rằng bạn đang xử lý đúng trường này
          onChange={handlePassengerChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor={`MIDDLE_NAME-${index}`}>
          Tên Đệm & Tên (vd: Trung Thong)*
        </label>
        <input
          type="text"
          id={`MIDDLE_NAME-${index}`} // Cung cấp id duy nhất
          name="MIDDLE_NAME"
          placeholder="như trên CMND (không dấu)"
          value={passenger.MIDDLE_NAME} // Sử dụng passenger.MIDDLE_NAME
          onChange={(e) => handlePassengerChange(index, e)} // Gọi với index
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor={`NATIONALITY-${index}`}>
          Quốc tịch*
        </label>
        <select
          id={`NATIONALITY-${index}`} // Cung cấp id duy nhất
          name="NATIONALITY"
          value={passenger.NATIONALITY} // Sử dụng passenger.NATIONALITY
          onChange={(e) => handlePassengerChange(index, e)} // Gọi với index
          required
          className="border rounded px-3 py-2 w-full"
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


          {/* <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button> */}
        </form>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
        >
          Tiếp tục
        </button>
      </form>

      {/* Cột 2: Thông tin chuyến bay */}
      <div className="w-1/2 m-20 p-6 bg-white rounded-lg shadow-md">
        <div className="w-full border-gray-300">
          <h1 className="text-2xl font-bold mb-4 text-center w-1/2 ">
            Thông tin chuyến bay
          </h1>
          <p className="text-lg mb-2 text-gray-700">
            {departureProvince}
            <span className="mx-2 text-xl">→</span>
            {arrivalProvince}
          </p>
          <p className="flex items-center mb-2">
            {airlineInfo ? (
              <span className="flex items-center">
                <img
                  src={airlineInfo.logo}
                  alt={airlineInfo.name}
                  className="w-8 h-8 mr-2"
                />
                {airlineInfo.name}
              </span>
            ) : (
              "Hãng hàng không không tồn tại"
            )}
          </p>
          <div>
          <div className="mt-2 flex text-gray-600  items-center pr-5 mr-5">
  <div className="flex flex-col items-center">

    <span className="mt-2">{departureAirport}</span>
  </div>

  <div className="text-center mx-2 flex flex-col items-center">
    <div className="font-semibold text-gray-700 mb-1">{formattedFlightDuration}</div>
    <div className="flex items-center justify-center my-2 w-full">
      <span className="flex items-center justify-center h-2 w-2 bg-blue-300 rounded-full"></span>
      <hr className="flex-1 border-t border-gray-300 mx-2 w-3/5" />
      <span className="flex items-center justify-center h-2 w-2 bg-blue-300 rounded-full"></span>
    </div>
    <div className="text-gray-500">
      {formattedFlightDuration > 1 ? "Dừng chuyển" : "Thẳng"}
    </div>
  </div>

  <div className="flex flex-col items-center">
   
    <span className="mt-2">{arrivalAirport}</span>
  </div>
</div>

          </div>
          <p className="mb-2">
            <span className="font-semibold">Thời gian bay:</span>{" "}
            {formattedDepartureTime}
          </p>
          {/* <p className="mb-2">
            <span className="font-semibold">Giờ đến:</span>{" "}
            {formattedArrivalTime}
          </p> */}
          {/* <p className="mb-2">
            <span className="font-semibold">Thời gian bay:</span>{" "}
            {formattedFlightDuration}
          </p> */}
          {/* <p className="text-lg font-bold">
            Tổng chi phí chuyến bay:{" "}
            {(totalPrice * 21000).toLocaleString("vi-VN")} VND
          </p> */}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0  bg-opacity-10 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full absolute top-28 right-5">
              <div className="flex">
                {/* Cột bên trái */}
                <div className="w-1/2 pr-2">
                  <img
                    src="https://res.cloudinary.com/dbdl1bznw/image/upload/v1730366980/cccd_wramn4.jpg"
                    alt="Hình ảnh CCCD"
                    className="w-32 h-auto rounded" 
                  />
                  <p className="mt-2 text-xs">
                    {" "}
         
                    Họ: <strong>Nguyen</strong>
                  </p>
                  <p className="mt-1 text-xs">
                    Tên Đệm & Tên: <strong>Trung Thong</strong>
                  </p>
                </div>

                {/* Cột bên phải */}
                <div className="w-1/2 pl-2">
                  <h2 className="text-sm font-bold mb-2">Hướng dẫn nhập tên</h2>
                  <p className="text-xs">
                    {" "}
                    {/* Giảm kích cỡ chữ cho mô tả */}
                    Đảm bảo rằng tên của hành khách được nhập chính xác như trên
                    ID do chính phủ cấp. Hãy làm theo ví dụ này:
                  </p>
                  <p className="font-semibold mt-1 text-xs">
                    Nội dung bạn nhập vào trường tên phải là:
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
                  >
                    {" "}
         
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlightForm;
