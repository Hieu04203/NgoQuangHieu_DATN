import React from 'react';
import { UserCircle, FileSearch, Building2, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: UserCircle,
            title: 'Tạo hồ sơ',
            description: 'Tạo hồ sơ chuyên nghiệp với CV đẹp mắt và thông tin chi tiết về kỹ năng, kinh nghiệm của bạn.',
            gradient: 'from-blue-400 to-indigo-600'
        },
        {
            icon: FileSearch,
            title: 'Tìm kiếm công việc',
            description: 'Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu phù hợp với kỹ năng của bạn.',
            gradient: 'from-purple-400 to-pink-600'
        },
        {
            icon: Building2,
            title: 'Ứng tuyển công việc',
            description: 'Dễ dàng ứng tuyển vào các vị trí bạn quan tâm và theo dõi trạng thái ứng tuyển.',
            gradient: 'from-green-400 to-teal-600'
        },
        {
            icon: CheckCircle,
            title: 'Nhận việc mơ ước',
            description: 'Kết nối trực tiếp với nhà tuyển dụng và bắt đầu công việc mơ ước của bạn.',
            gradient: 'from-orange-400 to-pink-600'
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Bắt đầu ngay</span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Quy trình làm việc
                    </h2>
                    <p className="text-xl text-gray-600">4 bước đơn giản để bắt đầu sự nghiệp mới của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${step.gradient} transform transition-transform group-hover:scale-110 group-hover:rotate-3 mb-6`}>
                                    <step.icon className="w-10 h-10 text-white" />
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-full w-full border-t-2 border-indigo-100 -z-10"></div>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks; 