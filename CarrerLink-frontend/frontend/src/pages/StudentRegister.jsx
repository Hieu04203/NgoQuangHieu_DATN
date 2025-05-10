import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudentRegisterApi from "../api/StudentRegisterApi";
import { Mail, Lock, User, GraduationCap, MapPin, ArrowRight, ArrowLeft, Camera } from 'lucide-react';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [academicStatus, setAcademicStatus] = useState([]);
    const [newCourse, setNewCourse] = useState({ course: "", result: "" });

    const allTechnologies = [
        "Spring Boot", "React", "Node.js", "Python", "MongoDB",
        "JavaScript", "TypeScript", "Java", "C++", "Docker",
        "Kubernetes", "AWS", "Azure", "GraphQL", "REST API",
    ];

    const allJobFields = [
        "Software Development", "Web Design", "Data Analysis",
        "Machine Learning", "DevOps", "Cloud Computing",
        "Mobile App Development", "UI/UX Design", "Cybersecurity",
        "Artificial Intelligence",
    ];

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
        address: "",
        university: "",
        department: "",
        degree: "",
        academicStatus: [],
        photo: null,
        gpa: "",
        examResults: {
            oop: "",
            se: "",
            dsa: "",
            dbms: "",
            network: "",
            pm: "",
            rad: "",
            webDevelopment: "",
            php: ""
        },
        technologies: [],
        jobsFields: [],
        agreeToTerms: false,

    });

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    const validateRequired = (value) => {
        return value.trim() !== "";
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                photo: e.target.files[0]
            }));
        }
    };

    const addTechnology = (tech) => {
        if (tech && !formData.technologies.some(t => t.techName === tech)) {
            const updatedTechnologies = [...formData.technologies, { techName: tech }];
            setFormData(prev => ({
                ...prev,
                technologies: updatedTechnologies
            }));
        }
    };

    const removeTechnology = (tech) => {
        const updatedTechnologies = formData.technologies.filter(t => t.techName !== tech);
        setFormData(prev => ({
            ...prev,
            technologies: updatedTechnologies
        }));
    };

    const addJobField = (field) => {
        if (field && !formData.jobsFields.some(f => f.jobField === field)) {
            const updatedJobFields = [...formData.jobsFields, { jobField: field }];
            setFormData(prev => ({
                ...prev,
                jobsFields: updatedJobFields
            }));
        }
    };

    const removeJobField = (field) => {
        const updatedJobFields = formData.jobsFields.filter(f => f.jobField !== field);
        setFormData(prev => ({
            ...prev,
            jobsFields: updatedJobFields
        }));
    };

    const nextStep = () => {
        let newErrors = {};

        if (step === 1) {
            // Validate Step 1: Personal Information
            if (!validateRequired(formData.firstName)) {
                newErrors.firstName = "Tên là bắt buộc";
            }
            if (!validateRequired(formData.lastName)) {
                newErrors.lastName = "Họ là bắt buộc";
            }
            if (!validateRequired(formData.userName)) {
                newErrors.userName = "Tên người dùng là bắt buộc";
            }
            if (!validateEmail(formData.email)) {
                newErrors.email = "Địa chỉ email không hợp lệ";
            }
            if (!validatePassword(formData.password)) {
                newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
            }
            if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
                newErrors.confirmPassword = "Mật khẩu không khớp";
            }
            if (!validateRequired(formData.address)) {
                newErrors.address = "Địa chỉ là bắt buộc";
            }
        } else if (step === 2) {
            // Validate Step 2: Education Information
            if (!validateRequired(formData.university)) {
                newErrors.university = "Đại học là bắt buộc";
            }
            if (!validateRequired(formData.department)) {
                newErrors.department = "Chuyên ngành là bắt buộc";
            }
            if (!validateRequired(formData.degree)) {
                newErrors.degree = "Bằng cấp là bắt buộc";
            }
            if (!validateRequired(formData.gpa)) {
                newErrors.gpa = "GPA là bắt buộc";
            }
            if (academicStatus.length === 0) {
                newErrors.academicStatus = "Cần có ít nhất một kết quả khóa học";
            }
        } else if (step === 3) {
            // Validate Step 3: Technologies and Job Fields
            if (formData.technologies.length === 0) {
                newErrors.technologies = "Cần ít nhất một công nghệ";
            }
            if (formData.jobsFields.length === 0) {
                newErrors.jobsFields = "Cần có ít nhất một lĩnh vực công việc";
            }
            if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = "Bạn phải đồng ý với các điều khoản và điều kiện";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let newErrors = {};

        // Validate all steps
        if (!validateRequired(formData.firstName)) {
            newErrors.firstName = "Tên là bắt buộc";
        }
        if (!validateRequired(formData.lastName)) {
            newErrors.lastName = "Họ là bắt buộc";
        }
        if (!validateRequired(formData.userName)) {
            newErrors.userName = "Tên người dùng là bắt buộc";
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = "Địa chỉ email không hợp lệ";
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }
        if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
            newErrors.confirmPassword = "Mật khẩu không khớp";
        }
        if (!validateRequired(formData.address)) {
            newErrors.address = "Địa chỉ là bắt buộc";
        }
        if (!validateRequired(formData.university)) {
            newErrors.university = "Đại học là bắt buộc";
        }
        if (!validateRequired(formData.department)) {
            newErrors.department = "Chuyên ngành là bắt buộc";
        }
        if (!validateRequired(formData.degree)) {
            newErrors.degree = "Bằng cấp là bắt buộc";
        }
        if (!validateRequired(formData.gpa)) {
            newErrors.gpa = "GPA là bắt buộc";
        }
        if (academicStatus.length === 0) {
            newErrors.academicStatus = "Cần có ít nhất một kết quả khóa học";
        }
        if (formData.technologies.length === 0) {
            newErrors.technologies = "Cần ít nhất một công nghệ";
        }
        if (formData.jobsFields.length === 0) {
            newErrors.jobsFields = "Cần có ít nhất một lĩnh vực công việc";
        }
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "Bạn phải đồng ý với các điều khoản và điều kiện";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await StudentRegisterApi(formData);
            console.log('Response:', response);
            navigate("/student-auth", {
                state: { message: "Đã đăng ký thành công!" },
            });
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Đăng ký không thành công. Vui lòng thử lại.');
        }
    };

    const handleExamResultChange = (exam, value) => {
        setFormData(prev => ({
            ...prev,
            examResults: {
                ...prev.examResults,
                [exam]: value
            }
        }));
    };

    const getStepProgress = () => {
        return (step / 3) * 100;
    };

    const addCourse = () => {
        if (!newCourse.course || !newCourse.result) {
            setErrors((prev) => ({
                ...prev,
                academicStatus: "Cả khóa học và kết quả đều được yêu cầu"
            }));
            return;
        }

        const updatedAcademicStatus = [...academicStatus, newCourse];
        setAcademicStatus(updatedAcademicStatus);
        setFormData((prev) => ({
            ...prev,
            academicStatus: updatedAcademicStatus
        }));
        setNewCourse({ course: "", result: "" });
        setErrors((prev) => ({
            ...prev,
            academicStatus: undefined
        }));
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản ứng viên</h2>
                    <p className="mt-2 text-gray-600">Tham gia CareerLink để khám phá các cơ hội</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${getStepProgress()}%` }}
                            ></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full flex justify-between -mt-2">
                            {[1, 2, 3].map((number) => (
                                <div
                                    key={number}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        number <= step
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {number}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <span className="text-sm font-medium text-gray-600">Thông tin cá nhân</span>
                        <span className="text-sm font-medium text-gray-600">Education</span>
                        <span className="text-sm font-medium text-gray-600">Công nghệ & Lĩnh vực</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Step 1: Personal Information */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                           Tên
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="First name"
                                            />
                                        </div>
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Last name"
                                            />
                                        </div>
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên người dùng
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Username"
                                        />
                                    </div>
                                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="student@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Create a password"
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ảnh
                                    </label>
                                    <div className="relative">
                                        <Camera className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="file"
                                            name="photo"
                                            onChange={handleFileChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Education Information */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Trường đại học
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="university"
                                            required
                                            value={formData.university}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter your university"
                                        />
                                    </div>
                                    {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chuyên ngành
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter your department"
                                        />
                                    </div>
                                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bằng cấp
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="degree"
                                            required
                                            value={formData.degree}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., Bachelor of Science"
                                        />
                                    </div>
                                    {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        GPA
                                    </label>
                                    <input
                                        type="text"
                                        name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g., 3.5"
                                    />
                                    {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Kết quả học tập
                                    </label>
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2">Tình trạng học vấn</h3>
                                        <div className="flex items-center mb-2">
                                            <select
                                                className="p-2 border rounded mr-2 flex-1"
                                                value={newCourse.course}
                                                onChange={(e) => setNewCourse(prev => ({...prev, course: e.target.value}))}
                                            >
                                                <option value="">Chọn khóa học</option>
                                                <option value="OOP">OOP</option>
                                                <option value="Programming Techniques">Programming Techniques</option>
                                                <option value="Software Engneering">Software Engneering</option>
                                                <option value="Project Management">Project Management</option>
                                                <option value="Statistics">Statistics</option>
                                                <option value="Data mining">Data Mining</option>
                                            </select>
                                            <select
                                                className="p-2 border rounded mr-2 w-24"
                                                value={newCourse.result}
                                                onChange={(e) => setNewCourse(prev => ({
                                                    ...prev,
                                                    result: e.target.value
                                                }))}
                                            >
                                                <option value="">Kết quả</option>
                                                <option value="A">A</option>
                                                <option value="A-">A-</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>

                                                <option value="F">F</option>

                                                <option value="D+">D+</option>
                                                <option value="E">E</option>

                                            </select>
                                            <button
                                                type="button"
                                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                                onClick={addCourse}
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        {errors.academicStatus && (
                                            <p className="text-red-500 text-xs mt-1">{errors.academicStatus}</p>
                                        )}
                                        {academicStatus.length > 0 && (
                                            <ul className="mt-2 border rounded-lg divide-y">
                                                {academicStatus.map((status, index) => (
                                                    <li key={index} className="flex justify-between p-2">
                                                        <span>{status.course}</span>
                                                        <span>{status.result}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Technologies and Job Fields */}
                        {step === 3 && (
                            <div className="space-y-6">
                                {/* Technologies */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Công nghệ</h3>
                                    <div className="space-y-4">
                                        <select
                                            onChange={(e) => addTechnology(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Chọn một công nghệ</option>
                                            {allTechnologies.map(tech => (
                                                <option key={tech} value={tech}>{tech}</option>
                                            ))}
                                        </select>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.technologies.map(tech => (
                                                <span
                                                    key={tech.techName}
                                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {tech.techName}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTechnology(tech.techName)}
                                                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.technologies && <p className="text-red-500 text-xs mt-1">{errors.technologies}</p>}
                                    </div>
                                </div>

                                {/* Job Fields */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Lĩnh vực công việc</h3>
                                    <div className="space-y-4">
                                        <select
                                            onChange={(e) => addJobField(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Chọn một lĩnh vực công việc</option>
                                            {allJobFields.map(field => (
                                                <option key={field} value={field}>{field}</option>
                                            ))}
                                        </select>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.jobsFields.map(field => (
                                                <span
                                                    key={field.jobField}
                                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {field.jobField}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeJobField(field.jobField)}
                                                        className="ml-2 text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.jobsFields && <p className="text-red-500 text-xs mt-1">{errors.jobsFields}</p>}
                                    </div>
                                </div>

                                {/* Agree to Terms */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        required
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        I agree to the{' '}
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Điều khoản dịch vụ
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Chính sách bảo mật
                                        </a>
                                    </label>
                                    {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-2"/>
                                    Trước
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                                >
                                    Kế tiếp
                                    <ArrowRight className="h-5 w-5 ml-2"/>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                                >
                                    Tạo tài khoản
                                    <ArrowRight className="h-5 w-5 ml-2"/>
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                        Bạn đã có tài khoản?{' '}
                            <Link to="/student-auth" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;