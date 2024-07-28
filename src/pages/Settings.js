import React, { useState, useEffect } from 'react';
import { getUserSettings, editUserSettings } from '../api/callApi'; // Import đúng hàm
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    language: 'en',
    textSize: 'medium',
    customTheme: 'default',
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const settings = await getUserSettings(token); // Gọi hàm getUserSettings
        setUserSettings({
          theme: settings.THEME || 'light',
          language: settings.LANGUAGE || 'en',
          textSize: settings.TEXT_SIZE || 'medium',
          customTheme: settings.CUSTOM_THEME || 'default',
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cài đặt người dùng:', error.response?.data || error.message);
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
      await editUserSettings(token, {
        THEME: userSettings.theme,
        LANGUAGE: userSettings.language,
        TEXT_SIZE: userSettings.textSize,
        CUSTOM_THEME: userSettings.customTheme,
      });
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
      alert('Lỗi khi lưu cài đặt. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cài đặt giao diện</h1>
        
        <div className="mb-6">
          <label className="block mb-2">
            <span className="text-gray-700">Chế độ:</span>
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
          <label className="block mb-2">
            <span className="text-gray-700">Ngôn ngữ:</span>
            <select
              name="language"
              value={userSettings.language}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">Tiếng Anh</option>
              <option value="vi">Tiếng Việt</option>
              <option value="fr">Tiếng Pháp</option>
              <option value="es">Tiếng Tây Ban Nha</option>
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Kích thước văn bản:</span>
            <select
              name="textSize"
              value={userSettings.textSize}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Nhỏ</option>
              <option value="medium">Trung bình</option>
              <option value="large">Lớn</option>
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Chủ đề:</span>
            <select
              name="customTheme"
              value={userSettings.customTheme}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Mặc định</option>
              <option value="blue">Xanh dương</option>
              <option value="red">Đỏ</option>
              <option value="green">Xanh lá cây</option>
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

export default Settings;
