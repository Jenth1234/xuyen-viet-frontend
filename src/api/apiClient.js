// apiClient.js
import axios from 'axios';

const API_URL = 'http://localhost:3600';

const apiClient = axios.create({
  baseURL: API_URL,

});

export default apiClient;
