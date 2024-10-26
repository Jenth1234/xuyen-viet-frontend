// api.js
import axios from "axios";
// URL của API backend
const API_URL = "http://localhost:3600";

// // Hàm lấy 10 địa điểm bãi biển
// export const getTop10Beaches = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/BEACH`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

// export const getTop10Cafe = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/cafe`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

// export const getTop10ATTRACTION = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/ATTRACTION`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

// export const getTop10FESTIVAL = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/FESTIVAL`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

// export const getTop10CULTURAL = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/CULTURAL`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };
// export const getTop10RESTAURANT = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/RESTAURANT`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };

// export const getTop10HOTEL = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/place/top10places/HOTEL`);
//     return response.data; // Trả về dữ liệu địa điểm
//   } catch (error) {
//     console.error("Error fetching top 10 beaches:", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//   }
// };
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
