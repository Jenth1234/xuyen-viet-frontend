import React, { useState } from 'react';
import { searchFlights } from '../api/callApi'; // Giả sử các hàm API của bạn nằm trong file api.js

const FlightOffer = () => {
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const results = await searchFlights(origin, destination, departureDate);
      // Kiểm tra dữ liệu kết quả và đảm bảo nó là mảng
      setFlights(Array.isArray(results) ? results : []);
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm chuyến bay.');
      console.error('Error searching flights:', err);
    }
  };

  return (
    <div className="flight-search-container">
      <h1>Flight Search</h1>
      
      <div className="search-form">
        <input
          type="text"
          placeholder="Origin (IATA code)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination (IATA code)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        <button onClick={handleSearch}>Search Flights</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="flight-results">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div key={index} className="flight-offer">
              <h2>Flight Offer {flight.id}</h2>
              <p>From: {flight.itineraries[0].segments[0].departure.iataCode}</p>
              <p>To: {flight.itineraries[0].segments[0].arrival.iataCode}</p>
              <p>Departure: {flight.itineraries[0].segments[0].departure.at}</p>
              <p>Arrival: {flight.itineraries[0].segments[0].arrival.at}</p>
              <p>Duration: {flight.itineraries[0].segments[0].duration}</p>
              <p>Price: {flight.price.total} {flight.price.currency}</p>
            </div>
          ))
        ) : (
          <p>No flights found.</p>
        )}
      </div>
    </div>
  );
};

export default FlightOffer;
