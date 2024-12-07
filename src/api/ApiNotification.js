import apiClient from './apiClient';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.get('/notification/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.put(`/notification/read/${notificationId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.delete(`/notification/${notificationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
export const sendReviewNotification = async (reviewData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await apiClient.post('/notification/send-review', reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error sending review notification:", error);
      throw error;
    }
  };