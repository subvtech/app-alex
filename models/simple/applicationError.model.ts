export interface ApplicationError<T = Object> {
  data: T | null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: {
      policy: string;
      errCode: string;
    };
  };
}
