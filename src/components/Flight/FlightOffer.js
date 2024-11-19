import React, { useState } from 'react';
import { searchFlights } from '../../api/ApiFlight';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faPlaneDeparture,
  faPlaneArrival,
  faCalendar,
  faMapMarkerAlt,
  faExchangeAlt,
  faSearch,
  faExclamationCircle,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import airportsData from '../../data/Flight.json'; // Đường dẫn đến file JSON
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const FlightOffer = () => {
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatClass, setSeatClass] = useState('Economy');
  const [error, setError] = useState('');
  const [tripType, setTripType] = useState('Khứ hồi');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);


  const navigate = useNavigate(); // Khai báo useNavigate
  const handleSearch = async () => {
    try {
      const results = await searchFlights(origin, destination, departureDate, returnDate, passengerCount, seatClass);
      setFlights(Array.isArray(results) ? results : []);
  
      // Tạo đối tượng chứa thông tin chuyến bay
      const flightInfo = {
        origin,
        destination,
        departureDate,
        returnDate,
        passengerCount,
        seatClass,
        flights: results // Thêm kết quả chuyến bay vào đối tượng
      };
  
      // Chuyển đến trang mới với toàn bộ thông tin chuyến bay
      navigate('/flight-list', { state: flightInfo }); // Thay '/flight-results' bằng đường dẫn trang kết quả bạn muốn
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm chuyến bay.');
      console.error('Error searching flights:', err);
    }
  };
  

  const handleOriginChange = (e) => {
    const input = e.target.value;
    if (Array.isArray(airportsData.airports)) {
      const suggestions = airportsData.airports.filter(airport => 
        airport.code.startsWith(input.toUpperCase())
      );
      setOriginSuggestions(suggestions);
    } else {
      console.error('airportsData.airports is not an array');
    }
    setOrigin(input);
  };
  
  const handleDestinationChange = (e) => {
    const input = e.target.value;
    if (Array.isArray(airportsData.airports)) {
      const suggestions = airportsData.airports.filter(airport => 
        airport.code.startsWith(input.toUpperCase())
      );
      setDestinationSuggestions(suggestions);
    } else {
      console.error('airportsData.airports is not an array');
    }
    setDestination(input);
  };
  

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0">
        <img 
          src="https://res.cloudinary.com/dbdl1bznw/image/upload/v1730021045/pexels-jason-toevs-1047869-2033343_bgvkio.jpg" 
          alt="Airplane interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-sm" />
      </div>
  
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-white text-5xl font-bold text-center mb-8">
          Tìm Chuyến Bay Tốt Nhất
          <div className="h-1 w-32 bg-green-500 mx-auto mt-4 rounded-full" />
        </h1>
  
        {/* Search Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          {/* Trip Type Selection */}
          <div className="flex justify-center mb-8 space-x-6">
            {['Khứ hồi', 'Một chiều'].map((type) => (
              <button 
                key={type} 
                onClick={() => setTripType(type)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 
                  ${tripType === type 
                    ? 'bg-green-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FontAwesomeIcon icon={type === 'Khứ hồi' ? faExchangeAlt : faPlane} className="mr-2" />
                {type}
              </button>
            ))}
          </div>
  
          {/* Location Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Origin */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đi</label>
              <div className="relative">
                <FontAwesomeIcon icon={faPlaneDeparture} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
                <input
                  type="text"
                  placeholder="Từ (Mã IATA)"
                  value={origin}
                  onChange={handleOriginChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {originSuggestions.length > 0 && (
                  <ul className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                    {originSuggestions.map(airport => (
                      <li 
                        key={airport.code}
                        onClick={() => {
                          setOrigin(airport.code);
                          setOriginSuggestions([]);
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">{airport.code}</div>
                          <div className="text-sm text-gray-600">{airport.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
  
            {/* Destination - Similar structure to Origin */}
          {/* Destination */}
<div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
  <div className="relative">
    <FontAwesomeIcon 
      icon={faPlaneArrival} 
      className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" 
    />
    <input
      type="text"
      placeholder="Đến (Mã IATA)"
      value={destination}
      onChange={handleDestinationChange}
      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
    {destinationSuggestions.length > 0 && (
      <ul className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
        {destinationSuggestions.map(airport => (
          <li 
            key={airport.code}
            onClick={() => {
              setDestination(airport.code);
              setDestinationSuggestions([]);
            }}
            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center group"
          >
            <FontAwesomeIcon 
              icon={faMapMarkerAlt} 
              className="mr-3 text-green-600 group-hover:scale-110 transition-transform duration-200" 
            />
            <div>
              <div className="font-medium group-hover:text-green-600 transition-colors duration-200">
                {airport.code}
              </div>
              <div className="text-sm text-gray-600">
                {airport.name}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
          </div>
  
          {/* Dates and Passenger Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đi</label>
              <div className="relative">
                <FontAwesomeIcon icon={faCalendar} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
  
            {tripType === 'Khứ hồi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày về</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faCalendar} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hành khách & Hạng ghế</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} người</option>
                  ))}
                </select>
  
                <select
                  value={seatClass}
                  onChange={(e) => setSeatClass(e.target.value)}
                  className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Economy">Phổ thông</option>
                  <option value="Business">Thương gia</option>
                </select>
              </div>
            </div>
          </div>
  
          {/* Search Button */}
          <button 
            onClick={handleSearch} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg 
              transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Tìm Chuyến Bay
          </button>
        </div>
  
        {/* Results Section */}
        {(flights.length > 0 || error) && (
          <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            {error ? (
              <div className="text-red-500 text-center py-4">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kết quả tìm kiếm</h2>
                {flights.map((flight, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 
                      transform hover:scale-[1.02] cursor-pointer bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={faPlane} className="text-2xl text-green-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-800">
                            {flight.origin} ➜ {flight.destination}
                          </div>
                          <div className="text-sm text-gray-600">
                            {flight.departureTime} - {flight.arrivalTime} ({flight.flightDuration})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(flight.price)}
                        </div>
                        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                          transition-colors duration-200">
                          Chọn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightOffer;
