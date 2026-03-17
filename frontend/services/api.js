import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app-salao-api.onrender.com',
  timeout: 10000,
});

export default api;