import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAttraction } from '../../api/callApi'; // Hàm gọi API để lấy tất cả các tỉnh

const Explore = () => {
  const [provinces, setProvinces] = useState([]);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    // Fetch all provinces data when component mounts
    const fetchData = async () => {
      try {
        const data = await getAllAttraction();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProvinceClick = (provinceId, provinceName) => {
    navigate(`/attraction/${provinceId}`, { state: { name: provinceName } }); // Điều hướng đến trang chi tiết tỉnh với tên tỉnh
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {provinces.map((province) => (
        <div key={province._id} className="mb-12">
          <h1
            className="text-4xl font-bold mb-4 cursor-pointer"
            onClick={() => handleProvinceClick(province._id, province.name)} // Truyền ID và tên tỉnh
          >
            {province.name}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Explore;
