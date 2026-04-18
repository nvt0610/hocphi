import axiosClient from './axios-client';

export const scheduleService = {
  getAll: () => axiosClient.get('/schedules'),
  
  getByClass: (classId: string) => axiosClient.get(`/schedules/class/${classId}`),
  
  create: (data: any) => axiosClient.post('/schedules', data),
  
  delete: (id: string) => axiosClient.delete(`/schedules/${id}`),
};
