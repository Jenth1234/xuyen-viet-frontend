import React, { useEffect, useState } from 'react';
import { getProvince } from '../../api/callApi'; // Đảm bảo đường dẫn đúng với file chứa các hàm API
import geojsonData from '../province/diaphantinh.json'; // Đảm bảo đường dẫn đúng với vị trí lưu file GeoJSON

const ProvinceList = () => {
  const [provincesData, setProvincesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        // Lấy dữ liệu trạng thái tỉnh từ API
        const response = await getProvince();
        const visitedProvinces = response.visitedProvinces.reduce((acc, province) => {
          acc[province.PROVINCE] = province.STATUS;
          return acc;
        }, {});

        // Trích xuất tên và trạng thái của các tỉnh từ dữ liệu GeoJSON
        const allProvinces = geojsonData.features.map(feature => ({
          name: feature.properties.ten_tinh,
          visited: visitedProvinces[feature.properties.ten_tinh] || false
        }));

        setProvincesData(allProvinces);
      } catch (error) {
        setError('Failed to fetch provinces');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h2>Danh Sách Tỉnh Thành</h2>
      <div style={styles.grid}>
        {provincesData.map((province, index) => (
          <div
            key={index}
            style={{
              ...styles.item,
              backgroundColor: province.visited ? '#d4a8a2' : '#f9f9f9' // Màu nâu cho các tỉnh đã thăm
            }}
          >
            {province.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '0px 20px 20px 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Chia thành 4 cột
    gap: '5px', // Giảm khoảng cách giữa các phần tử
  },
  item: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default ProvinceList;
