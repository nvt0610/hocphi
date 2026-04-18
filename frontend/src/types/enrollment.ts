import { Student } from './student';
import { ClassItem } from './class';

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrollmentDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  student?: Student;
  class?: ClassItem;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  classId: string;
  enrollmentDate?: string;
}

export interface UpdateEnrollmentStatusRequest {
  status: 'ACTIVE' | 'INACTIVE';
}
