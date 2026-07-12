import axios from 'axios';
import { API_CONFIG } from './config';
import { notification } from 'antd';

const apiClient = axios.create(API_CONFIG);

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    if (error.response?.status === 403 && error.config?.method?.toLowerCase() !== 'get') {
      if (typeof window !== 'undefined') {
        notification.error({
          title: 'Access Denied',
          description: error.response?.data?.message || "You don't have permission for this action.",
          duration: 4,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
