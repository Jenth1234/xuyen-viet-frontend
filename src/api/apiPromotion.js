import apiClient from './apiClient';

const apiPromotion = {
  // Lấy tất cả gói khuyến mãi (không cần token)
  getAllPromotions: async () => {
    try {
      const response = await apiClient.get('/userPromotion/getAllPromotions');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách khuyến mãi';
    }
  },

  // Lấy thông tin coins và khuyến mãi đã đổi của user
  getPromotions: async () => {
    try {
      const response = await apiClient.get('/userPromotion/getPromotions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin khuyến mãi';
    }
  },

  // Đổi khuyến mãi
  redeemPromotion: async (promotionCode) => {
    try {
      const response = await apiClient.post(
        '/userPromotion/redeem',
        { promotionCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Có lỗi xảy ra khi đổi khuyến mãi';
    }
  },

  // Lấy lịch sử giao dịch coins
  getCoinHistory: async () => {
    try {
      const response = await apiClient.get('/userPromotion/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử giao dịch';
    }
  }
};

export default apiPromotion;