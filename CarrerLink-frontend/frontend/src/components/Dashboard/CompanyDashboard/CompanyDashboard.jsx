import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../../api/AuthProvider';
import ContactEmployee from "./ContactEmployee";
import FeaturesAndPartners from "./FeaturesAndPartners";
import Applications from "./Applications";
import { getCompanyDetailsByUsername, getCompanyStatistics } from "../../../api/CompanyDetailsApi";
import { getApprovedApplicants } from "../../../api/CompanyDetailsGetApi";
import JobVacancies from "./JobVacancies";
import StatisticsChart from "./StatisticsChart";
import {
  Users,
  Briefcase,
  Building2,
  Bell,
  Settings,
  User,
  BarChart as ChartBar,
  FileText,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  Star,
  CheckCircle,
  Download,
  Eye,
  ThumbsUp,
  X,
} from "lucide-react";
import CompanyHeader from "../../companyDashboard/CompanyHeader";
import JobPostForm from "./JobPostForm";
import JobCard from "./JobCard";
import { getAllJobsByCompany } from "../../../api/JobDetailsApi";

function CompanyDashboard() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [approvedapplicant, setApproved] = useState([{}]);
  const [company, setCompany] = useState({});
  const [companyJobs, setCompanyJobs] = useState([]);
  const [statistics, setStatistics] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    interviewScheduled: 0,
    hired: 0
  });

  const applicants = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Frontend Developer Intern",
      university: "MIT",
      skills: ["React", "JavaScript", "TypeScript"],
      status: "Interview Scheduled",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "UX Design Associate",
      university: "Stanford",
      skills: ["Figma", "UI/UX", "Adobe XD"],
      status: "Application Review",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
    },
  ];
  const companyInfo = {
    name: "TechBridge Solutions",
    logo: "https://images.unsplash.com/photo-1496200186974-4293800e2c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    description:
      "TechBridge Solutions is a pioneering platform dedicated to bridging the gap between talented undergraduates and innovative companies. We leverage cutting-edge technology to analyze student strengths, recommend skill improvements, and facilitate meaningful connections with employers. Our mission is to empower the next generation of professionals while helping companies find their perfect match.",
    technologies: [
      { items: ["React", "TypeScript", "Tailwind CSS"] },
      { items: ["Node.js", "Express", "Python"] },
      { items: ["PostgreSQL", "MongoDB", "Redis"] },
      { items: ["AWS", "Docker", "Kubernetes"] },
    ],
    features: [
      {
        title: "Smart CV Generation",
        description: "AI-powered CV creation and optimization",
        icon: FileText,
      },
      {
        title: "Skill Matching",
        description: "Advanced algorithm for job-skill compatibility",
        icon: CheckCircle,
      },
      {
        title: "Course Recommendations",
        description: "Personalized learning paths",
        icon: Star,
      },
      {
        title: "Analytics Dashboard",
        description: "Comprehensive recruitment insights",
        icon: ChartBar,
      },
    ],
    partners: [
      {
        name: "TechCorp Inc.",
        industry: "Software Development",
        logo: "https://images.unsplash.com/photo-1496200186974-4293800e2c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
      },
      {
        name: "Innovation Labs",
        industry: "Research & Development",
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
      },
      {
        name: "DataSphere",
        industry: "Data Analytics",
        logo: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
      },
    ],
  };
  //--------------------------------------------------------------------------------------------------
  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      if (company?.id) { // Ensure company ID is available
        const approvedResponse = await getAllJobsByCompany(company.id);
        if (approvedResponse?.success) {
          setCompanyJobs(approvedResponse.data);
          console.log(approvedResponse)
        }
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm ứng viên đã được chấp thuận', error);
    }
  };
  //-----------------------useEffect
  useEffect(() => {
    let isMounted = true;

    const fetchCompanyData = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const username = extractUsernameFromToken(token);
        if (!username) return;

        // Fetch company details
        const companyResponse = await getCompanyDetailsByUsername(username);
        if (isMounted && companyResponse?.success) {
          setCompany(companyResponse.data);

          // Fetch approved applicants only if company ID is available
          if (companyResponse.data?.id) {
            const approvedResponse = await getApprovedApplicants(companyResponse.data.id);
            if (isMounted && approvedResponse?.success) {
              setApproved(approvedResponse.data);
            }
          }

          // Fetch statistics after getting company data
          const statsResponse = await getCompanyStatistics(companyResponse.data.id);
          if (isMounted && statsResponse?.success) {
            setStatistics(statsResponse.data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompanyData();

    return () => { isMounted = false; };
  }, [token]); // Dependency array remains the same

  if (loading) return <div>Đang tải...</div>;

  console.log(company);
  // if (!studentInfo) return <div>Student not found</div>;

  //---------------------------------------------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader companyInfo={company} />

      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard", name: "Dashboard", icon: ChartBar },
              { id: "jobs", name: "Việc làm", icon: Briefcase },
              { id: "applicants", name: "Người nộp đơn", icon: Users },
              { id: "about", name: "About", icon: Building2 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${selectedTab === item.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Việc làm đang hoạt động</p>
                    <p className="text-2xl font-bold">{statistics.activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Tổng số ứng viên</p>
                    <p className="text-2xl font-bold">{statistics.totalApplicants}</p>
                  </div>
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Phỏng vấn</p>
                    <p className="text-2xl font-bold">{statistics.interviewScheduled}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Đã thuê</p>
                    <p className="text-2xl font-bold">{statistics.hired}</p>
                  </div>
                  <ChartBar className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Statistics and Approved List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Ứng viên gần đây
                </h2>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {approvedapplicant.map((applicant) => (
                    <div
                      key={applicant.studentId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={applicant.profileImageUrl || "/placeholder.svg"}
                          alt={`${applicant.firstName} ${applicant.lastName}`}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-lg border-2 border-indigo-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.svg';
                          }}
                        />
                        <div>
                          <p className="font-medium">{`${applicant.firstName} ${applicant.lastName}`}</p>
                          <p className="text-sm text-gray-600">
                            {applicant.university}
                          </p>

                        </div>
                        <div className="flex flex-col items-center w-[280px] justify-center">
                          <p className="font-medium">{applicant.interviewDate}</p>
                          <p className="text-sm ">
                            {applicant.jobFieldName}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                        Đã lên lịch phỏng vấn
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Thống kê ứng viên
                </h2>
                <StatisticsChart />
              </div>
            </div>
          </div>
        )}
        {/*//--------------------------Job vacancy section ----------------------------------*/}
        {selectedTab === "jobs" && (

          <JobVacancies company={company} />

        )}
        {selectedTab === "applicants" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Người nộp đơn</h2>
              <div className="flex gap-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Lọc
                </button>
              </div>
            </div>
            {/* --------------- */}
            <Applications applicants={applicants} company={company} />
            {/* ----------------------- */}
          </div>
        )}

        {selectedTab === "about" && (
          <div className="space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4">Giới thiệu về chúng tôi</h2>
              <p className="text-gray-600 mb-6">{company.description}</p>
              <h2 className="text-2xl font-bold mb-4">Yêu cầu</h2>
              <p className="text-gray-600 mb-6">{company.requirements}</p>

              {/* Technologies */}
              <h3 className="text-xl font-semibold mb-4">
                Công nghệ chúng tôi sử dụng
              </h3>
              <div className="flex flex-wrap gap-2">
                {company.technologies?.map((tech) => (
                  <span
                    key={tech.techId}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tech.techName}
                  </span>
                ))}
              </div>
            </div>

            <FeaturesAndPartners companyInfo={company} />

            {/* Contact */}
            <ContactEmployee company={company} />
          </div>
        )}
      </main>


    </div>
  );
}

export default CompanyDashboard;
