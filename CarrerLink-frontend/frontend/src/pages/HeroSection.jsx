import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Users, Building2, ArrowRight, Briefcase } from 'lucide-react';
import heroimg from "../assets/HeroSection/HeroImg.jpg";

const HeroSection = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 py-24 md:py-32 flex flex-col md:flex-row items-center">
                    {/* Left side content */}
                    <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-up">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Kết nối tương lai của bạn<br />
                            <span className="text-indigo-600 animate-gradient-text">Với các công ty hàng đầu</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in">
                            Tham gia cùng hàng ngàn sinh viên và công ty tạo nên những kết nối có ý nghĩa. Cơ hội nghề nghiệp tiếp theo của bạn đang chờ đón.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                            <Link
                                to="/student-auth"
                                className="group px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                Tìm kiếm cơ hội
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/company-auth"
                                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105">
                                Dành cho các công ty
                            </Link>
                        </div>
                    </div>
                    {/* Right side image */}
                    <div className="md:w-1/2 relative animate-fade-in-left">
                        <img
                            src={heroimg}
                            alt="Team collaboration"
                            className="rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:scale-105"
                        />
                        <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg animate-bounce-slow">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-600" />
                                <span className="font-semibold">Hơn 10.000 vị trí thành công</span>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg animate-bounce-slow animation-delay-500">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                                <span className="font-semibold">Hơn 500 công ty đối tác</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default HeroSection;