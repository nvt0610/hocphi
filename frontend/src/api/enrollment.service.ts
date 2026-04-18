import axiosClient from './axios-client';
import type { Enrollment, CreateEnrollmentRequest, UpdateEnrollmentStatusRequest } from '../types/enrollment';

export const enrollmentService = {
  getAll: (params?: any): Promise<Enrollment[]> => axiosClient.get('/enrollments', { params }),
  
  getById: (id: string): Promise<Enrollment> => axiosClient.get(`/enrollments/${id}`),
  
  create: (data: CreateEnrollmentRequest): Promise<Enrollment> => axiosClient.post('/enrollments', data),
  
  updateStatus: (id: string, data: UpdateEnrollmentStatusRequest): Promise<Enrollment> => 
    axiosClient.patch(`/enrollments/${id}/status`, data),
  
  delete: (id: string): Promise<void> => axiosClient.delete(`/enrollments/${id}`),
};
