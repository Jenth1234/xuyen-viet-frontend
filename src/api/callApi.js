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
// Hàm getUserInfo trong callApi.js
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

  /**
   * Gửi yêu cầu GET để tìm kiếm thông tin chuyến bay
   * @param {string} origin - Mã sân bay xuất phát (IATA code)
   * @param {string} destination - Mã sân bay đến (IATA code)
   * @param {string} departureDate - Ngày khởi hành (định dạng YYYY-MM-DD)
   * @returns {Promise} - Trả về promise từ axios
   */
  export const searchFlights = async (origin, destination, departureDate) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/flight/search-flights`, {
        params: {
          origin,
          destination,
          departureDate
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error.response?.data || error.message);
      throw error;
    }
  };
  /**
   * Gửi yêu cầu POST để tải lên ảnh
   * @param {File} photo - Tập tin ảnh để tải lên
   * @param {string} province - Tên tỉnh liên quan đến ảnh
   * @param {string} token - Token xác thực
   * @returns {Promise} - Trả về promise từ axios
   */
  export const getUserUploads = async (photo, province, token) => {
    try {
      // Tạo đối tượng FormData để gửi ảnh và tên tỉnh
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('province', province);

      const response = await axios.post(`${API_URL}/upload/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading photo:', error.response?.data || error.message);
      throw error;
    }
  };
  export const getVisitedProvinces = async (token) => {
    try {
      const response = await axios.post(`${API_URL}/province/getVisited`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching visited provinces:', error.response?.data || error.message);
      throw error;
    }
  };


// export const getUserUploads = async (token) => {
//   try {
//     const response = await axios.get(`${API_URL}/uploads`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user uploads:', error.response?.data || error.message);
//     throw error;
//   }
// };
  /**
 * Gửi yêu cầu POST để tải ảnh và tên tỉnh lên server
 * @param {File} photo - File ảnh cần tải lên
 * @param {string} province - Tên tỉnh
 * @returns {Promise} - Trả về promise từ axios
 */

  export const uploadPhoto = async (photo, province,date,token) => {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('province', province);
      formData.append('date', date); // Thêm ngày vào FormData
      
  
      const response = await axios.post(`${API_URL}/upload/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${token}`
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error uploading photo:', error.response?.data || error.message);
      throw error;
    }
  };
  // api/callApi.js
export const updateArrivalDates = async (province, dates) => {
  try {
    const response = await fetch(`http://localhost:3600/provinces/${province}/dates`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ dates })
    });

    if (!response.ok) {
      throw new Error('Đã xảy ra lỗi khi cập nhật ngày đến.');
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật ngày đến:", error);
    throw error;
  }
};
export const getAllAttraction = async () => {
  try {
    const response = await axios.get(`${API_URL}/attraction/attraction`, {}, {
      headers: {
      
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    throw error;
  }
};




export const getAttractionDetail = async (id) => {
  try {
    // Đảm bảo rằng id không bị undefined hoặc null
    if (!id) {
      throw new Error('ID không được cung cấp');
    }

    // Thay thế `id` trong URL bằng giá trị của biến `id`
    const response = await axios.get(`${API_URL}/attraction/detailAttraction/${id}`, {
      headers: {
        // Thêm các tiêu đề nếu cần
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching attraction detail:', error.response?.data || error.message);
    throw error;
  }
};

