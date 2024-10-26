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
    console.log(id)
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

export const getAllProvincesWithFestivals = async () => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAllFestival`, {
      headers: {
        // Thêm các tiêu đề cần thiết nếu có
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // Nếu cần xác thực
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces with festivals:', error.response?.data || error.message);
    throw error;
  }
};
export const getAllProvincesWithByViews = async () => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAllByViews`, {
      headers: {
        // Thêm các tiêu đề cần thiết nếu có
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // Nếu cần xác thực
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces with festivals:', error.response?.data || error.message);
    throw error;
  }
};
export const getAllProvincesWithByCultural = async () => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAllCultural`, {
      headers: {
        // Thêm các tiêu đề cần thiết nếu có
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // Nếu cần xác thực
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces with festivals:', error.response?.data || error.message);
    throw error;
  }
};
export const getAllProvincesWithByBeaches = async () => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAllBeaches`, {
      headers: {
        // Thêm các tiêu đề cần thiết nếu có
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // Nếu cần xác thực
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching provinces with festivals:', error.response?.data || error.message);
    throw error;
  }
};
export const getAttractionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAttractionById/${id}`, {
      headers: {
        'Content-Type': 'application/json', // Thay đổi nếu cần thiết
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    throw error;
  }
};
export const getAttractionByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAttractionByName/${encodeURIComponent(name)}`, {
      headers: {
        'Content-Type': 'application/json', // Thay đổi nếu cần thiết
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attraction by name:', error.response?.data || error.message);
    throw error;
  }
};
export const getAttractionSubField = async (name,typeField,field) => {
  try {
    console.log('Province Name:', name);
console.log('Province Type:', typeField);
console.log('Field:', field);
    const response = await axios.get(`${API_URL}/attraction/getAttractionSubField/${encodeURIComponent(name)}/${encodeURIComponent(typeField)}/${encodeURIComponent(field)}`, {
      headers: {
        'Content-Type': 'application/json', // Thay đổi nếu cần thiết
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attraction subfield info:', error.response?.data || error.message);
    throw error;
  }
};





export const createItinerary = async (itineraryData, userId) => {
  try {
    // Tạo đối tượng dữ liệu để gửi đi, bao gồm userId và itineraryData
    const dataToSend = {
      ...itineraryData,
      userId, // Thêm userId vào dữ liệu gửi
    };

    // Lấy mã thông báo từ localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Authorization token is required');
    }

    const response = await fetch(`${API_URL}/itinerary/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Thêm mã thông báo vào tiêu đề
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error('Failed to create itinerary');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating itinerary:', error);
    throw error;
  }
};

// callapi.js

// Hàm gửi yêu cầu tạo hoạt động mới
export const createActivity = async (activityData) => {
  try {
    const response = await fetch(`${API_URL}/activity/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Trả về dữ liệu nhận được từ server
    } else {
      throw new Error('Lỗi khi tạo hoạt động');
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    throw error; // Đẩy lỗi lên để có thể xử lý ở nơi gọi hàm này
  }
};
export const getItinerary = async (itineraryId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/itinerary/getById/${itineraryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Thêm mã thông báo vào tiêu đề
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Trả về dữ liệu nhận được từ server
    } else {
      throw new Error('Lỗi khi lấy lộ trình: ' + response.statusText);
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    throw error; // Đẩy lỗi lên để có thể xử lý ở nơi gọi hàm này
  }
};

export const getActivity = async (activityId) => {
  try {
  
    const response = await fetch(`${API_URL}/activity/getActivityById/${activityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
    // Thêm mã thông báo vào tiêu đề
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Trả về dữ liệu nhận được từ server
    } else {
      throw new Error('Lỗi khi lấy activity: ' + response.statusText);
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    throw error; // Đẩy lỗi lên để có thể xử lý ở nơi gọi hàm này
  }
};

export const getItineraryByUserId = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/itinerary/getByUserId`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Thêm mã thông báo vào tiêu đề
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Trả về dữ liệu nhận được từ server
    } else {
      throw new Error('Lỗi khi lấy lộ trình theo id: ' + response.statusText);
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    throw error; // Đẩy lỗi lên để có thể xử lý ở nơi gọi hàm này
  }
};
export const updateActivity = async (activityId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/activity/updateActivity/${activityId}`, updatedData);
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Có lỗi xảy ra khi cập nhật hoạt động:", error);
    throw error; // Ném lỗi để xử lý sau
  }
};

export const updateItinerary = async (itineraryId, updatedData) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log(token)
    const response = await fetch(`${API_URL}/itinerary/${itineraryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update itinerary:', error);
    throw error;
  }
};

