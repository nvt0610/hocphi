import axiosClient from './axios-client';

export const userService = {
  getAll: () => axiosClient.get('/users'),
  
  getById: (id: string) => axiosClient.get(`/users/${id}`),
  
  // CreateUserDto bao gồm username, password, role
  create: (data: any) => axiosClient.post('/users', data),
  
  // Endpoint update người dùng (nếu backend có hỗ trợ PATCH /users/:id)
  // Nếu backend chưa có, method này sẽ báo lỗi 404, nhưng nên định nghĩa sẵn
  update: (id: string, data: any) => axiosClient.patch(`/users/${id}`, data),
  
  delete: (id: string) => axiosClient.delete(`/users/${id}`),
};
