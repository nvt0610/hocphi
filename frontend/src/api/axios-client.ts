import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Đính kèm Token vào Header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Bóc tách dữ liệu và xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về toàn bộ ApiResponse (bao gồm data và meta)
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401 && !error.config?.url?.match(/\/auth\/(login|register)/)) {
      // Tự động Logout nếu Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    // Trả về message lỗi từ Backend nếu có
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
