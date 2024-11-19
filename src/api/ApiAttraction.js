// api.js
import axios from "axios";
// URL của API backend
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
  export const searchByCategory = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/attraction/search?category=${encodeURIComponent(category)}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces by category:', error.response?.data || error.message);
      throw error;
    }
  };