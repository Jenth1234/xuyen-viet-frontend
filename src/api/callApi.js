import axios from 'axios';

// URL của API backend
const API_URL = 'http://localhost:3600';

/**
 * Gửi yêu cầu POST để lưu tỉnh và trạng thái
 * @param {string} PROVINCE - Tên tỉnh
 * @param {boolean} STATUS - Trạng thái của tỉnh (active/inactive)
 * @returns {Promise} - Trả về promise từ axios
 */
export const saveProvince = async (PROVINCE, STATUS) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/province/create`, {
      PROVINCE,
      STATUS
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving province:', error);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để lấy thông tin các tỉnh
 * @returns {Promise} - Trả về promise từ axios
 */
export const getProvince = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/province/getVisited`, null, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để đăng nhập người dùng
 * @param {string} USERNAME - Tên đăng nhập
 * @param {string} PASSWORD - Mật khẩu
 * @returns {Promise} - Trả về promise từ axios
 */
export const loginUser = async (USERNAME, PASSWORD) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      USERNAME,
      PASSWORD
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để lấy thông tin người dùng
 * @param {string} token - Token xác thực
 * @returns {Promise} - Trả về promise từ axios
 */
export const getUserInfo = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/user/info`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để chỉnh sửa thông tin người dùng
 * @param {string} token - Token xác thực
 * @param {Object} userInfo - Thông tin người dùng cần chỉnh sửa
 * @returns {Promise} - Trả về promise từ axios
 */
export const editUserInfo = async (token, userInfo) => {
  try {
    const response = await axios.post(`${API_URL}/user/edit`, userInfo, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để lấy thông tin cài đặt người dùng
 * @param {string} token - Token xác thực
 * @returns {Promise} - Trả về promise từ axios
 */
export const getUserSettings = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/user/settings`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để cập nhật thông tin cài đặt người dùng
 * @param {string} token - Token xác thực
 * @param {Object} settings - Cài đặt người dùng cần cập nhật
 * @returns {Promise} - Trả về promise từ axios
 */
export const editUserSettings = async (token, settings) => {
  try {
    const response = await axios.post(`${API_URL}/user/editSettings`, settings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Gửi yêu cầu POST để đăng ký người dùng
 * @param {string} USERNAME - Tên đăng nhập
 * @param {string} PASSWORD - Mật khẩu
 * @param {string} EMAIL - Email
 * @returns {Promise} - Trả về promise từ axios
 */
/**
 * Gửi yêu cầu POST để đăng ký người dùng
 * @param {string} USERNAME - Tên đăng nhập
 * @param {string} PASSWORD - Mật khẩu
 * @param {string} GENDER - Giới tính
 * @param {string} ADDRESS - Địa chỉ
 * @param {string} FULLNAME - Họ và tên
 * @param {string} EMAIL - Email
 * @returns {Promise} - Trả về promise từ axios
 */
export const registerUser = async (USERNAME, PASSWORD, GENDER, ADDRESS, FULLNAME, EMAIL) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, {
      USERNAME,
      PASSWORD,
      GENDER,
      ADDRESS,
      FULLNAME,
      EMAIL
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
