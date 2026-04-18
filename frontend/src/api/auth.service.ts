import axiosClient from './axios-client';

export const authService = {
  login: async (credentials: any) => {
    const res = await axiosClient.post('/auth/login', credentials) as any;
    if (res && res.success && res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  register: async (userData: any) => {
    const res = await axiosClient.post('/auth/register', userData) as any;
    if (res && res.success && res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
