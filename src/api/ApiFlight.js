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

export const searchFlights = async (origin, destination, departureDate) => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('/flight/search-flights', {
      params: {
        origin,
        destination,
        departureDate
      },
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error.response?.data || error.message);
    throw error;
  }
};

  export const addPassengerInfo = async (data) => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await apiClient.post(
        '/passenger/createPassenger',
        data, // Gửi dữ liệu trực tiếp
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating passenger info:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };
  export const getContactByUser = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await apiClient.get('/passenger/contacts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts by user:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };
    export const Payment = async (data) => {
      try {
        const token = localStorage.getItem('token');
    
        const response = await apiClient.post(
          'payment/paymentFlight',
          data, // Gửi dữ liệu trực tiếp
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error creating passenger info:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
      }
    };
    