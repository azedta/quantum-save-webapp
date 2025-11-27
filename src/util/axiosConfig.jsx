import axios from 'axios';
import { BASE_URL } from './apiEndpoints.js';

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// List of endpoints that do NOT require Authorization header
const excludeEndpoints = ['/login', '/register', '/status', '/activate', '/health'];

// Request Interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => {
      return config.url?.includes(endpoint);
    });

    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem('token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = '/login';
      } else if (error.response.status === 500) {
        console.error('Server Error. Please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please try again later.');
    }
    return Promise.reject(error);
  },
);

export default axiosConfig;
