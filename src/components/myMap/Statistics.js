import React, { useEffect, useState } from 'react';
import { getProvince } from '../../api/callApi';
import geojsonData from '../province/diaphantinh.json';
import { Modal, Pagination } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faMapMarkerAlt,
  faMapMarker
} from "@fortawesome/free-solid-svg-icons";

const Statistics = () => {
  const [visitedCount, setVisitedCount] = useState(0);
  const [visitedProvinces, setVisitedProvinces] = useState([]);
  const [notVisitedProvinces, setNotVisitedProvinces] = useState([]);
  const [isVisitedModalOpen, setIsVisitedModalOpen] = useState(false);
  const [isNotVisitedModalOpen, setIsNotVisitedModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalProvinces = 63;

  useEffect(() => {
    const fetchVisitedProvinces = async () => {
      try {
        const data = await getProvince();
        if (data && Array.isArray(data.visitedProvinces)) {
          const uniqueVisitedProvinces = data.visitedProvinces.reduce((acc, province) => {
            if (province.STATUS && !acc.includes(province.PROVINCE)) {
              acc.push(province.PROVINCE);
            }
            return acc;
          }, []);
          const allProvinces = geojsonData.features.map(feature => feature.properties.ten_tinh);
          const uniqueNotVisitedProvinces = allProvinces.filter(province => !uniqueVisitedProvinces.includes(province));

          setVisitedCount(uniqueVisitedProvinces.length);
          setVisitedProvinces(uniqueVisitedProvinces);
          setNotVisitedProvinces(uniqueNotVisitedProvinces);
        } else {
          console.error('Data.visitedProvinces is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching visited provinces:', error);
      }
    };

    fetchVisitedProvinces();
  }, []);

  const visitedPercentage = ((visitedCount / totalProvinces) * 100).toFixed(2);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedProvinces = (provinces) => {
    return provinces.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-500">
        {/* Header với animation */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl 
            flex items-center justify-center shadow-lg transform hover:rotate-12 transition-all duration-300">
            <FontAwesomeIcon icon={faChartPie} className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Thống kê chuyến đi
            </h2>
            <p className="text-gray-500 mt-1">Theo dõi hành trình khám phá Việt Nam của bạn</p>
          </div>
        </div>

        {/* Stats Cards với animation */}
        <div className="grid grid-cols-2 gap-6 mb-8">
       

         
        </div>

        {/* Progress Bar với animation */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8
          transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Hành trình khám phá</h3>
            <span className="text-2xl font-bold text-blue-600">{visitedPercentage}%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full
                transition-all duration-1000 ease-out"
              style={{ 
                width: `${visitedPercentage}%`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            />
          </div>
        </div>

        {/* Action Buttons với hover effects */}
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => setIsVisitedModalOpen(true)}
            className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
              transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
              translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <div className="relative flex items-center justify-center space-x-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
              <span className="text-lg font-semibold">Đã khám phá ({visitedCount})</span>
            </div>
          </button>

          <button
            onClick={() => setIsNotVisitedModalOpen(true)}
            className="group relative px-6 py-4 bg-gray-100 text-gray-700 rounded-xl 
              overflow-hidden border-2 border-gray-200 hover:border-gray-300
              transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gray-200/50 transform -skew-x-12 
              translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <div className="relative flex items-center justify-center space-x-3">
              <FontAwesomeIcon icon={faMapMarker} className="text-xl" />
              <span className="text-lg font-semibold">Chờ khám phá ({totalProvinces - visitedCount})</span>
            </div>
          </button>
        </div>

        {/* Modals với UI cải tiến */}
        <Modal
          title={
            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Tỉnh thành đã thăm</h3>
                <p className="text-sm text-gray-500">Danh sách {visitedCount} địa điểm đã khám phá</p>
              </div>
            </div>
          }
          open={isVisitedModalOpen}
          onCancel={() => setIsVisitedModalOpen(false)}
          footer={null}
          width={900}
          className="rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-4 p-4">
            {paginatedProvinces(visitedProvinces).map((province, index) => (
              <div
                key={index}
                className="group p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl
                  border border-blue-100 hover:border-blue-300
                  transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center
                      group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300
                      truncate">
                      {province}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center pb-4">
            <Pagination
              current={currentPage}
              total={visitedProvinces.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Modal>

        {/* Modal cho tỉnh chưa thăm */}
        <Modal
          title={
            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faMapMarker} className="text-gray-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Tỉnh thành chưa thăm</h3>
                <p className="text-sm text-gray-500">
                  Còn {totalProvinces - visitedCount} địa điểm chờ khám phá
                </p>
              </div>
            </div>
          }
          open={isNotVisitedModalOpen}
          onCancel={() => setIsNotVisitedModalOpen(false)}
          footer={null}
          width={900}
          className="rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-4 p-4">
            {paginatedProvinces(notVisitedProvinces).map((province, index) => (
              <div
                key={index}
                className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl
                  border border-gray-200 hover:border-gray-400
                  transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center
                      group-hover:bg-gray-200 transition-colors duration-300 flex-shrink-0">
                      <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300
                      truncate">
                      {province}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center pb-4">
            <Pagination
              current={currentPage}
              total={notVisitedProvinces.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Statistics;
