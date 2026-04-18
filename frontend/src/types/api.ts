export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
}
