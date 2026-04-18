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
}

export interface CreateClassRequest {
  className: string;
  description?: string;
  monthlyFee: number;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {}
