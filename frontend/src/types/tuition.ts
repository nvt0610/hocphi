import type { Student } from './student';

export interface TuitionRecord {
  id: string;
  studentId: string;
  enrollmentId?: string;
  billingMonth?: string;
  content?: string;
  amount: number;
  paymentDate?: string;
  status: 'Paid' | 'Unpaid';
  createdAt: string;
  updatedAt: string;
  student?: Student;
}

export interface CreateTuitionRequest {
  studentId: string;
  enrollmentId?: string;
  billingMonth?: string;
  content?: string;
  amount: number;
  status?: 'Paid' | 'Unpaid';
}

export interface UpdateTuitionStatusRequest {
  status: 'Paid' | 'Unpaid';
  paymentDate?: string;
}
