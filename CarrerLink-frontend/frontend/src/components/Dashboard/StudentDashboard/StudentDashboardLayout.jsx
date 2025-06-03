import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Briefcase,
  FileText,
  FileSpreadsheet,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../../../api/AuthProvider";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import SuggestedProjects from "./SuggestedProjects";
import { getStudentByUsername } from "../../../api/StudentDetailsApi";

function StudentDashboardLayout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const { logout, token } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const navigationItems = [
    { path: "/student", icon: Home, label: "Home" },
    { path: "/student-dashboard/jobs", icon: Briefcase, label: "Công Việc" },
    { path: "/testplatform", icon: FileText, label: "TEST" },
    { path: "/student-dashboard/cv", icon: FileSpreadsheet, label: "CV" },
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) return;
      try {
        const userId = extractUsernameFromToken(token);
        if (!userId) {
          console.error('Không thể lấy userId từ token');
          return;
        }
        const response = await getStudentByUsername(userId);
        if (response?.success) {
          setStudentInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [token]);

  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error("Lỗi giải mã mã thông báo", error);
      return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const markAsRead = (id) => {
    fetch(`http://localhost:8091/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((updatedNotification) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? updatedNotification : n))
        );
        setUnreadCount((prev) => prev - 1);
      })
      .catch((err) => console.error("Error marking as read:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/student" className="flex items-center space-x-2">
              <span className="text-xl text-indigo-600 font-bold">
                CareerLink
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button
              className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            Bảng điều khiển của ứng viên
          </h1>
          <div className="flex items-center space-x-4">
            <Link to="/editprofile" className="flex items-center space-x-2">
              <img
                src={studentInfo?.profileImageUrl || '/placeholder.svg'}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg border-2 border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.svg';
                }}
              />
              <span className="font-medium">
                {studentInfo?.firstName || 'Loading...'}
              </span>
            </Link>
          </div>
        </header>
        <main
          className="p-8 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboardLayout;
