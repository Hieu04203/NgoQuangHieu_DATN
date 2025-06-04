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
  GraduationCap, Mail, Phone, Calendar, Code
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
      const mainCities = {
        HN: ["ha noi", "hanoi", "hà nội"],
        HCM: ["ho chi minh", "hcm", "hồ chí minh", "sai gon", "sài gòn"],
        DN: ["da nang", "danang", "đà nẵng"]
      };

      switch (filters.location) {
        case "HN":
          return mainCities.HN.some(city => jobLocation.includes(city));
        case "HCM":
          return mainCities.HCM.some(city => jobLocation.includes(city));
        case "DN":
          return mainCities.DN.some(city => jobLocation.includes(city));
        case "OTHER":
          return !Object.values(mainCities).flat().some(city => jobLocation.includes(city));
        default:
          return true;
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

      {/* Cover Background & Profile Section */}
      <div className="bg-[#f7f7f7] min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={studentInfo.profileImageUrl || '/placeholder.svg'}
                      alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {studentInfo.firstName} {studentInfo.lastName}
                      </h1>
                      <p className="text-blue-600 font-medium mb-4">{studentInfo.degree}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {studentInfo.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {studentInfo.phone || 'Chưa cập nhật'}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {studentInfo.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="p-4 text-center border-r border-gray-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{dashboardStats.appliedJobs.count}</div>
                  <div className="text-sm text-gray-600">CV đã nộp</div>
                </div>
                <div className="p-4 text-center border-r border-gray-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">{dashboardStats.viewedAds.count}</div>
                  <div className="text-sm text-gray-600">Lượt xem hồ sơ</div>
                </div>
                <div className="p-4 text-center border-r border-gray-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{filteredJobs.length}</div>
                  <div className="text-sm text-gray-600">Việc làm phù hợp</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{dashboardStats.completedTests.count}</div>
                  <div className="text-sm text-gray-600">Bài test hoàn thành</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Education Card */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Thông tin học vấn
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trường</label>
                    <p className="text-gray-900">{studentInfo.university}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Chuyên ngành</label>
                    <p className="text-gray-900">{studentInfo.degree}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Khoa</label>
                    <p className="text-gray-900">{studentInfo.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">GPA</label>
                    <p className="text-gray-900">{studentInfo.gpa || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Kỹ năng
                  </h2>
                </div>
                <div className="p-4">
                  <SkillProgress student={studentInfo} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm việc làm..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      value={filters.jobType}
                      onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    >
                      <option value="all">Tất cả hình thức</option>
                      <option value="Full-time">Toàn thời gian</option>
                      <option value="Part-time">Bán thời gian</option>
                    </select>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="all">Tất cả địa điểm</option>
                      <option value="HN">Hà Nội</option>
                      <option value="HCM">Hồ Chí Minh</option>
                      <option value="DN">Đà Nẵng</option>
                      <option value="OTHER">Khác</option>
                    </select>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Việc làm phù hợp
                    </h2>
                    <span className="text-sm text-gray-500">
                      {filteredJobs.length} việc làm
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.jobId}
                      onClick={() => handleJobClick(job.jobId)}
                      className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
                            {job.jobTitle}
                          </h3>
                          <p className="text-gray-600 mb-2">{job.companyName}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                        <div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${job.jobType === 'FULLTIME' || job.jobType === 'Full-time'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                            }`}>
                            {job.jobType === 'FULLTIME' || job.jobType === 'Full-time' ? 'Full-time' : 'Part-time'}
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
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
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
          <div className="mt-6">
            <StudentCompanies />
          </div>

          {/* Advertisement Section */}
          <div className="mt-6">
            <StudentAdvertisement />
          </div>
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
