import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../environments/environment.dev';

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: environment.BE_APP_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle the response data
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      // Optionally handle unauthorized access, like redirecting to login
      console.error('Unauthorized, logging out...');
      // Handle logout or redirection logic here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
