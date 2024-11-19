// api.js
import axios from "axios";

// URL của API backend
const API_URL = "http://localhost:3600";

export const getInvoiceByUser = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Gửi yêu cầu GET đến API để lấy danh sách hóa đơn
    const response = await axios.get(`${API_URL}/invoice/invoices`, {
      headers: {
        'Content-Type': 'application/json',  // Đảm bảo Content-Type là JSON
        'Authorization': `Bearer ${token}`,  // Thêm token vào header Authorization
      },
      params: { user_id: id },  // Nếu cần thêm tham số user_id vào yêu cầu
    });

    return response.data;  // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error fetching invoices:', error); // In ra lỗi nếu có
    throw error;  // Ném lỗi để controller hoặc nơi gọi xử lý
  }
};
