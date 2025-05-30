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

function StudentDashboardLayout({ children, StudentName, profileImage }) {
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

  const navigationItems = [
    { path: "/student", icon: Home, label: "Home" },
    // { path: "/student-dashboard/courses", icon: BookOpen, label: "Quảng cáo" },
    { path: "/student-dashboard/jobs", icon: Briefcase, label: "Công Việc" },
    {
      path: "",
      icon: FileText,
      label: "TEST",
      isDropdown: true,
      subItems: [
        { path: "/testplatform", label: "Bài TEST" },
        // { path: "/testplatform/view-marks", label: "Xem điểm" },
        // { path: "/testplatform/check-answers", label: "Kiểm tra câu trả lời" },
      ],
    },
    { path: "/student-dashboard/cv", icon: FileSpreadsheet, label: "CV" },
  ];

  const extractStudentIdFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.studentId; // Adjust based on your token structure
    } catch (error) {
      console.error("Lỗi giải mã mã thông báo", error);
      return null;
    }
  };

  useEffect(() => {
    const studentId = extractStudentIdFromToken(token);
    if (!studentId) return;
    console.log(studentId);
    // Add this fetch to load existing notifications
    fetch(`http://localhost:8091/api/notifications/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi HTTP! trạng thái: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Raw notification data:", data);
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      })
      .catch((err) => console.error("Lỗi tải thông báo", err));

    // Fetch initial unread count
    fetch(`http://localhost:8091/api/notifications/${studentId}/unread-count`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy số lượng chưa đọc");
        return res.json();
      })

      .then((count) => setUnreadCount(count))
      .catch((err) => console.error("Lỗi khi lấy số lượng chưa đọc", err));
    console.log(notifications);
    // Connect to WebSocket
    const socket = new SockJS("http://localhost:8091/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(
          `/user/${studentId}/queue/notifications`,
          (message) => {
            console.log("Received WebSocket message:", message.body); // Log incoming messages
            const notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        );
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame.headers.message);
      },
    });
    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, [token]);

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
            {navigationItems.map((item) =>
              item.isDropdown ? (
                <div key={item.label}>
                  <button
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 ${isDropdownOpen ? "bg-indigo-50 text-indigo-600" : ""
                      }`}
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive(subItem.path) ||
                              selectedSubItem === subItem.path
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => setSelectedSubItem(subItem.path)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
              )
            )}
          </nav>
          <div className="p-4 border-t border-gray-200 space-y-1">
            {/*<Link*/}
            {/*  to="/student-dashboard/settings"*/}
            {/*  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors ${*/}
            {/*    isActive("/student-dashboard/settings")*/}
            {/*      ? "bg-indigo-50 text-indigo-600"*/}
            {/*      : "text-gray-700 hover:bg-gray-50"*/}
            {/*  }`}*/}
            {/*>*/}
            {/*  <Settings className="h-5 w-5" />*/}
            {/*  <span>Settings</span>*/}
            {/*</Link>*/}
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
            <div className="relative">
              {/*<button*/}
              {/*  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"*/}
              {/*  onClick={() => setShowNotifications(!showNotifications)}*/}
              {/*>*/}
              {/*  <Bell className="h-5 w-5" />*/}
              {/*  {unreadCount > 0 && (*/}
              {/*    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>*/}
              {/*  )}*/}
              {/*</button>*/}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="text-sm text-gray-700 mb-2"
                      >
                        <p>{notif.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            notif.createdAt[0], // Year
                            notif.createdAt[1] - 1, // Month (Java months 1-12 → JS months 0-11)
                            notif.createdAt[2], // Day
                            notif.createdAt[3], // Hours
                            notif.createdAt[4], // Minutes
                            notif.createdAt[5] // Seconds
                          ).toLocaleString()}
                        </p>
                        {!notif.isRead && (
                          <button
                            className="text-xs text-blue-500"
                            onClick={() => markAsRead(notif.id)}
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Link
              to="/editprofile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{StudentName}</span>
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
