import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../api/AuthProvider";
import {
  getStudentByUsername,
  getProjectRecommendations,
} from "../api/StudentDetailsApi";
import { getAllJobs } from "../api/JobsApi";
import { Link } from "react-router-dom";
import { Loader2, MapPin, Building, DollarSign, Clock, Search, Filter, Briefcase, Eye, CheckCircle } from "lucide-react";
import SkillProgress from "../components/studentDashboard/SkillProgress";
import TechJobCard from "../components/studentDashboard/TechJobCard";
import SuggestedProjects from "../components/Dashboard/StudentDashboard/SuggestedProjects";
import JobDetailModal from "../components/Dashboard/StudentDashboard/JobDetailModal";
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
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const { token } = useContext(AuthContext);

  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
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
        // Fetch student data
        const userId = extractUsernameFromToken(token);
        if (!userId) {
          console.error('Không thể lấy userId từ token');
          return;
        }

        const studentResponse = await getStudentByUsername(userId);
        if (isMounted && studentResponse?.success) {
          setStudentInfo(studentResponse.data);
          setSkills(studentResponse.data.skills || []);
          setTechnologies(studentResponse.data.technologies || []);
          setJobFields(studentResponse.data.appliedJobFields || []);
        }

        // Fetch jobs data
        const jobsResponse = await getAllJobs();
        console.log('Jobs response:', jobsResponse);
        if (jobsResponse?.success && Array.isArray(jobsResponse.data)) {
          // Log job data for debugging
          jobsResponse.data.forEach(job => {
            console.log('Job data:', {
              jobId: job.jobId,
              companyName: job.companyName,
              companyId: job.companyId,
              companyPicUrl: job.companyPicUrl
            });
          });

          setJobs(jobsResponse.data);
        } else {
          console.error('Invalid jobs response:', jobsResponse);
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setJobs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && job.jobType === filterType;
  });

  const handleJobClick = (jobId) => {
    console.log('Opening job details for ID:', jobId);
    setSelectedJobId(jobId);
  };

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
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <img
                  src={studentInfo.profileImageUrl || '/placeholder.svg'}
                  alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                  className="w-32 h-32 rounded-full mb-4 object-cover ring-4 ring-white shadow-lg border-4 border-indigo-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-900">
                  {studentInfo.firstName} {studentInfo.lastName}
                </h2>
                <p className="text-gray-600 mb-4">{studentInfo.email}</p>

                <div className="w-full border-t border-gray-100 my-4 pt-4">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="text-left">
                      <p className="text-gray-500 mb-1">Trường</p>
                      <p className="font-medium text-gray-900">{studentInfo.university}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500 mb-1">Chuyên ngành</p>
                      <p className="font-medium text-gray-900">{studentInfo.degree}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500 mb-1">Khoa</p>
                      <p className="font-medium text-gray-900">{studentInfo.department}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500 mb-1">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{studentInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <SkillProgress student={studentInfo} />
            </div>
          </div>

          {/* Right: Summary Cards + Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Việc làm đã ứng tuyển</h3>
                  <Briefcase className="w-8 h-8 text-indigo-200" />
                </div>
                <p className="text-3xl font-bold mb-1">{dashboardStats.appliedJobs.count}</p>
                <p className="text-indigo-100 text-sm">Đã nộp hồ sơ</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Tin tuyển dụng đã xem</h3>
                  <Eye className="w-8 h-8 text-purple-200" />
                </div>
                <p className="text-3xl font-bold mb-1">{dashboardStats.viewedAds.count}</p>
                <p className="text-purple-100 text-sm">Tin đang hoạt động</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Bài kiểm tra đã làm</h3>
                  <CheckCircle className="w-8 h-8 text-pink-200" />
                </div>
                <p className="text-3xl font-bold mb-1">{dashboardStats.completedTests.count}</p>
                <p className="text-pink-100 text-sm">Bài test đã hoàn thành</p>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm việc làm, công ty, địa điểm..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Tất cả loại công việc</option>
                    <option value="FULLTIME">Toàn thời gian</option>
                    <option value="PARTTIME">Bán thời gian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* All Jobs Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Danh sách việc làm ({filteredJobs.length})
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => handleJobClick(job.jobId)}
                    className="group block bg-white rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="w-full h-full flex items-center justify-center">
                          {job.companyName ? (
                            <div className="text-center">
                              <span className="text-lg font-medium text-gray-600">
                                {job.companyName.split(' ').map(word => word[0]).join('')}
                              </span>
                            </div>
                          ) : (
                            <Building className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {job.jobTitle}
                            </h3>
                            <p className="text-sm text-gray-600">{job.companyName}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${job.jobType === 'FULLTIME' ? 'bg-green-50 text-green-600' :
                              job.jobType === 'PARTTIME' ? 'bg-blue-50 text-blue-600' : ''
                            }`}>
                            {job.jobType === 'FULLTIME' ? 'Toàn thời gian' :
                              job.jobType === 'PARTTIME' ? 'Bán thời gian' : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{job.location || 'Chưa cập nhật địa điểm'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="truncate">{job.rate || 'Thương lượng'}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description || 'Chưa có mô tả'}</p>

                        <div className="flex flex-wrap gap-2">
                          {job.technologies?.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg border border-gray-100"
                            >
                              {tech.techName}
                            </span>
                          ))}
                          {job.technologies?.length > 3 && (
                            <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                              +{job.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <img
                        src="/empty-jobs.svg"
                        alt="Không tìm thấy việc làm"
                        className="mx-auto w-48 h-48"
                      />
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy việc làm phù hợp</p>
                    <p className="text-gray-500">Vui lòng thử lại với các bộ lọc khác</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => {
            console.log('Closing modal');
            setSelectedJobId(null);
          }}
        />
      )}
    </>
  );
};

export default StudentDashboard;
