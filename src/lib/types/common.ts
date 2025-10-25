import type { QueryKey } from "@tanstack/react-query";
import type { TApiResponse, TApiSingleResponse } from "../modules";

export type TMutationProp = {
  // key: string[];
  key?: QueryKey;
  invalidateKey?: QueryKey | QueryKey[];
  func: (body: any) => Promise<TApiResponse<any>>;
  onSuccess: () => void;
  onError?: () => void; // Optional error handler
};

export type TOption = {
  id: number;
  label: string;
  value: string | number;
};

export type TQueryParams = {
  id?: number | null | string;
  offset?: number;
  limit?: number;
  brand?: number | string;
  model?: number | string;
  username?: string;
  active?: number | string;
  startDate?: string;
  endDate?: string;
  name?: string;
  mobile?: string;
  category?: string;
  seller?: string;
  designation?: number | string;
  email?: string;
  year?: string | number | null;
  month?: string | number | null;
  status?: string | number;
  type?: string;
  supplier_id?: number;
  project_id?: number;
  employee_id?: number;
  start_date?: string;
  end_date?: string;
  transaction_type?: string;
  threshold?: number;
};

// export type TQueryProp = {
//   key: string[];
//   params?: TQueryParams;
//   isEnabled?: boolean;
//   func: (params: TQueryParams) => Promise<TApiResponse<any>>;
// };

// export type TQueryProp<T = any> = {
//   key: string[];
//   params?: TQueryParams;
//   isEnabled?: boolean;
//   func: (params: TQueryParams) => Promise<TApiResponse<T>>;
// };

// Base API Response type

// Query parameters type
// export type TQueryParams = {
//   offset?: number;
//   limit?: number;
//   [key: string]: any; // allow other params
// };

// Hook props type
export type TQueryProp<T = any> = {
  key: string[];
  params?: TQueryParams;
  isEnabled?: boolean;
  func: (params: TQueryParams) => Promise<TApiResponse<T>>;
};

export type TSingleQueryProp = {
  key: string[];
  params?: TQueryParams;
  isEnabled?: boolean;
  func: (params: TQueryParams) => Promise<TApiSingleResponse<any>>;
};

export interface SlicePayload<T> {
  list: T[] | null;
  page: number;
  count: number;
}

// types.ts

export interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  isActive: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  sessionId: number;
}

// export type TAdminResponse = {
// 	result: {
// 		id: number;
// 		fullname: string;
// 		phone: string;
// 		email: string;
// 		token: string;
// 	};
// 	success: boolean;
// 	message?: string;
// };
export type TAdminResponse = {
  result: {
    user: {
      id: number;
      email: string;
      name: string;
      role_id: number;
      isActive: boolean;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
    };
    token: string;
    sessionId: number;
  };
  success: boolean;
  message?: string;
};
export type TEmployeeResponse = {
  result: {
    user: {
      id: number;
      email: string;
      name: string;
      role_id: number;
      isActive: boolean;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
    };
    token: string;
    sessionId: number;
  };
  success: boolean;
  message?: string;
};

export type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

export type TLoginBody = {
  username: string;
  password: string;
};

export type TAdminBody = {
  id?: number;
  username?: string;
  fullname?: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
  created_on?: string;
  image?: string;
  token?: string;
  is_deleted?: number;
  is_active?: number;
};
export type TEmployeeBody = {
  id?: number;
  username?: string;
  fullname?: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
  created_on?: string;
  image?: string;
  token?: string;
  is_deleted?: number;
  is_active?: number;
};

//service_body

export interface EnrolledCourse {
  enrollment_id: string;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  status: string;
  attendance_percentage: number;
  course_title: string;
  course_description?: string;
  subject: string;
  board_type: string;
  grade_level?: string;
  start_date: string;
  end_date: string;
  current_students: number;
  price: number;
  instructor_name?: string;
  thumbnail_url?: string;
  is_active: number;
  course_created_at: string;
  course_updated_at: string;
}
