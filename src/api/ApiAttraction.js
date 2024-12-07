import axios from "axios";
const API_URL = "http://localhost:3600";

export const getAttractionByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/attraction/getAttractionByName/${encodeURIComponent(name)}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attraction by name:', error.response?.data || error.message);
    throw error;
  }
};

export const searchByCategory = async (searchTerm) => {
  try {
    // Kiểm tra searchTerm
    if (!searchTerm?.trim()) {
      throw new Error('Vui lòng nhập từ khóa tìm kiếm');
    }

    // Gọi API với searchTerm
    const response = await axios.get(`${API_URL}/attraction/search`, {
      params: {
        searchTerm: searchTerm.trim()
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Log response để debug
    console.log('API Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Search error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Thêm hàm tìm kiếm kết hợp
export const searchAttractions = async ({ searchTerm, category, region }) => {
  try {
    const params = {};
    
    if (searchTerm) params.searchTerm = searchTerm.trim();
    if (category) params.category = category.trim();
    if (region) params.region = region.trim();

    const response = await axios.get(`${API_URL}/attraction/search`, {
      params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Advanced search error:', error);
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm');
  }
};