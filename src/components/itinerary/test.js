// import React, { useState, useEffect } from 'react';

// const Directions = () => {
//   const [routes, setRoutes] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Dữ liệu lịch trình cho 3 ngày, mỗi ngày có 2 địa điểm
//   const itinerary = [
//     // Ngày 1
//     [
//       { name: 'Cầu Rồng', coordinates: '108.222514,16.066688' },
//       { name: 'Ngũ Hành Sơn', coordinates: '108.269126,15.873071' }
//     ],
//     // Ngày 2
//     [
//       { name: 'Bãi biển Mỹ Khê', coordinates: '108.247679,16.053680' },
//       { name: 'The Coffee House', coordinates: '108.214828,16.051221' }
//     ],
//     // Ngày 3
//     [
//       { name: 'La Maison 1888', coordinates: '108.294661,15.987991' },
//       { name: 'Bảo tàng Chăm', coordinates: '108.215900,16.060045' }
//     ]
//   ];

//   // Hàm tính toán lộ trình giữa 2 điểm trong mỗi ngày
//   const getRouteForDay = (locations) => {
//     const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
//     const coordinates = locations.map(location => location.coordinates).join(';');
//      console.log(coordinates)
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?access_token=${accessToken}&overview=full`;

//     return fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         if (data.routes && data.routes.length > 0) {
//           const route = data.routes[0];
//           return route.legs.map((leg, index) => ({
//             from: locations[index].name,
//             to: locations[index + 1] ? locations[index + 1].name : '',
//             distance: (leg.distance / 1000).toFixed(2), // Khoảng cách tính theo km
//             duration: (leg.duration / 60).toFixed(2) // Thời gian di chuyển tính theo phút
//           }));
//         } else {
//           throw new Error('Không tìm thấy tuyến đường');
//         }
//       })
//       .catch(err => {
//         setError(err.message);
//         return [];
//       });
//   };

//   useEffect(() => {
//     const fetchAllRoutes = async () => {
//       const allRoutes = [];
//       for (const day of itinerary) {
//         const routeDetails = await getRouteForDay(day);
//         allRoutes.push(...routeDetails);
//       }
//       setRoutes(allRoutes);
//       setLoading(false);
//     };

//     fetchAllRoutes();
//   }, []);

//   return (
//     <div>
//       <h2>Thông tin di chuyển</h2>
//       {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
//       {loading ? (
//         <p>Đang tải thông tin...</p>
//       ) : (
//         <div>
//           {itinerary.map((day, dayIndex) => (
//             <div key={dayIndex}>
//               <h3>Ngày {dayIndex + 1}</h3>
//               {routes
//                 .filter(route => day.some(location => location.name === route.from))
//                 .map((route, index) => (
//                   <div key={index}>
//                     <p><strong>Điểm xuất phát:</strong> {route.from}</p>
//                     <p><strong>Điểm đến:</strong> {route.to}</p>
//                     <p><strong>Khoảng cách:</strong> {route.distance} km</p>
//                     <p><strong>Thời gian di chuyển:</strong> {route.duration} phút</p>
//                     <hr />
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Directions;
