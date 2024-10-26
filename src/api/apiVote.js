import apiClient from './apiClient';

export const getVoteByYear = async () => {
  try {
    const response = await apiClient.get('/vote/getVoteByYear');
    return response.data; // Trả về dữ liệu vote
  } catch (error) {
    console.error("Error fetching votes by year:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const createVote = async (voteData) => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await apiClient.post(
      '/vote/createVote',{voteData}, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating vote:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const getVoteByUser = async () => {
  try {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const response = await apiClient.get('/vote/getVoteByUser', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Trả về dữ liệu vote
  } catch (error) {
    console.error("Error fetching votes by user:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};