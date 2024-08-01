import axios from 'axios';

const baseURL = 'http://localhost:3001/api/v1';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
    return response.data;
  },
  (error) => {
    // Handle errors (e.g., redirect to login if unauthorized)
    // if (error.response && error.response.status === 401) {
    //   // Redirect to login or refresh token
    // }
    // return Promise.reject(error);
    return error;
  },
);

export default axiosInstance;
