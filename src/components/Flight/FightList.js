import React, { useState } from "react";
import { useLocation,useNavigate   } from "react-router-dom";
import data from "../../data/Flight.json"; // Đường dẫn chính xác đến tệp JSON


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
      <aside className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-xl font-semibold mb-4">Bộ lọc chuyến bay</h2>

        <div>
          <h3 className="font-medium">Hạng ghế</h3>
          <ul>
            <li>
              <input type="checkbox" /> Phổ thông
            </li>
            <li>
              <input type="checkbox" /> Thương gia
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Giá</h3>
          <input type="range" min="0" max="1000" className="w-full" />
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Hãng hàng không</h3>
          <ul>
            <li>
              <input type="checkbox" /> Hãng 1
            </li>
            <li>
              <input type="checkbox" /> Hãng 2
            </li>
            <li>
              <input type="checkbox" /> Hãng 3
            </li>
          </ul>
        </div>

        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Áp dụng bộ lọc
        </button>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-grow p-6">
      <div className="relative mb-6">
        <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dbdl1bznw/image/upload/v1730281326/chuyenbay_awkccw.jpg')" }}
  />
  <div className="border border-gray-300 p-6 rounded-lg shadow-lg relative z-10 bg-white bg-opacity-40 rounded-lg">
    <h1 className="text-3xl font-bold mb-4">Kết quả tìm kiếm chuyến bay</h1>
    <h2 className="text-xl font-semibold mb-2">
      {getAirportProvince(origin)} ({origin}) ➜ {getAirportProvince(destination)} ({destination})
    </h2>
    <div className="flex flex-wrap text-lg mb-1">  
      <span className="mr-4">Ngày khởi hành: <span className="font-medium">{departureDate}</span></span>
      <span className="mr-4">Số hành khách: <span className="font-medium">{passengerCount}</span></span>
      <span>Hạng ghế: <span className="font-medium">{seatClass}</span></span>
    </div>
    
 
   
    
        </div>
      </div>

      <div>   

        {/* Thêm phần hiển thị giá */}
   <div className="mt-4 flex   flex-wrap space-x-4">
  <button
    className="px-4 py-2  rounded-lg border  hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => handlePriceClick(minPriceFlightIndex)}>
    Thấp nhất: <span className="font-medium">{formatCurrency(minPrice)} VND</span>
  </button>
  
  <button
    className="px-4 py-2   rounded-lg border  hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => handlePriceClick(maxPriceFlightIndex)}>
    Cao nhất: <span className="font-medium">{formatCurrency(maxPrice)} VND</span>
  </button>
  
  <span className=" px-4 py-2 t  rounded-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Ngắn nhất: <span className="font-medium">{shortestDurationFormatted}</span>
  </span>
</div>


 



    <div>
      <h3 className="text-lg font-semibold">Tất cả chuyến bay:</h3>
      {flights.length > 0 ? (
        <ul className="space-y-4">
          {flights.map((flight, index) => {
            const { price, itineraries, validatingAirlineCodes } = flight;
            const { total, currency } = price;

            const airlineInfo = getAirlineInfo(validatingAirlineCodes[0]);
            const departureAirport = itineraries[0].segments[0].departure.iataCode;
            const arrivalAirport = itineraries[0].segments[0].arrival.iataCode;

            const isExpanded = expandedFlightIndex === index || selectedFlightIndex === index;

            return (
              <li key={index} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {airlineInfo.logo && (
                      <img src={airlineInfo.logo} alt={airlineInfo.name} className="w-10 h-10 mr-2" />
                    )}
                    <strong className="text-lg">{airlineInfo.name}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-xl text-orange">{formatCurrency(total*21000)} VND</span>
                    <span className="text-base">{`/Khách`}</span>
                  </div>
                </div>

                <div className="mt-2 flex text-gray-600 justify-center items-center pr-5 mr-5">
                  <div>
                    <span>{departureAirport}</span>
                    <span className="ml-2">
                      {new Date(itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="text-center mx-2">
                    <div className="font-semibold text-gray-700">
                      {itineraries[0].duration.replace("PT", "").toLowerCase()}
                    </div>
                    <hr className="my-2 border-t border-gray-300" />
                    <div className="text-gray-500">
                      {itineraries[0].segments.length > 1 ? "Dừng chuyển" : "Thẳng"}
                    </div>
                  </div>

                  <div style={{ marginLeft: "20px" }}>
                    <span>{arrivalAirport}</span>
                    <span className="mr-10">
                      {new Date(itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <button
                      className="py-1 px-2 rounded"
                      onClick={() => handleFlightClick(index)}
                    >
                      {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </button>

                    <button className="ml-4 text-black py-1 px-4 rounded transition">
                      Khuyến mãi
                    </button>
                  </div>

                  <div className="flex items-center">
                    <button
                      className="bg-green-500 text-white py-1 px-4 rounded shadow hover:bg-green-600 transition mr-2"
                      onClick={() => handleFlightSelect(index)}
                    >
                      Chọn
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 p-4 rounded grid grid-cols-2 gap-4">
                    <div className="flex">
                      <div className="border-r border-black aside p-1 bg-white hover:shadow-lg transition-shadow duration-300 w-1/4 flex flex-col justify-between h-full">
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-sm">
                              {new Date(itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-sm">
                              {new Date(itineraries[0].segments[0].departure.at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex-grow flex items-center">
                            <p className="text-sm">
                              {itineraries[0].duration.replace("PT", "").toLowerCase()}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm">
                              {new Date(itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-sm">
                              {new Date(itineraries[0].segments[0].arrival.at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow ml-2 bg-white hover:shadow-lg transition-shadow duration-300 border-l border-black aside p-4">

  
  {/* Thông tin về sân bay */}
  <p className="text-sm mb-2">
    {getAirportProvince(origin)} ({origin})
  </p>
  
  {/* Thông tin hãng hàng không */}
  <div className="flex items-center mb-4">
    {airlineInfo.logo && (
      <img src={airlineInfo.logo} alt={airlineInfo.name} className="w-10 h-10 mr-2" />
    )}
    <span className="font-medium">{airlineInfo.name}</span>
  </div>

  {/* Hiển thị thông tin từng đoạn chuyến bay */}
  {itineraries[0].segments.map((segment, segmentIndex) => (
    <div key={segmentIndex} className="mb-2">
      
   
    </div>
  ))}
  
  {/* Thông tin bổ sung */}
  <p className="text-sm">
    {/* <span className="font-medium">Mã chuyến bay:</span> {flightCode} */}
  </p>
  <p className="flex items-center mt-2">
        <i className="fas fa-suitcase mr-2"></i> {/* Biểu tượng hành lý */}
        Hành lý: 7kg (mặc định)
      </p>
  <p className="text-sm">
    <span className="font-medium">Loại ghế:</span> {seatClass}
  </p>
  <p className="text-sm">
    <span className="font-medium">Hành lý:</span> 23 kg
  </p>
  <p className="flex items-center">
        <i className="fas fa-tv mr-2"></i> {/* Biểu tượng TV */}
        Giải trí: Mặc định
      </p>
  <p className="text-sm mb-2">
     {getAirportProvince(destination)} ({destination})
  </p>
</div>

                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Không có chuyến bay nào phù hợp với tìm kiếm của bạn.</p>
      )}
    </div>
  </div>
      </main>
    </div>
  );
};

export default FlightResults;
