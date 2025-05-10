import { getAllJobsByCompany,closeJob } from "../../../api/JobDetailsApi";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../../api/AuthProvider';
import JobPostForm from "./JobPostForm";
import JobCard from "./JobCard";
import EditJob from "./EditJob";

function JobVacancies({ company }) {
    const [showJobForm, setShowJobForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [jobVacancies, setJobVacancies] = useState([]);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const handleEditJob = (jobId) => {
        const jobToEdit = jobVacancies.find(job => job.jobId === jobId);
        if (jobToEdit) { // Ensure job exists
            setSelectedJob(jobToEdit);
            setShowJobForm(false);
        }


    };
    const refreshJobs = async () => {
        try {
            const response = await getAllJobsByCompany(company.id);
            if (response?.success) {
                setJobVacancies(response.data || []);
            }
        } catch (error) {
            console.error("Error refreshing jobs:", error);
        }
    };
    const triggerRefetch = () => setRefetchTrigger(prev => prev + 1);

    const handleJobSubmit = async (submittedJob) => {

        triggerRefetch();

        setShowJobForm(false);
        setSelectedJob(null);
    };

    const handleCloseJob = async (id) => {
        try {
            console.log(id);
            const response = await closeJob(id);
            if (response.success) {
                setJobVacancies(prev =>
                    prev.map(job =>
                        job.jobId === id ? { ...job, status: "CLOSED" } : job
                    )
                );
            }
        } catch (error) {
            console.error("Lỗi khi đóng công việc", error);
            alert("Không thể đóng công việc");
        }
    };

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
                    setJobVacancies(response.data || []);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu công việc", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCompanyData();
        return () => { isMounted = false; };
    }, [token, company.id,refetchTrigger]);


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Việc làm</h2>
                <button
                    onClick={triggerRefetch}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Refresh
                </button>
                <button
                    onClick={() => setShowJobForm(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Đăng việc làm mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobVacancies.map((job, index) => (
                    <JobCard
                        key={index}
                        job={job}
                        onEdit={handleEditJob}
                        onClose={handleCloseJob}
                    />
                ))}
            </div>

            {showJobForm && (
                <JobPostForm
                    onClose={() => setShowJobForm(false)}
                    onSubmit={handleJobSubmit}
                    companyId={company.id}
                />
            )}

            {selectedJob && (
                <EditJob
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onSubmit={handleJobSubmit}
                    companyId={company.id}
                />
            )}
        </div>
    );
}

export default JobVacancies;