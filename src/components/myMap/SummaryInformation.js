import React, { useEffect, useState } from 'react';
import { getUserInfo, getProvince } from '../../api/callApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faCompass,
  faCamera,
  faMapPin
} from '@fortawesome/free-solid-svg-icons';

const SummaryInformation = () => {
  const [userData, setUserData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResponse, provinceResponse] = await Promise.all([
          getUserInfo(),
          getProvince()
        ]);

        setUserData(userResponse.data);

        const tripData = provinceResponse.visitedProvinces
          .filter(province => province.PHOTOS && province.PHOTOS.length > 0)
          .map(province => ({
            province: province.PROVINCE,
            latestDate: new Date(Math.max(...province.PHOTOS.map(photo => 
              new Date(photo.UPLOAD_DATE)
            ))),
            photoCount: province.PHOTOS.length
          }))
          .sort((a, b) => b.latestDate - a.latestDate)
          .slice(0, 5);

        setTrips(tripData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* User Info */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={userData?.avatar || 'https://via.placeholder.com/150'} 
              alt={`${userData?.fullName}'s avatar`} 
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {userData?.fullName || 'Chưa cập nhật'}
          </h3>
        </div>
      </div>

      {/* Journey Timeline */}
      {trips.length > 0 && (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faCompass} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-700">Hành trình khám phá</h4>
          </div>
          
          <div className="relative pl-8 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>

            {trips.map((trip, index) => (
              <div 
                key={index}
                className="relative"
              >
                {/* Timeline dot with ripple effect */}
                <div className="absolute left-[-23px] w-6 h-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  <div className="relative w-6 h-6 bg-white rounded-full border-2 border-blue-500 
                    flex items-center justify-center z-10">
                    <FontAwesomeIcon icon={faMapPin} className="text-xs text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm 
                  hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800 flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mr-2" />
                      {trip.province}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-400" />
                      {trip.latestDate.toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <FontAwesomeIcon icon={faCamera} className="mr-2 text-blue-400" />
                    {trip.photoCount} khoảnh khắc
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryInformation;