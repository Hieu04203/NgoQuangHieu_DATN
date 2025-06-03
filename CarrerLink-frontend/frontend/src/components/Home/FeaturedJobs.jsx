import React from 'react';
import { Briefcase, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedJobs = () => {
    const jobs = [
        {
            id: 1,
            title: 'Frontend Developer',
            company: 'Tech Solutions',
            location: 'Hà Nội',
            salary: '1000$ - 2000$',
            type: 'Full-time',
            logo: 'https://randomuser.me/api/portraits/men/1.jpg',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            id: 2,
            title: 'Backend Developer',
            company: 'Digital Innovations',
            location: 'Hồ Chí Minh',
            salary: '1500$ - 2500$',
            type: 'Full-time',
            logo: 'https://randomuser.me/api/portraits/men/2.jpg',
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Đà Nẵng',
            salary: '1200$ - 2200$',
            type: 'Full-time',
            logo: 'https://randomuser.me/api/portraits/men/3.jpg',
            gradient: 'from-teal-500 to-green-600'
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Cơ hội việc làm</span>
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Công việc nổi bật
                    </h2>
                    <p className="text-xl text-gray-600">Khám phá những cơ hội việc làm hấp dẫn từ các công ty hàng đầu</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <div key={job.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1">
                            <div className="flex items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${job.gradient} flex items-center justify-center text-white p-2 transform group-hover:scale-110 transition-transform`}>
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                    <p className="text-gray-600">{job.company}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                    <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                                    <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                                    <span>{job.type}</span>
                                </div>
                            </div>

                            <Link
                                to={`/jobs/${job.id}`}
                                className={`block w-full text-center py-3 px-4 bg-gradient-to-r ${job.gradient} text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/jobs"
                        className="group inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                    >
                        Xem tất cả công việc
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedJobs; 