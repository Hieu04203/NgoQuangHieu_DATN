import React from 'react';
import { BookOpen, Clock, DollarSign, Users, Star, TrendingUp, Award, CheckCircle } from 'lucide-react';

const featuredCourses = [
    {
        id: 1,
        title: 'Full Stack Web Development',
        provider: 'Tech Academy',
        image: 'https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg',
        duration: '6 tháng',
        price: '599',
        students: 1200,
        rating: 4.8,
        level: 'Trung cấp',
        skills: ['React', 'Node.js', 'MongoDB'],
        highlights: ['Dự án thực tế', 'Chứng chỉ quốc tế', 'Hỗ trợ việc làm']
    },
    {
        id: 2,
        title: 'Data Science & Machine Learning',
        provider: 'Data Institute',
        image: 'https://img-c.udemycdn.com/course/750x422/2776760_f176_10.jpg',
        duration: '8 tháng',
        price: '799',
        students: 800,
        rating: 4.7,
        level: 'Nâng cao',
        skills: ['Python', 'TensorFlow', 'SQL'],
        highlights: ['AI Projects', 'IBM Partnership', 'Career Coaching']
    },
    {
        id: 3,
        title: 'UI/UX Design Masterclass',
        provider: 'Design School',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072321239ff4d4/jhep-coursera-course4.png',
        duration: '4 tháng',
        price: '449',
        students: 1500,
        rating: 4.9,
        level: 'Cơ bản đến nâng cao',
        skills: ['Figma', 'Adobe XD', 'Sketch'],
        highlights: ['Portfolio Building', 'Industry Projects', 'Mentorship']
    },
    {
        id: 4,
        title: 'Cloud Computing AWS',
        provider: 'Cloud Academy',
        image: 'https://img-c.udemycdn.com/course/750x422/2196488_8fc7_10.jpg',
        duration: '5 tháng',
        price: '699',
        students: 950,
        rating: 4.6,
        level: 'Chuyên sâu',
        skills: ['AWS', 'DevOps', 'Security'],
        highlights: ['AWS Certification', 'Live Projects', 'Expert Support']
    }
];

const StudentAdvertisement = () => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Khóa học nổi bật
                    </h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Xem tất cả
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {featuredCourses.map((course) => (
                    <div
                        key={course.id}
                        className="group relative bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                    >
                        {/* Course Image */}
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{course.rating}</span>
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {course.level}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Course Title and Provider */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                                {course.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{course.provider}</p>

                            {/* Course Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span>${course.price}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span>{course.students.toLocaleString()} học viên</span>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Highlights */}
                            <div className="space-y-2">
                                {course.highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{highlight}</span>
                                    </div>
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

export default StudentAdvertisement; 