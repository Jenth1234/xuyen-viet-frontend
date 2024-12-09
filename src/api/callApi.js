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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      
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


export const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  
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
  export const editUserInfo = async (userInfo) => {
    try {
      const token = localStorage.getItem('token');
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

  export const uploadPhoto = async (photo, province,date) => {
    const token = localStorage.getItem('token');
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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




// export const createItinerary = async (payload) => {
//   try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//           '${API_URL}/itinerary/create',
//           payload,
//           {
//               headers: {
//                   'Authorization': `Bearer ${token}`
//               }
//           }
//       );
//       return response.data;
//   } catch (error) {
//       throw error.response?.data || error;
//   }
// };

// callapi.js

// Hàm gửi yêu cầu tạo hoạt động mới
export const createActivity = async (activityData) => {
  try {
     // Kiểm tra dữ liệu trước khi gửi
     if (!activityData || !activityData.itineraryId || !activityData.activity.LOCATION) {
      throw new Error('Thiếu thông tin bắt buộc cho hoạt động');
    }
    const response = await fetch(`${API_URL}/activity/create`, {
      ...activityData,
      __v: activityData.version ,
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
export const createBulkActivities = async (data) => {
  try {
    // Log dữ liệu gửi đi để debug
    console.log('Sending bulk activities data:', data);

    // Kiểm tra dữ liệu đầu vào
    if (!data.itineraryId) {
      throw new Error('Thiếu itineraryId');
    }

    if (!Array.isArray(data.activities) || data.activities.length === 0) {
      throw new Error('Danh sách hoạt động không hợp lệ');
    }

    // Chuẩn bị dữ liệu gửi đi
    const requestData = {
      itineraryId: data.itineraryId,
      activities: data.activities.map(activity => ({
        LOCATION: activity.LOCATION,
        DESCRIPTION: activity.DESCRIPTION || '',
        STARTTIME: activity.STARTTIME,
        ENDTIME: activity.ENDTIME,
        COST: parseFloat(activity.COST) || 0,
        DATE: activity.DATE
      }))
    };

    // Gọi API
    const response = await axios.post(
      `${API_URL}/activity/bulk`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Log response để debug
    console.log('Bulk create response:', response.data);

    return response.data;
  } catch (error) {
    // Log chi tiết lỗi
    console.error('Error in createBulkActivities:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      data: error.response?.data
    });

    // Ném lỗi với thông tin chi tiết
    throw {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
};
export const getItinerary = async (itineraryId) => {
  try {
    
    if (!itineraryId) {
      throw new Error('ID hành trình không được để trống');
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/itinerary/getById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ itineraryId })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Lỗi khi lấy lộ trình: ' + response.statusText);
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    throw error;
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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

export const submitActivityReview = async (reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/activity/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi gửi đánh giá');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gửi đánh giá:', error);
    throw error;
  }
};

/**
 * Gửi yêu cầu DELETE để xóa ảnh

 * @param {string} province - Tên tỉnh
 * @param {string} photoId - ID của ảnh cần xóa
 * @returns {Promise} - Trả về promise từ axios
 */
export const deletePhoto = async (province, photoId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/upload/delete/${province}/${photoId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error.response?.data || error.message);
    throw error;
  }
};
export const getUserUploads = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/upload/getupload`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ảnh:', error);
    throw error;
  }
};

export const updateProvinceStatus = async (provinceName) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
    }

    // Encode tên tỉnh để tránh lỗi với các ký tự đặc biệt
    const encodedProvinceName = encodeURIComponent(provinceName);

    const response = await axios.patch(
      `${API_URL}/province/${encodedProvinceName}/status`,
      {}, // empty body vì chỉ cần toggle status
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Không thể cập nhật trạng thái');
    }

  } catch (error) {
    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        case 404:
          throw new Error(`Không tìm thấy tỉnh ${provinceName}`);
        default:
          throw new Error(error.response.data.message || 'Đã có lỗi xảy ra');
      }
    }

    console.error('Error updating province status:', error);
    throw error;
  }
};
