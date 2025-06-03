import React, { useState } from "react";
import { X } from "lucide-react";
import { saveJob } from "../../../api/JobDetailsApi";

// Danh sách công nghệ có sẵn
const allTechnologies = [
  "Spring Boot", "React", "Node.js", "Python", "MongoDB",
  "JavaScript", "TypeScript", "Java", "C++", "Docker",
  "Kubernetes", "AWS", "Azure", "GraphQL", "REST API",
];

function JobPostForm({ onClose, onSubmit, companyId }) {
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobType: "Full-time",
    description: "",
    requirements: "",
    rate: 0,
    location: "",
    technologies: [],
    status: "ACTIVE"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await saveJob(jobData, companyId);
      if (response.success) {
        onSubmit(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Job inserting failed. Please try again.');
    }
  };

  const addTechnology = (techName) => {
    if (techName && !jobData.technologies.some(t => t.techName === techName)) {
      setJobData(prev => ({
        ...prev,
        technologies: [...prev.technologies, { techName }]
      }));
    }
  };

  const removeTechnology = (techName) => {
    setJobData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t.techName !== techName)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Đăng việc làm mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên công việc
            </label>
            <input
              type="text"
              required
              value={jobData.jobTitle}
              onChange={(e) =>
                setJobData(prev => ({ ...prev, jobTitle: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại công việc
              </label>
              <select
                value={jobData.jobType}
                onChange={(e) =>
                  setJobData(prev => ({ ...prev, jobType: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={jobData.status}
                onChange={(e) =>
                  setJobData(prev => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miêu tả
            </label>
            <textarea
              required
              value={jobData.description}
              onChange={(e) =>
                setJobData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu
            </label>
            <textarea
              required
              value={jobData.requirements}
              onChange={(e) =>
                setJobData(prev => ({ ...prev, requirements: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lương ($/tháng)
            </label>
            <input
              type="number"
              required
              value={jobData.rate}
              onChange={(e) =>
                setJobData(prev => ({ ...prev, rate: parseInt(e.target.value) || 0 }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí
            </label>
            <input
              type="text"
              required
              value={jobData.location}
              onChange={(e) =>
                setJobData(prev => ({ ...prev, location: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Công nghệ
              </label>
            </div>
            <div className="space-y-4">
              <select
                onChange={(e) => addTechnology(e.target.value)}
                value=""
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Chọn công nghệ</option>
                {allTechnologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {jobData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech.techName}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech.techName)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Đăng việc làm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobPostForm;