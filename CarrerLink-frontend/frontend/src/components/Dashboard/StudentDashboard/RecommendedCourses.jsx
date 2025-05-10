import { useState, useEffect, useContext } from "react";
import DashboardLayout from "../StudentDashboard/StudentDashboardLayout";
import { AuthContext } from "../../../api/AuthProvider";
import { getRecommendedCourses,getStudentByUsername } from "../../../api/StudentDetailsApi";
import CourseCard from "../../Cards/CourseCard";
import { AlertTriangle, Info } from "lucide-react";

const RecommendedCourses = () => {
  const [courses, setCourses] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractUserIdFromToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.userId;
    } catch (error) {
      console.error("Giải mã mã thông báo không thành công", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) throw new Error("Không tìm thấy mã thông báo xác thực");

        const userId = extractUserIdFromToken(token);
        if (!userId) throw new Error("Không thể trích xuất ID người dùng từ mã thông báo");

        // First get the studentId using userId
        const studentResponse = await getStudentByUsername(userId);
        if (!studentResponse.success || !studentResponse.data?.studentId) {
          throw new Error(
              "Không tìm thấy hồ sơ Ứng viên. Vui lòng hoàn thiện hồ sơ của bạn."
          );
        }
        const studentId = studentResponse.data.studentId;
        const response = await getRecommendedCourses(studentId);
        if (response.success) {
          setCourses(response.data || []);
        } else {
          throw new Error(
              response.message || "Không tải được đề xuất"
          );
        }
      } catch (error) {
        let errorMessage = error.message;
        if (error.message.includes("profile not found")) {
          errorMessage =
              "Vui lòng hoàn tất hồ sơ ứng viên của bạn để nhận được lời giới thiệu.";
        }
        setError(errorMessage);
        console.error("Recommendations error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRecommendations();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
          Các thông báo được đề xuất
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-100 rounded-xl p-6 h-64"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                className="hover:shadow-lg transition-shadow duration-200"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Không tìm thấy đề xuất nào dựa trên hồ sơ của bạn
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecommendedCourses;
