import React, { useEffect, useContext, useState, useRef } from 'react';
// Assuming you have a toast component
import axiosInstance from '../../../api/AxiosInstance'; // Your configured axios instance

import { useNavigate } from 'react-router-dom';
import {
    User,
    Briefcase,
    GraduationCap,
    Heart,
    Wrench,
    FolderGit2,
    Award,
    Coffee,
    FileText,
    FileDown,
    Plus,
    Trash2
} from 'lucide-react';
import StudentHeader from "../../Headers/StudentHeader";
import html2pdf from 'html2pdf.js';
import axios from 'axios'
import { Save } from 'lucide-react';
import { AuthContext } from "../../../api/AuthProvider";
import { SaveCV } from "../../../api/StudentDetailsApi";
import * as sweetalert2 from "sweetalert2";

function App() {
    const { token } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('personal-info');
    const [studentId, setStudent] = useState(null);
    const [formData, setFormData] = useState({
        personalInfo: {
            name: '',
            title: '',
            email: '',
            phone: '',
            location: '',
            summary: '',
            linkedin: '',
            github: '',
        },
        experience: [],
        education: [],
        softSkills: [],
        technicalSkills: {
            frontend: [],
            backend: [],
            languages: [],
            tools: [],
        },
        projects: [],
        certificates: [],
        extracurricular: [],
        references: [],
    });
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [newTechSkill, setNewTechSkill] = useState('');
    const [techCategory, setTechCategory] = useState('frontend');
    const [newTech, setNewTech] = useState('');
    const previewRef = useRef();
    const navigate = useNavigate();
    // Prepare API payload
    const prepareCVData = (formData) => ({
        name: formData.personalInfo.name || '',
        title: formData.personalInfo.title || '',
        email: formData.personalInfo.email || '',
        mobile: formData.personalInfo.phone || '',
        address: formData.personalInfo.location || '',
        githubLink: formData.personalInfo.github || '',
        linkedinLink: formData.personalInfo.linkedin || '',
        summary: formData.personalInfo.summary || '',
        skills: formData.technicalSkills ? transformTechnicalSkills(formData.technicalSkills) : [],
        projects: formData.projects ? formData.projects.map(proj => ({
            projectName: proj.name || '',
            projectDescription: proj.description || '',
            githubLink: proj.link || ''
        })) : [],
        experiences: formData.experience ? formData.experience.map(exp => ({
            jobTitle: exp.title || '',
            companyName: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.current ? null : (exp.endDate || ''),
            description: exp.description || ''
        })) : [],
        educations: formData.education ? formData.education.map(edu => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || '',
            description: edu.description || ''
        })) : [],
        certifications: formData.certificates ? formData.certificates.map(cert => ({
            name: cert.name || '',
            organization: cert.issuer || '',
            issueDate: cert.date || '',
            certificationLink: cert.link || ''
        })) : [],
        softSkills: formData.softSkills || []
    });

    const sections = [
        { id: 'personal-info', title: 'Thông tin cá nhân', icon: <User className="w-5 h-5" /> },
        { id: 'experience', title: 'Kinh nghiệm', icon: <Briefcase className="w-5 h-5" /> },
        { id: 'education', title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
        { id: 'soft-skills', title: 'Kỹ năng mềm', icon: <Heart className="w-5 h-5" /> },
        { id: 'technical-skills', title: 'Kỹ năng kỹ thuật', icon: <Wrench className="w-5 h-5" /> },
        { id: 'projects', title: 'Dự án', icon: <FolderGit2 className="w-5 h-5" /> },
        { id: 'certificates', title: 'Giấy chứng nhận', icon: <Award className="w-5 h-5" /> },
        { id: 'extracurricular', title: 'Hoạt động ngoại khóa', icon: <Coffee className="w-5 h-5" /> }
        //{ id: 'references', title: 'References', icon: <FileText className="w-5 h-5" /> },
    ];

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();
    const minYear = "1950-01-01";
    const maxYear = `${currentYear}-12-31`;

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentId = extractStudentIdFromToken(token);
                setStudent(studentId)
                // const response = await axios.get(`/api/students/${studentId}`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                // setStudent(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu ứng viên", error);
            }
        };

        if (token) {
            fetchStudent();
        }
    }, [token]);

    useEffect(() => {
        const studentId = extractStudentIdFromToken(token);
        console.log('studentID sau khi extract', studentId)
        fetch(`http://localhost:8091/api/students/userId/${studentId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Lỗi HTTP! trạng thái: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                fetch(`http://localhost:8091/api/cv/getCV?studentId=${data.data?.studentId}`)
                    .then((res) => {
                        if (!res.ok) throw new Error(`Lỗi HTTP! trạng thái: ${res.status}`);
                        return res.json();
                    })
                    .then((cvData) => {
                        console.log("Raw CV data:", cvData);
                        if (cvData.data) {
                            // Transform API data to match formData structure
                            setFormData({
                                personalInfo: {
                                    name: cvData.data.name || '',
                                    title: cvData.data.title || '',
                                    email: cvData.data.email || '',
                                    phone: cvData.data.mobile || '',
                                    location: cvData.data.address || '',
                                    summary: cvData.data.summary || '',
                                    linkedin: cvData.data.linkedinLink || '',
                                    github: cvData.data.githubLink || '',
                                },
                                experience: cvData.data.experiences?.map(exp => ({
                                    id: crypto.randomUUID(),
                                    title: exp.jobTitle || '',
                                    company: exp.companyName || '',
                                    startDate: exp.startDate || '',
                                    endDate: exp.endDate || '',
                                    current: !exp.endDate,
                                    description: exp.description || ''
                                })) || [],
                                education: cvData.data.educations?.map(edu => ({
                                    id: crypto.randomUUID(),
                                    degree: edu.degree || '',
                                    institution: edu.institution || '',
                                    location: edu.location || '',
                                    startDate: edu.startDate || '',
                                    endDate: edu.endDate || '',
                                    gpa: edu.gpa || '',
                                    description: edu.description || ''
                                })) || [],
                                softSkills: cvData.data.softSkills || [],
                                technicalSkills: {
                                    frontend: cvData.data.skills?.filter(skill => skill.category === 'frontend').map(skill => skill.techSkill) || [],
                                    backend: cvData.data.skills?.filter(skill => skill.category === 'backend').map(skill => skill.techSkill) || [],
                                    languages: cvData.data.skills?.filter(skill => skill.category === 'languages').map(skill => skill.techSkill) || [],
                                    tools: cvData.data.skills?.filter(skill => skill.category === 'tools').map(skill => skill.techSkill) || []
                                },
                                projects: cvData.data.projects?.map(proj => ({
                                    id: crypto.randomUUID(),
                                    name: proj.projectName || '',
                                    description: proj.projectDescription || '',
                                    link: proj.githubLink || ''
                                })) || [],
                                certificates: cvData.data.certifications?.map(cert => ({
                                    id: crypto.randomUUID(),
                                    name: cert.name || '',
                                    issuer: cert.organization || '',
                                    date: cert.issueDate || '',
                                    link: cert.certificationLink || ''
                                })) || [],
                                extracurricular: [],
                                references: []
                            });
                        }
                    })
                    .catch((err) => console.error("Lỗi tải CV", err));
            })
            .catch((err) => console.error("Lỗi tải thông tin sinh viên", err));
    }, [token])
    const extractStudentIdFromToken = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]))

            return decodedToken.userId; // Adjust based on your token structure
        } catch (error) {
            console.error("Lỗi giải mã mã thông báo", error);
            return null;
        }
    };
    const transformTechnicalSkills = (technicalSkills) => {
        return Object.entries(technicalSkills).flatMap(([category, skills]) =>
            skills.map(skill => ({ techSkill: skill, category }))
        );
    };
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: value,
            },
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: crypto.randomUUID(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
            }],
        }));
    };

    const removeExperience = (id) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id),
        }));
    };

    const handleExperienceChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };
    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: crypto.randomUUID(),
                degree: '',
                institution: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: '',
            }],
        }));
    };

    const removeEducation = (id) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id),
        }));
    };

    const handleEducationChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const addSoftSkill = (skill) => {
        if (skill && !formData.softSkills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                softSkills: [...prev.softSkills, skill],
            }));
        }
    };

    const removeSoftSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            softSkills: prev.softSkills.filter((_, i) => i !== index),
        }));
    };

    const addTechnicalSkill = (category, skill) => {
        if (skill && !formData.technicalSkills[category].includes(skill)) {
            setFormData(prev => ({
                ...prev,
                technicalSkills: {
                    ...prev.technicalSkills,
                    [category]: [...prev.technicalSkills[category], skill],
                },
            }));
        }
    };

    const removeTechnicalSkill = (category, index) => {
        setFormData(prev => ({
            ...prev,
            technicalSkills: {
                ...prev.technicalSkills,
                [category]: prev.technicalSkills[category].filter((_, i) => i !== index),
            },
        }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: crypto.randomUUID(),
                name: '',
                description: '',
                technologies: [],
                link: '',
                startDate: '',
                endDate: '',
            }],
        }));
    };

    const removeProject = (id) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.filter(proj => proj.id !== id),
        }));
    };

    const handleProjectChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === id ? { ...proj, [field]: value } : proj
            ),
        }));
    };

    const addProjectTechnology = (projectId, tech) => {
        if (tech) {
            setFormData(prev => ({
                ...prev,
                projects: prev.projects.map(proj =>
                    proj.id === projectId && !proj.technologies.includes(tech)
                        ? { ...proj, technologies: [...proj.technologies, tech] }
                        : proj
                ),
            }));
        }
    };

    const removeProjectTechnology = (projectId, index) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === projectId
                    ? {
                        ...proj,
                        technologies: proj.technologies.filter((_, i) => i !== index)
                    }
                    : proj
            ),
        }));
    };

    const addCertificate = () => {
        setFormData(prev => ({
            ...prev,
            certificates: [...prev.certificates, {
                id: crypto.randomUUID(),
                name: '',
                issuer: '',
                date: '',
                link: '',
            }],
        }));
    };

    const removeCertificate = (id) => {
        setFormData(prev => ({
            ...prev,
            certificates: prev.certificates.filter(cert => cert.id !== id),
        }));
    };

    const handleCertificateChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            certificates: prev.certificates.map(cert =>
                cert.id === id ? { ...cert, [field]: value } : cert
            ),
        }));
    };

    const addExtracurricular = () => {
        setFormData(prev => ({
            ...prev,
            extracurricular: [...prev.extracurricular, {
                id: crypto.randomUUID(),
                activity: '',
                organization: '',
                role: '',
                startDate: '',
                endDate: '',
                description: '',
            }],
        }));
    };

    const removeExtracurricular = (id) => {
        setFormData(prev => ({
            ...prev,
            extracurricular: prev.extracurricular.filter(extra => extra.id !== id),
        }));
    };

    const handleExtracurricularChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            extracurricular: prev.extracurricular.map(extra =>
                extra.id === id ? { ...extra, [field]: value } : extra
            ),
        }));
    };

    const handleSaveCV = async () => {
        if (!studentId) {
            sweetalert2.fire({
                title: 'Lỗi',
                text: 'Không tìm thấy ID sinh viên',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
            return;
        }

        try {
            const cvData = prepareCVData(formData);
            console.log('CV Data being sent:', cvData);
            const response = await SaveCV(studentId, cvData);
            console.log('Response from SaveCV:', response);

            if (response && response.data) {
                sweetalert2.fire({
                    title: 'Thành công',
                    text: 'CV của bạn đã được lưu thành công!',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top-end'
                });
            } else {
                throw new Error('Không lưu được CV');
            }
        } catch (error) {
            console.error('Lỗi lưu CV:', error);
            sweetalert2.fire({
                title: 'Lỗi',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu CV. Vui lòng thử lại!',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
        }
    };

    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            references: [...prev.references, {
                id: crypto.randomUUID(),
                name: '',
                title: '',
                company: '',
                email: '',
                phone: '',
            }],
        }));
    };

    const removeReference = (id) => {
        setFormData(prev => ({
            ...prev,
            references: prev.references.filter(ref => ref.id !== id),
        }));
    };

    const handleReferenceChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            references: prev.references.map(ref =>
                ref.id === id ? { ...ref, [field]: value } : ref
            ),
        }));
    };
    const handleDownloadPDF = () => {
        const element = previewRef.current;
        const opt = {
            margin: 0,
            filename: 'CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    // Hàm format ngày tháng
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const renderForm = () => {
        switch (activeSection) {
            case 'personal-info':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.personalInfo.name}
                                onChange={handlePersonalInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chức danh chuyên môn
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.personalInfo.title}
                                onChange={handlePersonalInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.personalInfo.email}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SDT
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.personalInfo.phone}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="(123) 456-7890"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.personalInfo.location}
                                onChange={handlePersonalInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="New York, NY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tóm tắt chuyên môn
                            </label>
                            <textarea
                                name="summary"
                                value={formData.personalInfo.summary}
                                onChange={handlePersonalInfoChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief professional summary..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.personalInfo.linkedin}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://linkedin.com/in/johndoe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.personalInfo.github}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://github.com/johndoe"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">

                            <button
                                onClick={() => setActiveSection('experience')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>

                );

            case 'experience':
                return (
                    <div className="space-y-6">
                        {formData.experience.map((exp, index) => (
                            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg relative">
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên công việc
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Senior Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Công ty
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Tech Company"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={exp.startDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={exp.endDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                            disabled={exp.current}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={exp.current}
                                            onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Tôi hiện đang làm việc ở đây</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Miêu tả
                                    </label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe your responsibilities and achievements..."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addExperience}
                            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm kinh nghiệm
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('personal-info')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('education')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-6">
                        {formData.education.map((edu) => (
                            <div key={edu.id} className="bg-gray-50 p-4 rounded-lg relative">
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bằng cấp
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Bachelor of Science in Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên trường
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="University Name"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vị trí
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.location}
                                        onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={edu.startDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={edu.endDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            GPA
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.gpa}
                                            onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="3.8/4.0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Miêu tả
                                    </label>
                                    <textarea
                                        value={edu.description}
                                        onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Relevant coursework, honors, etc."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm Education
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('experience')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('soft-skills')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );

            case 'soft-skills':


                return (
                    <div className="space-y-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thêm Kỹ năng mềm
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newSoftSkill}
                                    onChange={(e) => setNewSoftSkill(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Example: Communication"
                                />
                                <button
                                    onClick={() => {
                                        addSoftSkill(newSoftSkill);
                                        setNewSoftSkill('');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Kỹ năng mềm của bạn</h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.softSkills.map((skill, index) => (
                                    <div key={index}
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        <span>{skill}</span>
                                        <button
                                            onClick={() => removeSoftSkill(index)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                {formData.softSkills.length === 0 && (
                                    <p className="text-gray-500 italic">Chưa có kỹ năng mềm nào</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('education')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('technical-skills')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );

            case 'technical-skills':


                return (
                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thêm Kỹ năng
                            </label>
                            <div className="flex mb-2">
                                <select
                                    value={techCategory}
                                    onChange={(e) => setTechCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="languages">Languages</option>
                                    <option value="tools">Tools</option>
                                </select>
                                <input
                                    type="text"
                                    value={newTechSkill}
                                    onChange={(e) => setNewTechSkill(e.target.value)}
                                    className="flex-1 px-3 py-2 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Example: React"
                                />
                                <button
                                    onClick={() => {
                                        addTechnicalSkill(techCategory, newTechSkill);
                                        setNewTechSkill('');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>

                        {Object.entries(formData.technicalSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h3 className="font-medium text-gray-700 mb-2 capitalize">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <div key={index}
                                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                            <span>{skill}</span>
                                            <button
                                                onClick={() => removeTechnicalSkill(category, index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    {skills.length === 0 && (
                                        <p className="text-gray-500 italic">Chưa có kỹ năng {category} nào được thêm vào</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('soft-skills')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('projects')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <div className="space-y-6">
                        {formData.projects.map((project) => {

                            return (
                                <div key={project.id} className="bg-gray-50 p-4 rounded-lg relative">
                                    <button
                                        onClick={() => removeProject(project.id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên dự án
                                        </label>
                                        <input
                                            type="text"
                                            value={project.name}
                                            onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Project Name"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Liên kết dự án (GitHub, Live Demo, etc.)
                                        </label>
                                        <input
                                            type="url"
                                            value={project.link}
                                            onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://github.com/username/project"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày bắt đầu
                                            </label>
                                            <input
                                                type="date"
                                                value={project.startDate}
                                                min={minYear}
                                                max={maxYear}
                                                onChange={(e) => handleProjectChange(project.id, 'startDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                type="date"
                                                value={project.endDate}
                                                min={minYear}
                                                max={maxYear}
                                                onChange={(e) => handleProjectChange(project.id, 'endDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Miêu tả
                                        </label>
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Describe the project and your role..."
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Công nghệ sử dụng
                                        </label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                value={newTech}
                                                onChange={(e) => setNewTech(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Example: React"
                                            />
                                            <button
                                                onClick={() => {
                                                    addProjectTechnology(project.id, newTech);
                                                    setNewTech('');
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <div key={index}
                                                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                    <span>{tech}</span>
                                                    <button
                                                        onClick={() => removeProjectTechnology(project.id, index)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <button
                            onClick={addProject}
                            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm dự án
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('technical-skills')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('certificates')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );

            case 'certificates':
                return (
                    <div className="space-y-6">
                        {formData.certificates.map((cert) => (
                            <div key={cert.id} className="bg-gray-50 p-4 rounded-lg relative">
                                <button
                                    onClick={() => removeCertificate(cert.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên chứng chỉ
                                        </label>
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) => handleCertificateChange(cert.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="AWS Certified Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tổ chức phát hành
                                        </label>
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) => handleCertificateChange(cert.id, 'issuer', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Amazon Web Services"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày phát hành
                                        </label>
                                        <input
                                            type="date"
                                            value={cert.date}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleCertificateChange(cert.id, 'date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Liên kết chứng chỉ
                                        </label>
                                        <input
                                            type="url"
                                            value={cert.link}
                                            onChange={(e) => handleCertificateChange(cert.id, 'link', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://credential.net/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addCertificate}
                            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm chứng chỉ
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('projects')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setActiveSection('extracurricular')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                );

            case 'extracurricular':
                return (
                    <div className="space-y-6">
                        {formData.extracurricular.map((extra) => (
                            <div key={extra.id} className="bg-gray-50 p-4 rounded-lg relative">
                                <button
                                    onClick={() => removeExtracurricular(extra.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hoạt động
                                        </label>
                                        <input
                                            type="text"
                                            value={extra.activity}
                                            onChange={(e) => handleExtracurricularChange(extra.id, 'activity', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Volunteer Work"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tổ chức
                                        </label>
                                        <input
                                            type="text"
                                            value={extra.organization}
                                            onChange={(e) => handleExtracurricularChange(extra.id, 'organization', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Red Cross"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vai trò
                                    </label>
                                    <input
                                        type="text"
                                        value={extra.role}
                                        onChange={(e) => handleExtracurricularChange(extra.id, 'role', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Team Leader"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={extra.startDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleExtracurricularChange(extra.id, 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={extra.endDate}
                                            min={minYear}
                                            max={maxYear}
                                            onChange={(e) => handleExtracurricularChange(extra.id, 'endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Miêu tả
                                    </label>
                                    <textarea
                                        value={extra.description}
                                        onChange={(e) => handleExtracurricularChange(extra.id, 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe your responsibilities and achievements..."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addExtracurricular}
                            className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm hoạt động ngoại khóa
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveSection('certificates')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Quay lại
                            </button>

                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <StudentHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative flex h-screen">

                    <button
                        onClick={handleSaveCV}
                        className="absolute top-4 right-40 z-10 flex items-center justify-center px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors shadow">
                        <Save className="w-5 h-5 mr-2" />
                        Lưu CV
                    </button>
                    <button
                        onClick={handleSaveCV}
                        className="absolute top-4 right-40 z-10 flex items-center justify-center px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors shadow">
                        <Save className="w-5 h-5 mr-2" />
                        Lưu CV
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="absolute top-4 right-4 z-10 flex items-center justify-center px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors shadow">
                        <FileDown className="w-5 h-5 mr-2" />
                        Export PDF
                    </button>

                    {/* Main Content */}
                    <div className="flex-1 flex">
                        {/* Form Area */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-2xl font-bold mb-6">{sections.find(s => s.id === activeSection)?.title}</h2>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    {renderForm()}
                                </div>
                            </div>

                        </div>


                        {/* Preview Area */}
                        <div ref={previewRef} className="w-[800px] bg-gray-50 border-l p-8 overflow-y-auto">
                            <div className="bg-white shadow-lg p-8 min-h-[700px]">
                                <h1 className="text-3xl font-bold text-blue-900">{formData.personalInfo.name || 'John Doe'}</h1>
                                <p className="text-lg text-blue-600 mb-4">{formData.personalInfo.title || 'Software Engineer'}</p>

                                <div className="flex items-center text-sm text-gray-600 space-x-4 mb-6">
                                    <span>{formData.personalInfo.location || 'New York, NY'}</span>
                                    <span>{formData.personalInfo.phone || '(123) 456-7890'}</span>
                                    <span>{formData.personalInfo.email || 'john.doe@example.com'}</span>
                                </div>

                                <p className="text-gray-700 mb-8">
                                    {formData.personalInfo.summary || 'Experienced software engineer with a passion for building innovative solutions.'}
                                </p>

                                {formData.experience.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Experience
                                        </h2>
                                        {formData.experience.map(exp => (
                                            <div key={exp.id} className="mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{exp.title}</h3>
                                                        <p className="text-gray-600">{exp.company}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                                    </p>
                                                </div>
                                                <p className="text-gray-700 mt-2">{exp.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}
                                {formData.education.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Education
                                        </h2>
                                        {formData.education.map(edu => (
                                            <div key={edu.id} className="mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{edu.degree}</h3>
                                                        <p className="text-gray-600">{edu.institution}, {edu.location}</p>
                                                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                    </p>
                                                </div>
                                                {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Soft Skills Section Preview */}
                                {formData.softSkills.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Kỹ năng mềm
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.softSkills.map((skill, index) => (
                                                <span key={index} className=" text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Technical Skills Section Preview */}
                                {(formData.technicalSkills.frontend.length > 0 ||
                                    formData.technicalSkills.backend.length > 0 ||
                                    formData.technicalSkills.languages.length > 0 ||
                                    formData.technicalSkills.tools.length > 0) && (
                                        <section className="mb-6">
                                            <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                                Technical Skills
                                            </h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                {formData.technicalSkills.frontend.length > 0 && (
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Frontend</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.technicalSkills.frontend.map((skill, index) => (
                                                                <span key={index}
                                                                    className=" text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.technicalSkills.backend.length > 0 && (
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Backend</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.technicalSkills.backend.map((skill, index) => (
                                                                <span key={index}
                                                                    className="text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.technicalSkills.languages.length > 0 && (
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Languages</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.technicalSkills.languages.map((skill, index) => (
                                                                <span key={index}
                                                                    className="text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.technicalSkills.tools.length > 0 && (
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Tools</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.technicalSkills.tools.map((skill, index) => (
                                                                <span key={index}
                                                                    className="text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                {/* Projects Section Preview */}
                                {formData.projects.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Dự án
                                        </h2>
                                        {formData.projects.map(project => (
                                            <div key={project.id} className="mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{project.name}</h3>
                                                        {project.link && (
                                                            <a href={project.link}
                                                                className="text-blue-600 text-sm hover:underline"
                                                                target="_blank" rel="noopener noreferrer">
                                                                Liên kết dự án
                                                            </a>
                                                        )}
                                                    </div>
                                                    {(project.startDate || project.endDate) && (
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(project.startDate)} - {project.endDate && formatDate(project.endDate)}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-2">{project.description}</p>
                                                {project.technologies.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {project.technologies.map((tech, index) => (
                                                            <span key={index}
                                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Certificates Section Preview */}
                                {formData.certificates.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Giấy chứng nhận
                                        </h2>
                                        {formData.certificates.map(cert => (
                                            <div key={cert.id} className="mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{cert.name}</h3>
                                                        <p className="text-gray-600">Issued by {cert.issuer}</p>
                                                        {cert.link && (
                                                            <a href={cert.link}
                                                                className="text-blue-600 text-sm hover:underline"
                                                                target="_blank" rel="noopener noreferrer">
                                                                Xem chứng chỉ
                                                            </a>
                                                        )}
                                                    </div>
                                                    {cert.date && <p className="text-sm text-gray-500">{cert.date}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Extracurricular Section Preview */}
                                {formData.extracurricular.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">
                                            Hoạt động ngoại khóa
                                        </h2>
                                        {formData.extracurricular.map(activity => (
                                            <div key={activity.id} className="mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{activity.activity}</h3>
                                                        <p className="text-gray-600">
                                                            {activity.organization} {activity.role && `- ${activity.role}`}
                                                        </p>
                                                    </div>
                                                    {(activity.startDate || activity.endDate) && (
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(activity.startDate)} - {activity.endDate && formatDate(activity.endDate)}
                                                        </p>
                                                    )}
                                                </div>
                                                {activity.description &&
                                                    <p className="text-gray-700 mt-2">{activity.description}</p>}
                                            </div>
                                        ))}
                                    </section>
                                )}
                                {/* Other sections will be added here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;