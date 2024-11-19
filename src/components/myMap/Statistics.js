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
  const itemsPerPage = 20;
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
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-inner">
          <FontAwesomeIcon icon={faChartPie} className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Thống kê chuyến đi
        </h2>
      </div>
  
      {/* Stats Summary */}
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{visitedCount}</div>
            <div className="text-sm font-medium text-gray-600">Đã đến</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-4xl font-bold text-gray-600 mb-2">{totalProvinces - visitedCount}</div>
            <div className="text-sm font-medium text-gray-600">Chưa đến</div>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="mt-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Tiến độ khám phá</span>
            <span className="text-sm font-bold text-blue-600">{visitedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${visitedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setIsVisitedModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
          <span className="font-medium">Đã đến ({visitedCount})</span>
        </button>
        
        <button
          onClick={() => setIsNotVisitedModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg 
            hover:bg-gray-100 transition-all duration-300 border border-gray-200 hover:border-gray-300"
        >
          <FontAwesomeIcon icon={faMapMarker} className="text-lg" />
          <span className="font-medium">Chưa đến ({totalProvinces - visitedCount})</span>
        </button>
      </div>
  
      {/* Modals */}
      <Modal
        title={
          <div className="flex items-center space-x-2 px-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
            <span className="font-bold text-gray-800">Tỉnh thành đã thăm</span>
          </div>
        }
        visible={isVisitedModalOpen}
        onCancel={() => setIsVisitedModalOpen(false)}
        footer={null}
        className="rounded-xl overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-3 p-2">
          {paginatedProvinces(visitedProvinces).map((province, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg text-center text-blue-700 
                font-medium hover:from-blue-100 hover:to-blue-50 transition-all duration-300 cursor-pointer
                transform hover:-translate-y-0.5 border border-blue-100"
            >
              {province}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={visitedProvinces.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      </Modal>
  
      <Modal
        title={
          <div className="flex items-center space-x-2 px-2">
            <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
            <span className="font-bold text-gray-800">Tỉnh thành chưa thăm</span>
          </div>
        }
        visible={isNotVisitedModalOpen}
        onCancel={() => setIsNotVisitedModalOpen(false)}
        footer={null}
        className="rounded-xl overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-3 p-2">
          {paginatedProvinces(notVisitedProvinces).map((province, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg text-center text-gray-700 
                font-medium hover:from-gray-100 hover:to-gray-50 transition-all duration-300 cursor-pointer
                transform hover:-translate-y-0.5 border border-gray-200"
            >
              {province}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={notVisitedProvinces.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Statistics;
