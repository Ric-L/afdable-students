import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAuth } from "../react-redux/features/authSlice";
import HomeIcon from "@mui/icons-material/Home";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Person2Icon from "@mui/icons-material/Person2";
import ClassIcon from "@mui/icons-material/Class";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { LogoutOutlined, Menu, X, ArrowDropDown } from "@mui/icons-material";

const sidebarItems = [
  { href: "/student", label: "Dashboard", icon: HomeIcon, exact: true },
  { href: "/student/live-classes", label: "Live Classes", icon: PersonalVideoIcon },
  { href: "/student/course-history", label: "Course History", icon: LibraryBooksIcon },
  { href: "/student/profile", label: "Profile", icon: Person2Icon },
  { href: "/student/enrollment-request", label: "Enrollment Requests", icon: ClassIcon },
  { href: "/student/active-courses", label: "Active Courses", icon: SquareFootIcon },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const user = useSelector((state) => state.auth.user);
  const user = useSelector(selectCurrentAuth);
  console.log(user);
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <>
      {/* Static Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Afdable Classes Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-lg font-bold text-blue-700 tracking-wide">Afdable Classes</h1>
        </div>

        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-50 hover:bg-gray-100 transition">
            <span className="text-gray-800 font-medium">{user?.user?.username || "Student"}</span>
            <ArrowDropDown className="text-gray-600" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button onClick={handleLogout} className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                <LogoutOutlined className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu button */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden fixed top-20 left-4 z-40 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
        {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 
          bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          z-40
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button (Desktop Fallback) */}
          <div className="p-4 border-t border-gray-200 md:hidden">
            <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
              <LogoutOutlined className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
