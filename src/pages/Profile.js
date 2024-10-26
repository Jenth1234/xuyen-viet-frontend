import React, { useState, useEffect } from 'react';
import { getUserInfo, editUserInfo } from '../api/callApi';
import NavBar from '../components/nav/NavBar';

const Profile = () => {
  const [userSettings, setUserSettings] = useState({
    username: '',
    email: '',
    fullname: '',
    address: '',
    gender: '',
    theme: 'light',
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = await getUserInfo(token);
        setUserSettings({
          username: userData.username,
          email: userData.email,
          fullname: userData.fullName,
          address: userData.address,
          gender: userData.gender,
          theme: 'light',
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error.response?.data || error.message);
      }
    };

    fetchUserSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const updatedUserSettings = {
        USERNAME: userSettings.username,
        EMAIL: userSettings.email,
        FULLNAME: userSettings.fullname,
        ADDRESS: userSettings.address,
        GENDER: userSettings.gender,
        THEME: userSettings.theme,
      };
      await editUserInfo(token, updatedUserSettings);
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
      alert('Lỗi khi lưu cài đặt. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <NavBar />
      <div className="flex-1 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cài đặt</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Thông tin người dùng</h2>
          <label className="block mb-2">
            <span className="text-gray-700">Tên người dùng:</span>
            <input
              type="text"
              name="username"
              value={userSettings.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              name="email"
              value={userSettings.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Tên đầy đủ:</span>
            <input
              type="text"
              name="fullname"
              value={userSettings.fullname}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Địa chỉ:</span>
            <input
              type="text"
              name="address"
              value={userSettings.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Giới tính:</span>
            <select
              name="gender"
              value={userSettings.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </label>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tùy chọn giao diện</h2>
          <label className="block mb-2">
            <span className="text-gray-700">Giao diện:</span>
            <select
              name="theme"
              value={userSettings.theme}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Sáng</option>
              <option value="dark">Tối</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default Profile;
