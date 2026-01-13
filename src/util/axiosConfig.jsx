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
const excludeEndpoints = [
  '/login',
  '/register',
  '/activate',
  '/resend-verification',
  '/status',
  '/health',
];

// Request Interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => config.url?.startsWith(endpoint));

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
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    // ✅ DO NOT navigate/redirect here.
    // Only log it. useUser() should be the only place that logs out.
    if (status === 401) {
      console.error('401 from:', error?.config?.url);
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  },
);

export default axiosConfig;
