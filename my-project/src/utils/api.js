
// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Optional: You can still keep basic error handling if you want
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can still log errors if needed
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
