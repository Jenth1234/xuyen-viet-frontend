import React, { useEffect, useState } from 'react';
import { getProvince } from '../api/callApi';
import geojsonData from '../components/province/diaphantinh.json';

const NotModal = ({ isOpen, onClose, title }) => {
  const [provincesData, setProvincesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

        const notVisitedProvinces = allProvinces.filter(province => !province.visited);

        setProvincesData(notVisitedProvinces);
      } catch (error) {
        setError('Failed to fetch provinces');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (!isOpen) return null;

  const totalPages = Math.ceil(provincesData.length / itemsPerPage);

  const paginatedProvinces = provincesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 m-4 z-60" style={{ marginRight: '70px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-200 focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div style={styles.grid}>
          {paginatedProvinces.map((province, index) => (
            <div
              key={index}
              style={{
                ...styles.item,
                backgroundColor: province.visited ? '#d4a8a2' : '#f9f9f9'
              }}
            >
              {province.name}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`mx-1 px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Chia thành 2 cột
    gap: '10px',
  },
  item: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default NotModal;
