// api.js
import axios from "axios";
// URL của API backend
const API_URL = "http://localhost:3600";


export const getTop10 = async () => {
  try {
    const response = await axios.get(`${API_URL}/place/top10places`);
    return response.data; // Trả về dữ liệu địa điểm
  } catch (error) {
    console.error("Error fetching top 10 beaches:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const addByUser = async (placeData) => {
  console.log(placeData)
  try {
    const response = await axios.post(`${API_URL}/place/addByUser`, placeData);
    return response.data; // Trả về dữ liệu sau khi thêm địa điểm
  } catch (error) {
    console.error("Error adding place:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const searchPlacesByName = async (NAME) => {
  try {
    const response = await axios.get(`${API_URL}/place/search`, {
      params: { NAME },
    });
    return response.data; // Hoặc điều chỉnh theo cấu trúc dữ liệu bạn nhận được
  } catch (error) {
    console.error('Error searching places:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};
export const getPlaceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/place/getPlaceById/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    throw error; 
  }

};
export const addReview = async (reviewData) => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.post('${API_URL}/place/addReview', 
      {
        placeId: reviewData.placeId,
        rating: reviewData.rating,
        feedback: reviewData.feedback
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};