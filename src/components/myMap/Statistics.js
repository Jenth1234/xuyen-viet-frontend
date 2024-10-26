import React, { useEffect, useState } from 'react';
import { getProvince } from '../../api/callApi';
import geojsonData from '../province/diaphantinh.json';
import { Modal, Button, Progress, Pagination } from 'antd';

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
      <div className="mb-4">
        <p>Bạn đã thăm <strong>{visitedCount}</strong> trong số <strong>{totalProvinces}</strong> tỉnh thành.</p>
        <p>Điều đó có nghĩa là bạn đã thăm <strong>{visitedPercentage}%</strong> Việt Nam.</p>
      </div>

      <Progress percent={visitedPercentage} status="active" />

      <div className="grid grid-cols-2 gap-4">
        <Button type="primary" onClick={() => setIsVisitedModalOpen(true)}>
        đã đến : {visitedCount}
        </Button>
        <Button type="default" onClick={() => setIsNotVisitedModalOpen(true)}>
          chưa đến: {totalProvinces - visitedCount}
        </Button>
      </div>

      {/* Modal for visited provinces */}
      <Modal
        title="Tỉnh thành đã thăm"
        visible={isVisitedModalOpen}
        onCancel={() => setIsVisitedModalOpen(false)}
        footer={null}
      >
        <div className="grid grid-cols-2 gap-4">
          {paginatedProvinces(visitedProvinces).map((province, index) => (
            <Button key={index} className="p-2">
              {province}
            </Button>
          ))}
        </div>
        <Pagination
          current={currentPage}
          total={visitedProvinces.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          className="mt-4"
        />
      </Modal>

      {/* Modal for not visited provinces */}
      <Modal
        title="Tỉnh thành chưa thăm"
        visible={isNotVisitedModalOpen}
        onCancel={() => setIsNotVisitedModalOpen(false)}
        footer={null}
      >
        <div className="grid grid-cols-2 gap-4">
          {paginatedProvinces(notVisitedProvinces).map((province, index) => (
            <Button key={index} className="p-2">
              {province}
            </Button>
          ))}
        </div>
        <Pagination
          current={currentPage}
          total={notVisitedProvinces.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          className="mt-4"
        />
      </Modal>
    </div>
  );
};

export default Statistics;
