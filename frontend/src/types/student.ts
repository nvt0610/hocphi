export interface Student {
  id: string;
  fullName: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: Array<{
    id: string;
    classId: string;
    studentId: string;
    status: string;
  }>;
}

export interface CreateStudentRequest {
  fullName: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  classIds?: string[];
}
