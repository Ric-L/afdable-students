export interface TLoginBody {
  username: string;
  password: string;
}

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
};

// lib/api.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  grade: string;
  board_type: string;
  is_active: boolean;
  last_login: string;
  created_on: string;
  updated_at: string;
  token: string;
}

interface CourseItem {
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
  grade_level: string;
  start_date: string;
  end_date: string;
  current_students: number;
  price: number;
  instructor_name?: string;
  thumbnail_url?: string;
  is_active: boolean;
  course_created_at: string;
  course_updated_at: string;
}

export interface CoursesResponse {
  count: number;
  list: CourseItem[];
}

export type TStudentSignup = {
  username: string;
  password: string;
  email: string;
  full_name?: string;
  phone?: string;
  grade?: string;
  board_type?: string;
};

export interface TEnrollmentRequest {
  id?: number;
  // Add your enrollment request fields here
  courseId: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TEnrollmentRequestStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export type TCreateEnrollmentRequest = {
  course_id: number;
  original_price: number;
  discounted_price: number;
  promo_code_id?: number;
  student_notes?: string;
};

export type TUpdateEnrollmentRequest = {
  course_id: number;
  original_price: number;
  discounted_price: number;
  promo_code_id?: number;
  student_notes?: string;
};
