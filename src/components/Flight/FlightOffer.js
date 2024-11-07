import React, { useState } from 'react';
import { searchFlights } from '../../api/ApiFlight';
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
    <div className="relative">
      <img 
        src="https://res.cloudinary.com/dbdl1bznw/image/upload/v1730021045/pexels-jason-toevs-1047869-2033343_bgvkio.jpg" 
        alt="Airplane interior with rows of seats" 
        className="w-full h-screen object-cover" 
      />

      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold mb-6">Tìm chuyến bay tốt nhất đến</h1>
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className=" relative flex items-center border rounded-lg p-3 w-full sm:w-1/2 lg:w-1/3 hover:shadow-lg transition-shadow duration-300">
              <i className="fas fa-map-marker-alt text-green-600 mr-3"></i>
              <input
                type="text"
                placeholder="Từ (Mã IATA)"
                value={origin}
                onChange={handleOriginChange} 
                className="focus:outline-none flex-1"
              />
              {originSuggestions.length > 0 && (
                <ul className="absolute bg-white shadow-md z-10 w-full" style={{ top: '100%', left: 0 }}>
                  {originSuggestions.map(airport => (
                    <li 
                      key={airport.code} 
                      onClick={() => {
                        setOrigin(airport.code);
                        setOriginSuggestions([]);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {airport.code} - {airport.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative flex items-center border rounded-lg p-3 w-full sm:w-1/2 lg:w-1/3 hover:shadow-lg transition-shadow duration-300">
              <i className="fas fa-map-marker-alt text-green-600 mr-3"></i>
              <input
                type="text"
                placeholder="Đến (Mã IATA)"
                value={destination}
                onChange={handleDestinationChange} 
                className="focus:outline-none flex-1"
              />
              {destinationSuggestions.length > 0 && (
                <ul className="absolute bg-white shadow-md z-10 w-full" style={{ top: '100%', left: 0 }}>
                  {destinationSuggestions.map(airport => (
                    <li 
                      key={airport.code} 
                      onClick={() => {
                        setDestination(airport.code);
                        setDestinationSuggestions([]);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {airport.code} - {airport.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center">
              <label className="mr-4">Số hành khách:</label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                className="border rounded-lg p-2"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center border rounded-lg p-3 w-full sm:w-1/2 lg:w-1/3 hover:shadow-lg transition-shadow duration-300">
                <i className="fas fa-calendar-alt text-red-600 mr-3"></i>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="focus:outline-none flex-1"
                />
              </div>
              {tripType === 'Khứ hồi' && (
                <div className="flex items-center border rounded-lg p-3 w-full sm:w-1/2 lg:w-1/3 hover:shadow-lg transition-shadow duration-300">
                  <i className="fas fa-calendar-alt text-green-600 mr-3"></i>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="focus:outline-none flex-1"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <label className="mr-4">Loại ghế:</label>
              <select
                value={seatClass}
                onChange={(e) => setSeatClass(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="Economy">Phổ thông</option>
                <option value="Business">Thương gia</option>
              </select>
            </div>
          </div>

          <div className="flex justify-around mb-6">
            {['Khứ hồi', 'Một chiều'].map((type) => (
              <button 
                key={type} 
                onClick={() => setTripType(type)} 
                className={`text-gray-700 font-medium hover:text-green-600 transition-colors duration-300 ${tripType === type ? 'text-green-600 font-bold' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          <button onClick={handleSearch} className="bg-green-700 text-white rounded-lg px-5 py-3 w-full transition hover:bg-green-800 transform hover:scale-105 duration-300">
            Tìm chuyến bay
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-white p-4 shadow-lg">
        {error && <div className="text-red-500">{error}</div>}
        {flights.length === 0 && !error ? (
          <div className="text-center">Không tìm thấy chuyến bay nào.</div>
        ) : (
          <ul>
            {flights.map((flight, index) => (
              <li key={index} className="p-2 border-b transition-transform duration-300 hover:scale-105">
                <div>
                  <strong>{flight.origin} ➜ {flight.destination}</strong>
                </div>
                <div>
                  <span>{flight.departureTime} - {flight.arrivalTime}</span>
                  <span className="ml-2">({flight.flightDuration})</span>
                </div>
                <div>
                  <span className="font-bold">{flight.price} VNĐ</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FlightOffer;
