import apiClient from './apiClient';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await apiClient.get('/notification/', {
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