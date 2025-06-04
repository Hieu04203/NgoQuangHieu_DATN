import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../api/AuthProvider";
import {
  getStudentByUsername,
  getProjectRecommendations,
} from "../api/StudentDetailsApi";
import { getAllJobs } from "../api/JobsApi";
import { Link } from "react-router-dom";
import {
  Loader2, MapPin, Building, DollarSign, Clock, Search, Filter,
  Briefcase, Eye, CheckCircle, Check, RefreshCw, FileText,
  GraduationCap, Mail, Phone, Calendar
} from "lucide-react";
import SkillProgress from "../components/studentDashboard/SkillProgress";
import TechJobCard from "../components/studentDashboard/TechJobCard";
import SuggestedProjects from "../components/Dashboard/StudentDashboard/SuggestedProjects";
import JobDetailModal from "../components/Dashboard/StudentDashboard/JobDetailModal";
import { mockProjects } from "../data/mockProjects";
import StudentHeader from "../components/Headers/StudentHeader";
import StudentAdvertisement from "../components/Dashboard/StudentDashboard/StudentAdvertisement";
import StudentCompanies from "../components/Dashboard/StudentDashboard/StudentCompanies";

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
  const [filters, setFilters] = useState({
    jobType: "all",
    salary: "all",
    experience: "all",
    location: "all"
  });
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
    // Tìm kiếm theo tên công việc, công ty, địa điểm và mô tả
    const searchFields = [
      job.jobTitle?.toLowerCase(),
      job.companyName?.toLowerCase(),
      job.location?.toLowerCase(),
      job.description?.toLowerCase(),
      job.requirements?.toLowerCase()
    ];

    const matchesSearch = searchTerm === "" || searchFields.some(field =>
      field && field.includes(searchTerm.toLowerCase())
    );

    // Áp dụng các bộ lọc
    const matchesJobType = filters.jobType === "all" || job.jobType === filters.jobType;

    const matchesSalary = filters.salary === "all" || (() => {
      const rate = job.rate || 0;
      switch (filters.salary) {
        case "0-500": return rate <= 500;
        case "500-1000": return rate > 500 && rate <= 1000;
        case "1000-2000": return rate > 1000 && rate <= 2000;
        case "2000+": return rate > 2000;
        default: return true;
      }
    })();

    const matchesLocation = filters.location === "all" || (() => {
      const jobLocation = job.location?.toLowerCase() || "";
      switch (filters.location) {
        case "HN": return jobLocation.includes("ha noi") || jobLocation.includes("hanoi") || jobLocation.includes("hà nội");
        case "HCM": return jobLocation.includes("ho chi minh") || jobLocation.includes("hcm") || jobLocation.includes("hồ chí minh");
        case "DN": return jobLocation.includes("da nang") || jobLocation.includes("danang") || jobLocation.includes("đà nẵng");
        case "OTHER": return !jobLocation.includes("ha noi") && !jobLocation.includes("hanoi") && !jobLocation.includes("hà nội") &&
          !jobLocation.includes("ho chi minh") && !jobLocation.includes("hcm") && !jobLocation.includes("hồ chí minh") &&
          !jobLocation.includes("da nang") && !jobLocation.includes("danang") && !jobLocation.includes("đà nẵng");
        default: return true;
      }
    })();

    return matchesSearch && matchesJobType && matchesSalary && matchesLocation;
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

      {/* Hero Section with Profile Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <img
                src={studentInfo.profileImageUrl || '/placeholder.svg'}
                alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white/50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute -bottom-2 right-0 bg-green-500 px-3 py-1 rounded-full text-xs font-medium">
                Đang tìm việc
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {studentInfo.firstName} {studentInfo.lastName}
              </h1>
              <div className="flex items-center gap-6 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {studentInfo.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {studentInfo.phone || 'Chưa cập nhật'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {studentInfo.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.appliedJobs.count}</div>
              <div className="text-sm text-gray-600">CV đã nộp</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.viewedAds.count}</div>
              <div className="text-sm text-gray-600">Lượt xem hồ sơ</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{filteredJobs.length}</div>
              <div className="text-sm text-gray-600">Việc làm phù hợp</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.completedTests.count}</div>
              <div className="text-sm text-gray-600">Bài test hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  Thông tin học vấn
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Trường</label>
                  <p className="font-medium text-gray-900">{studentInfo.university}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Chuyên ngành</label>
                  <p className="font-medium text-gray-900">{studentInfo.degree}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Khoa</label>
                  <p className="font-medium text-gray-900">{studentInfo.department}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">GPA</label>
                  <p className="font-medium text-gray-900">{studentInfo.gpa || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  Kỹ năng
                </h2>
              </div>
              <div className="p-6">
                <SkillProgress student={studentInfo} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm việc làm..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  >
                    <option value="all">Tất cả hình thức</option>
                    <option value="Full-time">Toàn thời gian</option>
                    <option value="Part-time">Bán thời gian</option>
                  </select>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="all">Tất cả địa điểm</option>
                    <option value="HN">Hà Nội</option>
                    <option value="HCM">Hồ Chí Minh</option>
                    <option value="DN">Đà Nẵng</option>
                  </select>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.salary}
                    onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                  >
                    <option value="all">Mức lương</option>
                    <option value="0-500">Dưới $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000-2000">$1000 - $2000</option>
                    <option value="2000+">Trên $2000</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    Việc làm phù hợp
                  </span>
                  <span className="text-sm text-gray-500">
                    {filteredJobs.length} việc làm
                  </span>
                </h2>
              </div>
              <div className="divide-y">
                {filteredJobs.map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => handleJobClick(job.jobId)}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {job.companyPicUrl ? (
                          <img
                            src={job.companyPicUrl}
                            alt={job.companyName}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {job.jobTitle}
                        </h3>
                        <p className="text-gray-600 mb-2">{job.companyName}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.rate || 'Thương lượng'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.jobType === 'FULLTIME' ? 'Toàn thời gian' : 'Bán thời gian'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.jobType === 'FULLTIME'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {job.jobType === 'FULLTIME' ? 'Full-time' : 'Part-time'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Không tìm thấy việc làm phù hợp
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Hãy thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({
                          jobType: "all",
                          salary: "all",
                          location: "all"
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="mt-12">
          <StudentCompanies />
        </div>

        {/* Advertisement Section */}
        <div className="mt-12">
          <StudentAdvertisement />
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          studentId={studentInfo.id}
        />
      )}
    </>
  );
};

export default StudentDashboard;
