import axiosClient from './axios-client';
import type { Student, CreateStudentRequest } from '../types/student';
import type { ApiResponse } from '../types/api';

export const studentService = {
  getAll: (params?: any): Promise<ApiResponse<Student[]>> => axiosClient.get('/students', { params }),
  
  getById: (id: string): Promise<ApiResponse<Student>> => axiosClient.get(`/students/${id}`),
  
  create: (data: CreateStudentRequest): Promise<ApiResponse<Student>> => axiosClient.post('/students', data),
  
  update: (id: string, data: Partial<CreateStudentRequest>): Promise<ApiResponse<Student>> => 
    axiosClient.patch(`/students/${id}`, data),
  
  delete: (id: string): Promise<void> => axiosClient.delete(`/students/${id}`),
};
