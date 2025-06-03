"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../api/AuthProvider"
import { getJobRecommendations, applyForJob } from "../../../api/StudentDetailsApi"
import StudentJobCard from "./StudentJobCard"
import { AlertTriangle, Info } from "lucide-react"
import Swal from 'sweetalert2';
import StudentHeader from "../../Headers/StudentHeader"

const RecommendedJobs = () => {
    const [jobs, setJobs] = useState([])
    const { token } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [recommendationMessages, setRecommendationMessages] = useState(new Set())
    const [appliedJobs, setAppliedJobs] = useState(new Set())

    const extractUserIdFromToken = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]))
            return decoded.userId
        } catch (error) {
            console.error("Token decoding failed:", error)
            return null
        }
    }

    const handleApplyJob = async (jobId, coverLetter) => {
        try {
            const studentId = extractUserIdFromToken(token)
            if (!studentId) throw new Error('Không tìm thấy ID ứng viên')

            await applyForJob({
                jobId: jobId,
                studentId: studentId,
                coverLetter: coverLetter
            });

            // Add to applied jobs
            setAppliedJobs(prev => new Set([...prev, jobId]));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Application Failed',
                text: error.message || 'Không nộp được đơn',
            });
            throw error;
        }
    }

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true)
            setError(null)
            setRecommendationMessages(new Set())

            try {
                if (!token) throw new Error("Không tìm thấy mã thông báo xác thực")

                const studentId = extractUserIdFromToken(token)
                if (!studentId) throw new Error("Không thể trích xuất ID ứng viên từ mã thông báo")

                const response = await getJobRecommendations(studentId)
                if (response.success) {
                    setJobs(response.data)
                    const messages = response.data
                        .map(r => r.message)
                        .filter(Boolean)
                    setRecommendationMessages(new Set(messages))
                } else {
                    throw new Error(response.message || "Không tải được đề xuất")
                }
            } catch (error) {
                setError(error.message)
                console.error("Lỗi khuyến nghị:", error)
            } finally {
                setLoading(false)
            }
        }

        if (token) fetchRecommendations()
    }, [token])

    return (
        <>
            <StudentHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Việc làm được đề xuất</h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {Array.from(recommendationMessages).map((message, index) => (
                        <div
                            key={index}
                            className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-md flex items-start gap-3"
                        >
                            <Info className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p className="text-indigo-700">{message}</p>
                        </div>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array(3).fill().map((_, index) => (
                                <div key={index} className="animate-pulse bg-gray-100 rounded-xl p-6 h-64">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-6"></div>
                                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((recommendation) => ({
                                ...recommendation,
                                job: {
                                    ...recommendation.job,
                                    applied: appliedJobs.has(recommendation.job.jobId)
                                }
                            })).map((recommendation) => (
                                <StudentJobCard
                                    key={recommendation.job.jobId}
                                    job={recommendation.job}
                                    onApply={handleApplyJob}
                                    className="hover:shadow-lg transition-shadow duration-200"
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                Không tìm thấy đề xuất công việc nào dựa trên hồ sơ của bạn
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecommendedJobs