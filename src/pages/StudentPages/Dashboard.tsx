import { BookOutlined, LockClock, TrendingUp, VerifiedUser } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { selectCurrentAuth } from "../../react-redux/features/authSlice";
import { useSelector } from "react-redux";
import { useGetQuery } from "../../react-query/hooks/queryHooks";
import { queryConfig } from "../../react-query/queryConfig";

interface EnrolledCourse {
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
  is_active: number; // Changed to number to match API data
  course_created_at: string;
  course_updated_at: string;
}

export default function DashboardPage() {
  const auth = useSelector(selectCurrentAuth);
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

  // Map enrollmentData and convert is_active to boolean for display logic
  const enrolledCourses: EnrolledCourse[] = (enrollmentData?.result?.list as EnrolledCourse[]) || [];

  // Stats calculations, converting is_active number to boolean
  const activeCourses = enrolledCourses.filter((course) => course.status === "active" && course.attendance_percentage < 100);
  const completedCourses = enrolledCourses.filter((course) => course.attendance_percentage === 100);
  const liveCourses = enrolledCourses.filter((course) => !!course.is_active); // Convert number to boolean

  const stats = [
    {
      title: "Total Courses",
      value: enrolledCourses.length,
      icon: BookOutlined,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: activeCourses.length,
      icon: LockClock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: completedCourses.length,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Live Classes",
      value: liveCourses.length,
      icon: AccountCircleIcon,
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 text-lg">Error loading your dashboard. Please try again later.</p>
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {auth.user?.fullname}!</h1>
        <p className="text-gray-600">Overview of your learning progress</p>
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

      {/* Courses List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Enrolled Courses</h2>
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
                  <p className="text-sm text-gray-500 mt-1">{course.course_description}</p>
                  <p className="text-sm text-gray-600 mt-2">Instructor: {course.instructor_name || "N/A"}</p>
                  <p className="text-sm text-gray-600">Progress: {course.attendance_percentage}%</p>
                  <p className="text-sm text-gray-600">Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/dashboard/live-classes" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
            <VerifiedUser className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Join Live Classes</h3>
            <p className="text-sm text-gray-600">Access your ongoing live sessions</p>
          </a>

          <a href="/dashboard/course-history" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
            <LibraryBooksIcon className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Course History</h3>
            <p className="text-sm text-gray-600">View all your enrolled courses</p>
          </a>

          <a href="/dashboard/profile" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
            <AccountBoxIcon className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Update Profile</h3>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </a>
        </div>
      </div>
    </div>
  );
}
