import React from 'react';
import { Building2, Users, MapPin, Briefcase, Star, TrendingUp } from 'lucide-react';

const featuredCompanies = [
    {
        id: 1,
        name: 'FPT Software',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/2560px-FPT_logo_2010.svg.png',
        industry: 'Công nghệ thông tin',
        employees: '10000+',
        location: 'Hà Nội, Hồ Chí Minh, Đà Nẵng',
        openPositions: 50,
        rating: 4.5,
        description: 'Công ty hàng đầu về giải pháp và dịch vụ công nghệ thông tin tại Việt Nam',
        benefits: ['Chế độ bảo hiểm tốt', 'Đào tạo chuyên sâu', 'Môi trường quốc tế']
    },
    {
        id: 2,
        name: 'Viettel',
        logo: '/images/companies/viettel.svg',
        industry: 'Viễn thông & Công nghệ',
        employees: '20000+',
        location: 'Hà Nội',
        openPositions: 35,
        rating: 4.7,
        description: 'Tập đoàn viễn thông và công nghệ thông tin lớn nhất Việt Nam',
        benefits: ['Lương thưởng hấp dẫn', 'Cơ hội thăng tiến', 'Đãi ngộ tốt']
    },
    {
        id: 3,
        name: 'VNG Corporation',
        logo: '/images/companies/vng.svg',
        industry: 'Internet & Gaming',
        employees: '5000+',
        location: 'Hồ Chí Minh',
        openPositions: 40,
        rating: 4.6,
        description: 'Công ty công nghệ hàng đầu trong lĩnh vực internet và game tại Việt Nam',
        benefits: ['Môi trường startup', 'Văn hóa trẻ trung', 'Phúc lợi đa dạng']
    },
    {
        id: 4,
        name: 'Momo',
        logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
        industry: 'Fintech',
        employees: '2000+',
        location: 'Hồ Chí Minh',
        openPositions: 25,
        rating: 4.8,
        description: 'Ví điện tử hàng đầu Việt Nam với công nghệ thanh toán hiện đại',
        benefits: ['Môi trường năng động', 'Công nghệ tiên tiến', 'Chế độ đãi ngộ tốt']
    }
];

const StudentCompanies = () => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Công ty nổi bật
                    </h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Xem tất cả
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {featuredCompanies.map((company) => (
                    <div
                        key={company.id}
                        className="group relative bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="p-6">
                            {/* Company Logo and Rating */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium text-gray-600">{company.rating}</span>
                                </div>
                            </div>

                            {/* Company Info */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                                {company.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{company.industry}</p>

                            {/* Company Details */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span>{company.employees} nhân viên</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{company.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span>{company.openPositions} vị trí đang tuyển</span>
                                </div>
                            </div>

                            {/* Benefits Tags */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {company.benefits.map((benefit, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                                    >
                                        {benefit}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-indigo-50 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCompanies; 