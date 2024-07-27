import axios from 'axios';

const baseURL = 'http://localhost:3001/api/v1';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add auth tokens)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response;
  },
  (error) => {
    // Handle errors (e.g., redirect to login if unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
