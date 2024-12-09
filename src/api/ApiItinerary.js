import apiClient from './apiClient';
import socketIOClient from 'socket.io-client';

export const getShareableItems = async () => {
  try {
    const response = await apiClient.get('/itinerary/shareable');
    return response.data; // Trả về dữ liệu vote
  } catch (error) {
    console.error("Error fetching votes by year:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
export const toggleItineraryShare = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const response = await apiClient.patch(
      `/itinerary/${id}/toggle-share`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
// export const getNotifications = async () => {
//   const token = localStorage.getItem('token'); // Lấy token từ localStorage

//   try {
//     const response = await apiClient.get('/itinerary/notifications', {
//       headers: {
//         'Content-Type': 'application/json',  // Đảm bảo Content-Type là JSON
//         'Authorization': `Bearer ${token}`,  // Thêm token vào header Authorization
//       }
//     });

//     return response.data; // Trả về dữ liệu thông báo
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

export const copyItinerary = async (itineraryId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiClient.post(
      `itinerary/${itineraryId}/copy`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createItinerary = async (payload) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post(
            `/itinerary/create`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Tạo lịch trình thất bại');
        }
    } catch (error) {
        console.error('Create itinerary API error:', error);
        throw error.response?.data || {
            success: false,
            message: 'Không thể kết nối đến server'
        };
    }
};
export const getItinerary = async (itineraryId) => {
  try {
    if (!itineraryId) {
      throw new Error('ID hành trình không được để trống');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const response = await apiClient.get(
      `/itinerary/getById/${itineraryId}`, // Sử dụng params trong URL
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error('Không tìm thấy dữ liệu hành trình');
    }

  } catch (error) {
    console.error('Lỗi khi lấy hành trình:', error);
    throw error.response?.data || {
      success: false,
      message: error.message || 'Không thể kết nối đến server'
    };
  }
};
export const deleteItinerary = async (itineraryId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const response = await apiClient.delete(
      `/itinerary/${itineraryId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Bạn không có quyền xóa lịch trình này');
    }
    if (error.response?.status === 404) {
      throw new Error('Lịch trình không tồn tại hoặc đã bị xóa');
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Có lỗi xảy ra khi xóa lịch trình'
    );
  }
};