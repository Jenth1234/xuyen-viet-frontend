import React, { createContext, useState, useContext, useEffect } from 'react';
import { socket } from '../api/socketClient';
import { getNotifications, markAsRead as markAsReadApi, deleteNotification as deleteNotificationApi } from '../api/ApiNotification';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications khi component mount
    fetchNotifications();

    // Socket listeners
    socket.on('notification', handleNewNotification);
    socket.on('notificationRead', handleNotificationRead);

    return () => {
      socket.off('notification');
      socket.off('notificationRead');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Không thể tải thông báo');
    }
  };

  const handleNewNotification = (newNotification) => {
    // Log chi tiết thông tin nhận được
    console.log('🔔 Nhận thông báo mới:', {
      type: newNotification.type,
      message: newNotification.message,
      data: newNotification.data,
      timestamp: new Date().toISOString()
    });
  
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Hiển thị toast notification
    toast.info(newNotification.message, {
      position: "top-right",
      autoClose: 5000,
      onOpen: () => {
        console.log('🎯 Toast notification hiển thị:', newNotification.message);
      }
    });
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await markAsReadApi(notificationId);
      if (response.success) {
        handleNotificationRead(notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await deleteNotificationApi(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        toast.success('Đã xóa thông báo');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);