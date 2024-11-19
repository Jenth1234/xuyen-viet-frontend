import apiClient from './apiClient';

export const getShareableItems = async () => {
  try {
    const response = await apiClient.get('/itinerary/shareable');
    return response.data; // Trả về dữ liệu vote
  } catch (error) {
    console.error("Error fetching votes by year:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const getNotifications = async () => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage

  try {
    const response = await apiClient.get('/itinerary/notifications', {
      headers: {
        'Content-Type': 'application/json',  // Đảm bảo Content-Type là JSON
        'Authorization': `Bearer ${token}`,  // Thêm token vào header Authorization
      }
    });

    return response.data; // Trả về dữ liệu thông báo
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const submitItineraryReview = async (reviewData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.post('/itinerary/review', reviewData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const sendItineraryNotification = async (notificationData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.post('/itinerary/notification', notificationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};