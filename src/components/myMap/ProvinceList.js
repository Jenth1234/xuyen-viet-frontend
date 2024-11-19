import React, { useEffect, useState } from 'react';
import { getProvince } from '../../api/callApi';
import geojsonData from '../province/diaphantinh.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { 
  faMapMarkedAlt,
  faCheckCircle,
  faSpinner,
  faExclamationCircle,
  faMapMarker, 
  faLocationDot,
  faCheck 
} from "@fortawesome/free-solid-svg-icons";

const ProvinceList = () => {
  const [provincesData, setProvincesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvince();
        const visitedProvinces = response.visitedProvinces.reduce((acc, province) => {
          acc[province.PROVINCE] = province.STATUS;
          return acc;
        }, {});

        const allProvinces = geojsonData.features.map(feature => ({
          name: feature.properties.ten_tinh,
          visited: visitedProvinces[feature.properties.ten_tinh] || false
        }));

        setProvincesData(allProvinces);
      } catch (error) {
        setError('Không thể tải danh sách tỉnh thành');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <FontAwesomeIcon 
          icon={faSpinner} 
          className="text-blue-500 text-3xl animate-spin" 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-red-500">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  // Tách provinces thành đã thăm và chưa thăm
  const visitedProvinces = provincesData.filter(p => p.visited);
  const notVisitedProvinces = provincesData.filter(p => !p.visited);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faMapMarkedAlt} className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Danh Sách Tỉnh Thành</h2>
          <p className="text-sm text-gray-500">
            Đã thăm {visitedProvinces.length}/{provincesData.length} tỉnh thành
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="space-y-6">
        {/* Visited Provinces */}
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Đã thăm
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {visitedProvinces.map((province, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg 
                  border border-green-100 shadow-sm hover:shadow-md transition-all duration-300
                  transform hover:-translate-y-0.5"
              >
                <p className="text-center font-medium text-green-700">
                  {province.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Not Visited Provinces */}
        <div className="mt-8">
  {/* Section Header */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faMapMarker} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">
        Chưa thăm
      </h3>
    </div>
    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
      {notVisitedProvinces.length} tỉnh thành
    </span>
  </div>

  {/* Provinces Grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {notVisitedProvinces.map((province, index) => (
      <div
        key={index}
        className="group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-gray-900/10 
          group-hover:from-gray-800/10 group-hover:to-gray-900/20 transition-all duration-300 rounded-xl">
        </div>
        
        <div className="relative p-4 bg-white rounded-xl border border-gray-100 
          shadow-sm group-hover:shadow-md transition-all duration-300
          transform group-hover:-translate-y-1">
          
          <div className="flex items-center justify-between mb-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <FontAwesomeIcon 
              icon={faLocationDot} 
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </div>

          <p className="text-center font-medium text-gray-600 group-hover:text-gray-800 
            transition-colors line-clamp-2">
            {province.name}
          </p>

          <div className="mt-2 text-xs text-center text-gray-400 group-hover:text-gray-500">
            Chưa khám phá
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Empty State */}
  {notVisitedProvinces.length === 0 && (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">
        <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-500" />
      </div>
      <p className="text-gray-500">Bạn đã thăm tất cả các tỉnh thành!</p>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default ProvinceList;