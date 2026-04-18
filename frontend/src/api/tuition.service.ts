import axiosClient from './axios-client';
import type { TuitionRecord, CreateTuitionRequest, UpdateTuitionStatusRequest } from '../types/tuition';
import type { ApiResponse } from '../types/api';

export const tuitionService = {
  getAll: (params?: any): Promise<ApiResponse<TuitionRecord[]>> => axiosClient.get('/tuition-records', { params }),
  
  getById: (id: string): Promise<ApiResponse<TuitionRecord>> => axiosClient.get(`/tuition-records/${id}`),
  
  getByStudent: (studentId: string): Promise<ApiResponse<TuitionRecord[]>> => axiosClient.get(`/tuition-records/student/${studentId}`),
  
  create: (data: CreateTuitionRequest): Promise<ApiResponse<TuitionRecord>> => axiosClient.post('/tuition-records', data),
  
  update: (id: string, data: Partial<TuitionRecord>): Promise<ApiResponse<TuitionRecord>> => 
    axiosClient.patch(`/tuition-records/${id}`, data),

  updateStatus: (id: string, data: UpdateTuitionStatusRequest): Promise<ApiResponse<TuitionRecord>> => 
    axiosClient.patch(`/tuition-records/${id}/status`, data),
  
  delete: (id: string): Promise<void> => axiosClient.delete(`/tuition-records/${id}`),
};
