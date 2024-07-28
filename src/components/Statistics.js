import React, { useEffect, useState } from 'react';
import { getProvince } from '../api/callApi';
import Modal from './Modal'; // Import Modal component
import NotModal from './NotModal'; // Import NotModal component
import geojsonData from '../components/province/diaphantinh.json';

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

  const totalPages = (provinces) => {
    return Math.ceil(provinces.length / itemsPerPage);
  };

  return (
    <div className={`p-4 ${isVisitedModalOpen || isNotVisitedModalOpen ? 'map-hidden' : ''}`}>
      <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
      <div className="mb-4">
        <p>Bạn đã thăm <strong>{visitedCount}</strong> trong số <strong>{totalProvinces}</strong> tỉnh thành.</p>
        <p>Điều đó có nghĩa là bạn đã thăm <strong>{visitedPercentage}%</strong> Việt Nam.</p>
      </div>
      <div className="relative pt-1 mb-4">
        <div className="overflow-hidden h-10 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${visitedPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
          >
            <span className="text-center font-semibold">{visitedPercentage}%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg shadow cursor-pointer" onClick={() => setIsVisitedModalOpen(true)}>
          <h2 className="text-xl font-semibold mb-2">Số tỉnh thành đã thăm</h2>
          <p className="text-lg font-bold">{visitedCount}</p>
        </div>
        <div className="p-4 border rounded-lg shadow cursor-pointer" onClick={() => setIsNotVisitedModalOpen(true)}>
          <h2 className="text-xl font-semibold mb-2">Số tỉnh thành chưa thăm</h2>
          <p className="text-lg font-bold">{totalProvinces - visitedCount}</p>
        </div>
      </div>

      <Modal isOpen={isVisitedModalOpen} onClose={() => setIsVisitedModalOpen(false)} title="Tỉnh thành đã thăm">
        <div className="grid grid-cols-2 gap-4">
          {paginatedProvinces(visitedProvinces).map((province, index) => (
            <button key={index} className="p-2 border rounded bg-gray-200 hover:bg-gray-300 focus:outline-none">
              {province}
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages(visitedProvinces) }, (_, i) => (
            <button
              key={i}
              className={`mx-1 px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </Modal>

      <NotModal isOpen={isNotVisitedModalOpen} onClose={() => setIsNotVisitedModalOpen(false)} title="Tỉnh thành chưa thăm">
        <div className="grid grid-cols-2 gap-4">
          {paginatedProvinces(notVisitedProvinces).map((province, index) => (
            <button key={index} className="p-2 border rounded bg-gray-200 hover:bg-gray-300 focus:outline-none">
              {province}
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages(notVisitedProvinces) }, (_, i) => (
            <button
              key={i}
              className={`mx-1 px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </NotModal>
    </div>
  );
};

export default Statistics;
