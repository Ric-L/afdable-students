'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import CourseCard from '@/components/CourseCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BookOpen, Clock, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  const { user, courses } = useAuth();

  const activeCourses = courses.filter(course => course.progress && course.progress < 100);
  const completedCourses = courses.filter(course => course.progress === 100);
  const liveCourses = courses.filter(course => course.isLive);

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Courses',
      value: activeCourses.length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed',
      value: completedCourses.length,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Live Classes',
      value: liveCourses.length,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's an overview of your learning progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Courses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Active Courses</h2>
            {activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active courses found</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/dashboard/live-classes"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
              >
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Join Live Classes</h3>
                <p className="text-sm text-gray-600">Access your ongoing live sessions</p>
              </a>
              
              <a
                href="/dashboard/course-history"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
              >
                <BookOpen className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Course History</h3>
                <p className="text-sm text-gray-600">View all your enrolled courses</p>
              </a>
              
              <a
                href="/dashboard/profile"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
              >
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}