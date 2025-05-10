import React, { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import { getAllJobsusingFilters } from "../api/JobDetailsApi";
import { Briefcase, MapPin, Clock, DollarSign, Building2, GraduationCap, Code, GitBranch, Figma, MessageSquare } from 'lucide-react';
import { useLocation } from "react-router-dom";




import { useNavigate } from "react-router-dom";
import { AuthContext } from "../api/AuthProvider";
import Swal from "sweetalert2";

function JobPage() {
  const location = useLocation();
  const job = location.state?.job;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();



  if (!job) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Không tìm thấy việc làm
          </h2>
          <p className="text-gray-600">Vui lòng thử lại từ danh sách công việc</p>
        </div>
    );
  }
  const handleApply =async () => {
    if (!token) {
      Swal.fire({
        title: 'Yêu cầu đăng nhập',
        text: 'Bạn cần phải đăng nhập để ứng tuyển vào vị trí này',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6366f1',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/student-auth'); // Or your login route
        }
      });
      return;
    }


    // Add your actual apply logic here for logged-in users
    console.log('Người dùng đã đăng nhập, tiến hành ứng tuyển');
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{job.companyName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
            <button
                onClick={handleApply}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Nộp đơn ngay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Loại công việc</p>
                <p className="text-sm">{job.jobType}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-sm">Full-Time</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Lương</p>
                <p className="text-sm">LKR {job.rate.toLocaleString()}/month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả công việc</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Công nghệ</h2>
            <div className="flex flex-wrap gap-2">
              {job.technologies?.map((tech, index) => (
                  <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                {tech.techName}
              </span>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
export default JobPage;