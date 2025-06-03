import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            role: 'Frontend Developer tại Tech Corp',
            image: 'https://randomuser.me/api/portraits/men/4.jpg',
            content: 'CareerLink đã giúp tôi tìm được công việc mơ ước. Quy trình ứng tuyển đơn giản và chuyên nghiệp.',
            rating: 5,
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            role: 'UI/UX Designer tại Creative Agency',
            image: 'https://randomuser.me/api/portraits/women/4.jpg',
            content: 'Tôi rất ấn tượng với chất lượng các công việc được đăng tải. Đã nhận được nhiều cơ hội tốt.',
            rating: 5,
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            id: 3,
            name: 'Lê Văn C',
            role: 'Backend Developer tại Fintech Inc',
            image: 'https://randomuser.me/api/portraits/men/5.jpg',
            content: 'Platform tuyệt vời cho cả ứng viên và nhà tuyển dụng. Giao diện đẹp và dễ sử dụng.',
            rating: 5,
            gradient: 'from-teal-500 to-green-600'
        }
    ];

    const renderStars = (rating) => {
        return [...Array(rating)].map((_, index) => (
            <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
        ));
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Đánh giá</span>
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Người dùng nói gì về chúng tôi
                    </h2>
                    <p className="text-xl text-gray-600">Khám phá trải nghiệm từ cộng đồng CareerLink</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-1"
                        >
                            <div className="relative mb-8">
                                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center`}>
                                    <Quote className="w-6 h-6 text-white transform rotate-180" />
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${testimonial.gradient} p-1`}>
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {renderStars(testimonial.rating)}
                            </div>

                            <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                                "{testimonial.content}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 