'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import CourseCard from '@/components/CourseCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Video, Clock } from 'lucide-react';

export default function LiveClassesPage() {
  const { courses } = useAuth();

  const liveCourses = courses.filter(course => course.isLive);
  const upcomingCourses = courses.filter(course => !course.isLive);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
            <p className="text-gray-600">Join your live classes and interactive sessions</p>
          </div>

          {/* Live Now */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Video className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Live Now</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                {liveCourses.length} Active
              </span>
            </div>
            
            {liveCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {liveCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showJoinButton={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No live classes at the moment</p>
                <p className="text-sm text-gray-500 mt-2">Check back later or view your upcoming classes below</p>
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Classes</h2>
            </div>
            
            {upcomingCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showJoinButton={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming classes scheduled</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}