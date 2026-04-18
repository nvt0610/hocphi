import axiosClient from './axios-client';
import type { ClassItem, CreateClassRequest, UpdateClassRequest } from '../types/class';
import type { ApiResponse } from '../types/api';

export const classService = {
  getAll: (params?: any): Promise<ApiResponse<ClassItem[]>> => axiosClient.get('/classes', { params }),
  
  getById: (id: string): Promise<ApiResponse<ClassItem>> => axiosClient.get(`/classes/${id}`),
  
  create: (data: CreateClassRequest): Promise<ApiResponse<ClassItem>> => axiosClient.post('/classes', data),
  
  update: (id: string, data: UpdateClassRequest): Promise<ApiResponse<ClassItem>> => axiosClient.patch(`/classes/${id}`, data),
  
  delete: (id: string): Promise<void> => axiosClient.delete(`/classes/${id}`),
};
