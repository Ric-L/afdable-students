import { queryConfig } from "../../react-query/queryConfig";
import { useGetQuery } from "../../react-query/hooks/queryHooks";
import type { EnrolledCourse } from "../../lib/types/common";

const CourseHistory = () => {
  const { queryFn, queryKeys } = queryConfig.useGetEnrolledCourses;

  const {
    data: enrollmentData,
    isLoading,
    isFetched,
    isError,
  } = useGetQuery({
    key: queryKeys,
    func: queryFn,
    params: { offset: 0, limit: 100 },
  });

  const enrolledCourses: EnrolledCourse[] = (enrollmentData?.result?.list as EnrolledCourse[]) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading your course history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 text-lg">Error loading your course history. Please try again later.</p>
      </div>
    );
  }

  if (isFetched && (!enrollmentData || !enrollmentData.success)) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">No courses found or failed to fetch courses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course History</h1>
        <p className="text-gray-600">View all your enrolled courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.enrollment_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              {course.thumbnail_url && <img src={course.thumbnail_url} alt={course.course_title} className="w-16 h-16 object-cover rounded-md" />}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{course.course_title}</h3>
                <p className="text-sm text-gray-600">
                  {course.subject} - {course.board_type}
                </p>
                <p className="text-sm text-gray-500 mt-1">{course.course_description || "No description available"}</p>
                <p className="text-sm text-gray-600 mt-2">Instructor: {course.instructor_name || "N/A"}</p>
                <p className="text-sm text-gray-600">Progress: {course.attendance_percentage}%</p>
                <p className="text-sm text-gray-600">Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}</p>
                <p className="text-sm text-gray-600">Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">
                  Duration: {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseHistory;
