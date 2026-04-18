export interface ClassItem {
  id: string;
  className: string;
  description?: string;
  monthlyFee: number;
  studentCount?: number;
  scheduleCount?: number;
  paidCount?: number;
  createdAt: string;
  updatedAt: string;
  schedules?: any[];
  enrollments?: any[];
}

export interface CreateClassRequest {
  className: string;
  description?: string;
  monthlyFee: number;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {}
