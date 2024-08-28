import React, { useEffect, useState } from 'react';
import { getUserInfo, getProvince } from '../../api/callApi'; // Giả sử có một API call cho việc này

const SummaryInformation = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [totalVisited, setTotalVisited] = useState(0);
  const [totalNotVisited, setTotalNotVisited] = useState(0);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvince(); // Lấy danh sách tất cả tỉnh thành
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const data = await getUserInfo(token);
          setUserData(data);

          // Tính số tỉnh thành đã thăm
          const visitedCount = data.visitedProvinces.filter(province => province.STATUS).length;

          // Tính số tỉnh thành chưa thăm
          const notVisitedCount = provinces.length - visitedCount;

          setTotalVisited(visitedCount);
          setTotalNotVisited(notVisitedCount);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [token, provinces]);

  if (!userData || provinces.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img 
          src={userData.avatar || 'https://via.placeholder.com/150'} 
          alt={`${userData.fullName}'s avatar`} 
          className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{userData.fullName}</h3>
          <p className="text-gray-600">Số tỉnh thành đã thăm: {totalVisited}</p>
          <p className="text-gray-600">Số tỉnh thành chưa thăm: {totalNotVisited}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryInformation;
