import { useEffect, useState, useContext } from 'react';
import { getJobDetails } from '../../../api/JobDetailsApi';
import { applyForJob } from '../../../api/StudentDetailsApi';
import { AuthContext } from '../../../api/AuthProvider';
import { X, MapPin, Building2, DollarSign, Calendar, Building } from 'lucide-react';
import Swal from 'sweetalert2';

function JobDetailModal({ jobId, onClose }) {
    const [jobDetail, setJobDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const handleApply = async () => {
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
            const studentId = extractUserIdFromToken(token);
            if (!studentId) throw new Error('Không tìm thấy ID ứng viên');

            await applyForJob({
                jobId: jobId,
                studentId: studentId
            });

            Swal.fire({
                icon: 'success',
                title: 'Đã nộp đơn!',
                text: 'Đơn xin việc của bạn đã được gửi thành công.',
                timer: 3000,
                showConfirmButton: false
            });

            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ứng tuyển không thành công',
                text: error.message || 'Không nộp được đơn',
            });
        }
    };

    useEffect(() => {
        async function fetchJobDetail() {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching details for job ID:', jobId);

                const response = await getJobDetails(jobId);
                console.log('Job details response:', response);

                if (response.success && response.data) {
                    setJobDetail(response.data);
                } else {
                    setError(response.message || 'Không thể tải thông tin công việc');
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError('Lỗi khi kết nối server');
            } finally {
                setLoading(false);
            }
        }

        if (jobId) fetchJobDetail();
    }, [jobId]);

    // Prevent scroll on body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // Close modal when clicking outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                )}

                {jobDetail && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <div className="w-full h-full flex items-center justify-center">
                                    {jobDetail.companyName ? (
                                        <div className="text-center">
                                            <span className="text-xl font-medium text-gray-600">
                                                {jobDetail.companyName.split(' ').map(word => word[0]).join('')}
                                            </span>
                                        </div>
                                    ) : (
                                        <Building className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{jobDetail.jobTitle}</h2>
                                <p className="text-lg text-gray-600 mt-1">{jobDetail.companyName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Địa điểm</p>
                                    <p className="text-sm text-gray-600">{jobDetail.location || 'Không có địa điểm'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Loại công việc</p>
                                    <p className="text-sm text-gray-600">{jobDetail.jobType || 'Không xác định'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Mức lương</p>
                                    <p className="text-sm text-gray-600">{jobDetail.rate || 'Thương lượng'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Hạn nộp</p>
                                    <p className="text-sm text-gray-600">
                                        {jobDetail.deadline
                                            ? new Date(jobDetail.deadline).toLocaleDateString('vi-VN')
                                            : 'Không có hạn nộp'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {jobDetail.technologies && jobDetail.technologies.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Công nghệ yêu cầu</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobDetail.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full"
                                        >
                                            {tech.techName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả công việc</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 whitespace-pre-line">{jobDetail.description || 'Không có mô tả'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu ứng viên</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 whitespace-pre-line">{jobDetail.requirements || 'Không có yêu cầu cụ thể'}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                onClick={handleApply}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Ứng tuyển ngay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobDetailModal;
