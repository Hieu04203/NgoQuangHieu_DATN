import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../components/Dashboard/StudentDashboard/StudentDashboardLayout";
import { AuthContext } from "../api/AuthProvider";
import {
  getStudentByUsername,
  getProjectRecommendations,
} from "../api/StudentDetailsApi";
import SkillProgress from "../components/studentDashboard/SkillProgress";
import TechJobCard from "../components/studentDashboard/TechJobCard";
import SuggestedProjects from "../components/Dashboard/StudentDashboard/SuggestedProjects";
import { Loader2 } from "lucide-react";
import { mockProjects } from "../data/mockProjects";
import StudentHeader from "../components/Headers/StudentHeader";

// Fake data for dashboard statistics
const dashboardStats = {
  appliedJobs: {
    count: 15,
    details: [
      { company: "Tech Corp", position: "Frontend Developer", status: "Đang xét duyệt" },
      { company: "Digital Solutions", position: "React Developer", status: "Phỏng vấn" },
      { company: "Innovation Labs", position: "Web Developer", status: "Đã được chấp nhận" }
    ]
  },
  viewedAds: {
    count: 28,
    details: [
      { title: "Senior Web Developer", company: "Tech Giants", salary: "$3000-4000" },
      { title: "Frontend Expert", company: "Digital Corp", salary: "$2500-3500" },
      { title: "React Developer", company: "Software House", salary: "$2800-3800" }
    ]
  },
  completedTests: {
    count: 8,
    details: [
      { name: "JavaScript Advanced", score: 85, total: 100 },
      { name: "React Fundamentals", score: 92, total: 100 },
      { name: "Web Development", score: 88, total: 100 }
    ]
  }
};

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [jobFields, setJobFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Extract username (or userId) from the JWT token
  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error("Lỗi giải mã mã thông báo", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userId = extractUsernameFromToken(token);
        if (!userId) {
          console.error('Không thể lấy userId từ token');
          return;
        }

        // Fetch student data
        const studentResponse = await getStudentByUsername(userId);
        console.log('Student Response:', studentResponse);

        if (isMounted && studentResponse?.success) {
          setStudentInfo(studentResponse.data);
          setSkills(studentResponse.data.skills || []);
          setTechnologies(studentResponse.data.technologies || []);
          setJobFields(studentResponse.data.appliedJobFields || []);
          console.log('Profile Image URL:', studentResponse.data.profileImageUrl);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) return (
    <>
      <StudentHeader />
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    </>
  );
  if (!studentInfo) return (
    <>
      <StudentHeader />
      <div>Không tìm thấy ứng viên</div>
    </>
  );

  return (
    <>
      <StudentHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={studentInfo.profileImageUrl || '/placeholder.svg'}
                  alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                  className="w-32 h-32 rounded-full mb-4 object-cover ring-4 ring-white shadow-lg border-4 border-indigo-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg';
                  }}
                />
                <h2 className="text-xl font-semibold">
                  {studentInfo.firstName} {studentInfo.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{studentInfo.email}</p>

                <div className="w-full border-t border-gray-100 my-4 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">University</p>
                      <p className="font-medium">{studentInfo.university}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Degree</p>
                      <p className="font-medium">{studentInfo.degree}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{studentInfo.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium">{studentInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary Cards + TechJob */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold">Việc làm ứng tuyển</h3>
                <p className="text-3xl font-bold">{dashboardStats.appliedJobs.count}</p>
                <p className="text-indigo-100">Đã nộp đơn</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold">Các quảng cáo đã xem</h3>
                <p className="text-3xl font-bold">{dashboardStats.viewedAds.count}</p>
                <p className="text-purple-100">Các quảng cáo đang hoạt động</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold">Các bài TEST đã hoàn thành</h3>
                <p className="text-3xl font-bold">{dashboardStats.completedTests.count}</p>
                <p className="text-pink-100">Các bài TEST đã qua</p>
              </div>
            </div>

            {/* Tech Jobs */}
            <TechJobCard student={studentInfo} />
          </div>
        </div>

        {/* Full-Width Skills Section (without heading) */}
        <div className="mt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <SkillProgress student={studentInfo} />
            </div>
            <div className="lg:w-2/3">
              <SuggestedProjects projects={mockProjects} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
