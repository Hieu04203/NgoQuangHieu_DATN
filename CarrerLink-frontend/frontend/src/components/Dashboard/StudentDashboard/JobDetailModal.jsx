import { useEffect, useState } from 'react';

function JobDetailModal({ jobId, onClose }) {
    const [jobDetail, setJobDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchJobDetail() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`http://localhost:8091/api/jobs/detail/${jobId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                if (data.success && data.data) setJobDetail(data.data);
                else if (!data.success && data.message) setError(data.message);
                else setJobDetail(data);
            } catch (err) {
                console.error(err);
                setError('Lỗi khi kết nối server');
            } finally {
                setLoading(false);
            }
        }

        if (jobId) fetchJobDetail();
    }, [jobId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
                <button
                    onClick={onClose}
                    aria-label="Đóng modal"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                >
                    ✕
                </button>

                {loading && <p className="text-center text-gray-500">Đang tải...</p>}
                {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

                {jobDetail && (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-indigo-700">{jobDetail.jobTitle}</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-gray-700">
                            <div>
                                <p className="font-semibold text-gray-900">Địa điểm</p>
                                <p>{jobDetail.location || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">Loại công việc</p>
                                <p>{jobDetail.jobType || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">Công ty</p>
                                <p>{jobDetail.companyName || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">Trạng thái</p>
                                <p>{jobDetail.status || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">Lương</p>
                                <p>{jobDetail.rate ? `${jobDetail.rate} VNĐ` : 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">Công nghệ</p>
                                <p>{jobDetail.technologies?.length > 0 ? jobDetail.technologies.map(t => t.techName).join(', ') : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="font-semibold text-gray-900 mb-1">Mô tả công việc</p>
                            <p className="text-gray-700 whitespace-pre-line">{jobDetail.description || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-900 mb-1">Yêu cầu</p>
                            <p className="text-gray-700 whitespace-pre-line">{jobDetail.requirements || 'N/A'}</p>
                        </div>
                    </>
                )}

                {!loading && !error && !jobDetail && (
                    <p className="text-center text-gray-500">Không tìm thấy dữ liệu</p>
                )}
            </div>
        </div>
    );
}


export default JobDetailModal;
