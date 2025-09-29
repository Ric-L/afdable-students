'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  duration: string;
  isLive?: boolean;
  progress?: number;
  enrolledDate: string;
}

interface AuthContextType {
  user: User | null;
  courses: Course[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUser: User = {
  id: '1',
  username: 'student123',
  name: 'John Smith',
  email: 'john.smith@email.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
};

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced JavaScript',
    instructor: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    duration: '12 weeks',
    isLive: true,
    progress: 75,
    enrolledDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'React Development',
    instructor: 'Prof. Mike Chen',
    schedule: 'Tue, Thu - 2:00 PM',
    duration: '10 weeks',
    isLive: true,
    progress: 60,
    enrolledDate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Database Design',
    instructor: 'Dr. Emily Rodriguez',
    schedule: 'Sat - 9:00 AM',
    duration: '8 weeks',
    isLive: false,
    progress: 100,
    enrolledDate: '2023-11-20'
  },
  {
    id: '4',
    name: 'UI/UX Design Principles',
    instructor: 'Alex Thompson',
    schedule: 'Mon, Wed - 3:00 PM',
    duration: '6 weeks',
    isLive: false,
    progress: 85,
    enrolledDate: '2023-12-05'
  },
  {
    id: '5',
    name: 'Python Programming',
    instructor: 'Dr. James Wilson',
    schedule: 'Tue, Thu, Fri - 11:00 AM',
    duration: '14 weeks',
    isLive: true,
    progress: 45,
    enrolledDate: '2024-01-22'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('student-portal-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCourses(mockCourses);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication
    if (username === 'student123' && password === 'password123') {
      setUser(mockUser);
      setCourses(mockCourses);
      localStorage.setItem('student-portal-user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setCourses([]);
    localStorage.removeItem('student-portal-user');
  };

  return (
    <AuthContext.Provider value={{ user, courses, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}