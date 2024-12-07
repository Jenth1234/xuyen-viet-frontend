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

