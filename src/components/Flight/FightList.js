import React, { useState } from "react";
import { useLocation,useNavigate   } from "react-router-dom";
import data from "../../data/Flight.json"; // Đường dẫn chính xác đến tệp JSON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faMagnifyingGlass,
  faArrowRight,
  faCalendar,
  faUsers,
  faChair,
  faCoins,
  faDollarSign,
  faClock,
  faChevronUp,
  faChevronDown,
  faTag,
  faExclamationCircle,
  faFilter,         // Thêm faFilter
  faCheck,          // Thêm nếu bạn dùng checkbox
  faUndo,           // Thêm nếu bạn có nút reset
  faMapMarkerAlt    // Thêm nếu bạn hiển thị location
} from "@fortawesome/free-solid-svg-icons";
const FlightResults = () => {
  const location = useLocation();
  const navigate  = useNavigate ();

  
  const {
    flights = [],
    origin = "",
    destination = "",
    departureDate = "",
    returnDate = "",
    passengerCount = 1,
    seatClass = "Economy",
  } = location.state || {};
console.log(flights)
  const [expandedFlightIndex, setExpandedFlightIndex] = useState(null);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);
  const itinerary = flights?.itineraries?.[0]; // Sử dụng toán tử ?. để an toàn
  const segment = itinerary?.segments?.[0]; // Sử dụng toán tử ?. để an toàn
    // Log thông tin itinerary và segment
    console.log('Itinerary:', itinerary);
    console.log('Segment:', segment);
  const conversionRate = 21000;   

  const prices = flights.map(flight => {
  

    const totalPriceStr = flight.price.total;


    const totalPriceEUR = parseFloat(totalPriceStr);


    const totalPriceVND = totalPriceEUR * conversionRate;


    return isNaN(totalPriceVND) ? null : totalPriceVND;
  }).filter(price => price !== null);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const handleFlightClick = (index) => {
    setExpandedFlightIndex(expandedFlightIndex === index ? null : index);
  };

  const getAirlineInfo = (code) => {
    const airline = data.airlines.find((a) => a.code === code);
    const airport = data.airports.find((a) => a.code === code);

    return {
      name: airline ? airline.name : code,
      logo: airline ? airline.logo : null,
      province: airport ? airport.province : null
    };
  };

  const getAirportProvince = (code) => {
    const airport = data.airports.find(a => a.code === code);
    return airport ? airport.province : code; // Nếu không tìm thấy, trả về mã sân bay
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleFlightSelect = (index) => {
    console.log(`Chọn chuyến bay có chỉ số: ${index}`);

    const selectedFlight = flights[index];
    console.log('Chọn chuyến bay:', selectedFlight);
    navigate('/booking-flight', { state: { flight: selectedFlight } });
  };

  const handlePriceClick = (index) => {
    setSelectedFlightIndex(index);
  };

  const minPriceFlightIndex = flights.findIndex(flight => {
    console.log("!")
    const totalPriceStr = flight.price.total;
    const totalPriceEUR = parseFloat(totalPriceStr);
    const totalPriceVND = totalPriceEUR * conversionRate;
    return totalPriceVND === minPrice;
  });

  const maxPriceFlightIndex = flights.findIndex(flight => {
    const totalPriceStr = flight.price.total;
    const totalPriceEUR = parseFloat(totalPriceStr);
    const totalPriceVND = totalPriceEUR * conversionRate;
    return totalPriceVND === maxPrice;
  });

  const parseISODuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return (hours * 60) + minutes;
  };

  const formatDuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const hoursStr = hours ? `${hours} giờ ` : "";
    const minutesStr = minutes ? `${minutes} phút` : "";
    return hoursStr + minutesStr;
  };

  const validFlights = flights.filter(flight => flight.itineraries && flight.itineraries[0].segments && flight.itineraries[0].segments[0].duration);

  const shortestFlight = validFlights.reduce((shortest, flight) => {
    const durationStr = flight.itineraries[0].segments[0].duration;
    const durationInMinutes = parseISODuration(durationStr);

    return durationInMinutes < shortest.durationInMinutes ? { durationInMinutes, durationStr } : shortest;
  }, { durationInMinutes: Infinity, durationStr: "" });

  const shortestDurationFormatted = shortestFlight.durationStr !== "" ? formatDuration(shortestFlight.durationStr) : "Không xác định";



  return (
    <div className="flex mt-24 ml-32">
      {/* Thanh bên */}
      <aside className="w-1/4 p-6 bg-white rounded-xl shadow-lg sticky top-20 h-auto max-h-[calc(100vh-5rem)]">
  {/* Header */}
  <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faFilter} className="text-blue-600 text-lg" />
    </div>
    <h2 className="text-xl font-bold text-gray-800">Bộ lọc tìm kiếm</h2>
  </div>

  {/* Seat Class */}
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FontAwesomeIcon icon={faChair} className="text-blue-600 mr-3" />
      Hạng ghế
    </h3>
    <div className="space-y-3">
      {['Phổ thông', 'Thương gia'].map((type) => (
        <label key={type} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-600 
                checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <FontAwesomeIcon 
              icon={faCheck} 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                text-white text-xs opacity-0 check-icon pointer-events-none" 
            />
          </div>
          <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
            {type}
          </span>
        </label>
      ))}
    </div>
  </div>

  {/* Price Range */}
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FontAwesomeIcon icon={faDollarSign} className="text-blue-600 mr-3" />
      Khoảng giá
    </h3>
    <div className="px-3">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>0đ</span>
        <span>10,000,000đ</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="10000000" 
        step="100000"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
          accent-blue-600 hover:accent-blue-700 transition-all"
      />
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Giá được chọn: <span className="font-semibold">5,000,000đ</span>
        </p>
      </div>
    </div>
  </div>

  {/* Airlines */}
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FontAwesomeIcon icon={faPlane} className="text-blue-600 mr-3" />
      Hãng hàng không
    </h3>
    <div className="space-y-3">
      {['Vietnam Airlines', 'Vietjet Air', 'Bamboo Airways'].map((airline) => (
        <label key={airline} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer group">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox"
              className="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-600 
                checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
              {airline}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            từ 1,200,000đ
          </span>
        </label>
      ))}
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex space-x-4 pt-4 border-t border-gray-200">
    <button className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
      <FontAwesomeIcon icon={faUndo} className="mr-2" />
      Đặt lại
    </button>
    <button className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
      <FontAwesomeIcon icon={faCheck} className="mr-2" />
      Áp dụng
    </button>
  </div>

  {/* Custom Checkbox Styles */}
  <style jsx>{`
    .check-icon {
      opacity: 0;
      transition: opacity 0.2s;
    }
    input:checked ~ .check-icon {
      opacity: 1;
    }
  `}</style>
</aside>

      {/* Nội dung chính */}
      <main className="flex-grow p-6 bg-gray-50">
  {/* Header Section */}
  <div className="relative mb-8">
    <div className="h-48 rounded-2xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
        style={{ 
          backgroundImage: "url('https://res.cloudinary.com/dbdl1bznw/image/upload/v1730281326/chuyenbay_awkccw.jpg')",
          filter: "brightness(0.7)"
        }}
      />
    </div>
    
    <div className="absolute inset-0 flex items-center">
      <div className="container mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 flex items-center text-gray-800">
  <FontAwesomeIcon icon={faPlane} className="text-blue-600 mr-3" />
  {/* hoặc */}
  <div className="flex items-center">
    <FontAwesomeIcon icon={faPlane} className="text-blue-600 mr-2" />
    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-blue-600" />
  </div>
  Kết quả tìm kiếm
</h1>
          
          <div className="flex items-center space-x-2 text-lg text-gray-700 mb-4">
            <span className="font-medium">{getAirportProvince(origin)} ({origin})</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-blue-600" />
            <span className="font-medium">{getAirportProvince(destination)} ({destination})</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendar} className="text-blue-600" />
              <span>{departureDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
              <span>{passengerCount} hành khách</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faChair} className="text-blue-600" />
              <span>{seatClass}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Price Summary Section */}
  <div className="grid grid-cols-3 gap-6 mb-8">
    {[
      { icon: faCoins, label: 'Giá thấp nhất', value: formatCurrency(minPrice), onClick: () => handlePriceClick(minPriceFlightIndex) },
      { icon: faDollarSign, label: 'Giá cao nhất', value: formatCurrency(maxPrice), onClick: () => handlePriceClick(maxPriceFlightIndex) },
      { icon: faClock, label: 'Chuyến bay ngắn nhất', value: shortestDurationFormatted }
    ].map((item, index) => (
      <button
        key={index}
        onClick={item.onClick}
        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={item.icon} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="font-semibold text-gray-800">{item.value} {item.value.includes(':') ? '' : 'VND'}</p>
          </div>
        </div>
      </button>
    ))}
  </div>

  {/* Flight List */}
  <div className="space-y-6">
    {flights.length > 0 ? (
      flights.map((flight, index) => {
        const { price, itineraries, validatingAirlineCodes } = flight;
        const airlineInfo = getAirlineInfo(validatingAirlineCodes[0]);
        const isExpanded = expandedFlightIndex === index || selectedFlightIndex === index;

        return (
          <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            {/* Flight Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {airlineInfo.logo && (
                    <img src={airlineInfo.logo} alt={airlineInfo.name} className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{airlineInfo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {itineraries[0].segments.length > 1 ? 'Có điểm dừng' : 'Bay thẳng'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(price.total * 21000)} VND
                  </p>
                  <p className="text-sm text-gray-500">/ Khách</p>
                </div>
              </div>

              {/* Flight Timeline */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800">
                    {new Date(itineraries[0].segments[0].departure.at).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{itineraries[0].segments[0].departure.iataCode}</p>
                </div>

                <div className="flex-1 mx-6">
                  <div className="relative">
                    <div className="absolute w-full top-1/2 border-t-2 border-gray-300 border-dashed"></div>
                    <div className="absolute w-full top-1/2 flex justify-center">
                      <span className="bg-white px-3 -mt-3 text-sm text-gray-500">
                        {itineraries[0].duration.replace("PT", "").toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800">
                    {new Date(itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{itineraries[0].segments[0].arrival.iataCode}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFlightClick(index)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                  <span>{isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FontAwesomeIcon icon={faTag} />
                  <span>Khuyến mãi</span>
                </button>
              </div>

              <button
                onClick={() => handleFlightSelect(index)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Chọn chuyến bay
              </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
  <div className="p-6 border-t border-gray-100">
    <div className="grid grid-cols-2 gap-6">
      {/* Flight Details Column */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Chi tiết chuyến bay</h4>
        
        <div className="flex items-start space-x-4">
          <div className="w-1/3">
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {new Date(itineraries[0].segments[0].departure.at).toLocaleTimeString([], { 
                  hour: "2-digit", 
                  minute: "2-digit" 
                })}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(itineraries[0].segments[0].departure.at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {getAirportProvince(origin)} ({origin})
              </p>
            </div>

            <div className="my-4 border-l-2 border-gray-300 h-20 ml-4"></div>

            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {new Date(itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { 
                  hour: "2-digit", 
                  minute: "2-digit" 
                })}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(itineraries[0].segments[0].arrival.at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {getAirportProvince(destination)} ({destination})
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                {airlineInfo.logo && (
                  <img src={airlineInfo.logo} alt={airlineInfo.name} className="w-8 h-8" />
                )}
                <span className="font-medium">{airlineInfo.name}</span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600" />
                  Thời gian bay: {itineraries[0].duration.replace("PT", "").toLowerCase()}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faPlane} className="mr-2 text-blue-600" />
                  {itineraries[0].segments.length > 1 ? 'Có điểm dừng' : 'Bay thẳng'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fare Details Column */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Chi tiết giá vé</h4>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá vé cơ bản</span>
            <span className="font-medium">{formatCurrency(price.total * 21000)} VND</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thuế & Phí</span>
            <span className="font-medium">Đã bao gồm</span>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Tổng cộng</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(price.total * 21000)} VND
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Giá cho {passengerCount} hành khách</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h5 className="font-medium text-gray-800">Dịch vụ bao gồm</h5>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
              Hành lý xách tay 7kg
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
              Hành lý ký gửi 23kg
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" />
              Đồ ăn trên máy bay
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}
          </div>
        );
      })
    ) : (
      <div className="text-center py-12">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">Không tìm thấy chuyến bay phù hợp.</p>
      </div>
    )}
  </div>
</main>
    </div>
  );
};

export default FlightResults;
