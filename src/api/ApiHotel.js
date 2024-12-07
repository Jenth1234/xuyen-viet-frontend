import apiClient from './apiClient';

export const ApiHotel = {

  searchHotels: async (searchParams) => {
    try {
      const response = await apiClient.get('/hotel/searchByCity', {
        params: {
          city: searchParams.city,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          adults: searchParams.adults,
          children: searchParams.children
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm các API calls khác liên quan đến hotel ở đây
  getHotelDetails: async (hotelId) => {
    console.log(hotelId);
    try {
      const response = await apiClient.get(`/hotel/${hotelId}/rooms`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiHotel;