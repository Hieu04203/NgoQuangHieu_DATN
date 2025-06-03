import { useState, useEffect, useContext } from "react";
import { Calendar } from "lucide-react";
import Swal from "sweetalert2";
import { getAllApplicants, getAllJobsByCompany } from "../../../api/JobDetailsApi";
import { ApproveJob } from "../../../api/CompanyDetailsGetApi";
import { AuthContext } from "../../../api/AuthProvider";
import { useNavigate } from 'react-router-dom';

function Applications({ applicants, company }) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [students, setStudents] = useState([]);
  const [interviewDateTimes, setInterviewDateTimes] = useState({});
  const [jobId, setJobId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchCompanyData = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const response = await getAllJobsByCompany(company.id);
        if (isMounted && response?.success) {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công việc", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompanyData();
    return () => { isMounted = false; };
  }, [token]);

  const handleApplicantsChange = async (jobId) => {
    try {
      const response = await getAllApplicants(jobId);
      if (response?.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm dữ liệu ứng viên", error);
    }
  };

  const handleDateTimeChange = (applicantId, dateTime) => {
    setInterviewDateTimes(prev => ({
      ...prev,
      [applicantId]: dateTime
    }));
  };

  const sendNotification = async (studentId, message) => {
    try {
      const response = await fetch('http://localhost:8091/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, message })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Lỗi thông báo', error);
      Swal.fire('Lỗi', 'Không gửi được thông báo', 'Lỗi');
    }
  };

  const handleApproveJob = async (studentId, jobId) => {
    const dateTime = interviewDateTimes[studentId];
    if (!dateTime) {
      Swal.fire({
        icon: "cảnh báo",
        title: "Ngày & giờ phỏng vấn yêu cầu",
        text: "Vui lòng chỉ định ngày và giờ phỏng vấn trước khi phê duyệt.",
        confirmButtonColor: "#ff9800",
      });
      return;
    }

    const selectedDateTime = new Date(dateTime);
    const currentDateTime = new Date();

    if (selectedDateTime < currentDateTime) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date/Time",
        text: "Vui lòng chọn ngày và giờ phỏng vấn trong tương lai.",
        confirmButtonColor: "#f44336",
      });
      return;
    }
    const isoInterviewDate = `${dateTime}:00.000Z`;

    const requestBody = {
      id: 0,
      interviewDate: isoInterviewDate, // Use the formatted date
      status: true,
    };

    try {
      const response = await ApproveJob(studentId, jobId, requestBody);
      if (response?.success) {
        const formattedDateTime = new Date(isoInterviewDate).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        await sendNotification(
          studentId,
          `CV của bạn cho ${selectedPosition} đã được chấp thuận! Cuộc phỏng vấn được lên lịch vào ${formattedDateTime}`
        );

        setStudents(prev => prev.map(student =>
          student.studentId === studentId ? { ...student, status: true } : student
        ));

        Swal.fire({
          icon: "success",
          title: "Đồng ý",
          text: "Người nộp đơn được chấp thuận và thông báo chi tiết về cuộc phỏng vấn.",
          confirmButtonColor: "#4CAF50",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chấp thuận người nộp đơn", error);
      Swal.fire({
        icon: "error",
        title: "Phê duyệt không thành công",
        text: error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
        confirmButtonColor: "#f44336",
      });
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-4 sticky top-0 z-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Lĩnh vực</h2>
        <div className="flex flex-wrap gap-2">
          {company.jobs.map((job) => (
            <button
              key={job.jobId}
              onClick={() => {
                setSelectedPosition(job.jobTitle);
                setJobId(job.jobId);
                handleApplicantsChange(job.jobId);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPosition === job.jobTitle
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {job.jobTitle}
            </button>
          ))}
        </div>
      </div>

      {students.map((applicant) => (
        <div key={applicant.studentId} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 w-[300px]">
              <img
                src={applicant.profileImageUrl || "/placeholder.svg"}
                alt={`${applicant.firstName} ${applicant.lastName}`}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg border-2 border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.svg';
                }}
              />
              <div>
                <h3 className="font-medium text-base">{`${applicant.firstName} ${applicant.lastName}`}</h3>
                <p className="text-sm text-gray-600">{applicant.university}</p>
              </div>
            </div>

            <div className="w-[120px]">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${applicant.status ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                }`}>
                {applicant.status ? "Đã phê duyệt" : "Chưa phê duyệt"}
              </span>
            </div>

            <div className="flex items-center gap-2 w-[300px]">
              <input
                type="datetime-local"
                value={interviewDateTimes[applicant.studentId] || ""}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => handleDateTimeChange(applicant.studentId, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>

            <div className="flex gap-2 w-[280px] justify-end">
              <button
                onClick={() => navigate(`/student-dashboard/viewcv/${applicant.studentId}`)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                Xem CV
              </button>
              <button
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors"
                onClick={() => handleApproveJob(applicant.studentId, jobId)}
              >
                Chấp thuận
              </button>
              <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors">
                Từ chối
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Applications;