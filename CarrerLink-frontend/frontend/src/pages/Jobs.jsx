import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUpRight, Search } from 'lucide-react';
import { getAllJobs } from '../api/JobDetailsApi';
import { useNavigate } from 'react-router-dom';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const JobCard = ({ job }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src={job.companyPicUrl || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop"}
              alt={job.jobType}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{job.jobTitle}</h3>
              <p className="text-sm text-blue-600">{job.companyName}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
          </div>

          <div className="mt-4 flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{job.location}</span>
          </div>

          {/* Added Technology Section */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tech.techName}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.jobType}
            </span>
          </div>

          <button
            onClick={() => navigate(`/jobs/${job.jobId}`, { state: { job } })}
            className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            Xem chi tiết
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getAllJobs();
        if (isMounted && response?.success) {
          setJobs(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => { isMounted = false };
  }, []);

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(searchLower) ||
      job.companyName.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.jobType.toLowerCase().includes(searchLower) ||
      job.technologies.some(tech => tech.techName.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!jobs.length) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h3 className="text-xl font-semibold text-gray-700">Không tìm thấy việc làm</h3>
      <p className="text-gray-500 mt-2">Vui lòng thử lại sau.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-sm p-4">
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
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy việc làm phù hợp
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy thử từ khóa tìm kiếm khác
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
            >
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;