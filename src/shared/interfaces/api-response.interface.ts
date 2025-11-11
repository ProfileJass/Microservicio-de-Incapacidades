export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
  code: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiValidationError extends ApiError {
  validationErrors: ValidationError[];
}
