import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../api/AuthProvider';
import { applyForJob, getJobByStudent, getStudentByUsername } from '../../../api/StudentDetailsApi';
import JobDetailModal from './JobDetailModal';
import Swal from 'sweetalert2';

function StudentJobCard({ job, className }) {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const extractUserIdFromToken = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.userId;
        } catch (error) {
            console.error("Token decoding failed:", error);
            return null;
        }
    };

    useEffect(() => {
        const checkAppliedStatus = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userId = extractUserIdFromToken(token);
                if (!userId) {
                    setIsLoading(false);
                    return;
                }

                // Lấy thông tin sinh viên từ userId
                const studentResponse = await getStudentByUsername(userId);
                if (!studentResponse?.success) {
                    throw new Error('Không thể lấy thông tin sinh viên');
                }

                // Sử dụng studentId để lấy danh sách công việc đã ứng tuyển
                const appliedJobs = await getJobByStudent(studentResponse.data.studentId);
                const hasApplied = appliedJobs.some(appliedJob => appliedJob.jobId === job.jobId);
                setIsApplied(hasApplied);
            } catch (error) {
                console.error("Error checking applied status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAppliedStatus();
    }, [token, job.jobId]);

    const handleApplyClick = async () => {
        if (!token) {
            Swal.fire({
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần phải đăng nhập để ứng tuyển vào vị trí này',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#6366f1',
            });
            return;
        }

        try {
            setIsLoading(true);
            const userId = extractUserIdFromToken(token);
            if (!userId) throw new Error('Không tìm thấy ID ứng viên');

            // Lấy thông tin sinh viên trước khi apply
            const studentResponse = await getStudentByUsername(userId);
            if (!studentResponse?.success) {
                throw new Error('Không thể lấy thông tin sinh viên');
            }

            await applyForJob({
                jobId: job.jobId,
                studentId: studentResponse.data.studentId
            });

            setIsApplied(true);

            Swal.fire({
                icon: 'success',
                title: 'Đã nộp đơn!',
                text: 'Đơn xin việc của bạn đã được gửi thành công.',
                timer: 3000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ứng tuyển không thành công',
                text: error.message || 'Không nộp được đơn',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 flex flex-col h-full ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
                    <p className="text-gray-600">
                        {job.location} • {job.jobType}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${job.status === "CLOSED"
                        ? "bg-red-100 text-red-700"
                        : job.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {job.status}
                </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.technologies.map((req, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {req.techName}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center mt-auto space-x-2">
                {isLoading ? (
                    <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                    </div>
                ) : isApplied ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Đã nộp đơn
                    </span>
                ) : (
                    <button
                        onClick={handleApplyClick}
                        className={`px-4 py-2 rounded-lg transition-colors ${job.status === "CLOSED"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        disabled={job.status === "CLOSED"}
                    >
                        {job.status === "CLOSED" ? "Closed" : "Apply Now"}
                    </button>
                )}

                <button
                    onClick={() => setShowDetailModal(true)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                >
                    Xem Chi Tiết
                </button>
            </div>

            {showDetailModal && (
                <JobDetailModal
                    jobId={job.jobId}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
}

export default StudentJobCard;
