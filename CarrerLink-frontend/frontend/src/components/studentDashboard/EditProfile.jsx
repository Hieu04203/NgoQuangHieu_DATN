import React, { useState, useEffect, useContext } from 'react';
import { Camera, Mail, MapPin } from 'lucide-react';
import { AuthContext } from '../../api/AuthProvider';
import { getStudentByUsername } from '../../api/StudentDetailsApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import StudentHeader from '../Headers/StudentHeader';
import UpdateStudent from '../../api/StudentDetailsUpdateApi';

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

function EditProfile() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [profilePicture, setProfilePicture] = useState('/placeholder.svg');
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    userName: '',
    jobsFields: [],
    technologies: [],
    profilePicture: ''
  });

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const username = extractUsernameFromToken(token);
        const response = await getStudentByUsername(username);
        if (response?.success) {
          setStudent(response.data);
          setFormData({
            studentId: response.data.studentId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            address: response.data.address,
            userName: response.data.userName,
            jobsFields: response.data.jobsFields || [],
            technologies: response.data.technologies || [],
            profilePicture: response.data.profileImageUrl || '/placeholder.svg',  // Ensure you set a default if not available
          });
          console.log(response.data.profileImageUrl);
          // If the profilePicUrl exists, load the image into the state.
          if (response.data.profileImageUrl) {
            setProfilePicture(response.data.profileImageUrl);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ứng viên', error);
      }
    };

    if (token) fetchStudentData();
  }, [token]);

  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error('Lỗi giải mã mã thông báo', error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTechnology = (tech) => {
    if (!formData.technologies.some(t => t.techName === tech)) {
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
    if (!formData.jobsFields.some(f => f.jobField === field)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      studentId: formData.studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      jobsFields: formData.jobsFields,
      technologies: formData.technologies,
    };

    try {
      const response = await UpdateStudent(studentData, imageFile);

      if (response.success) {
        Swal.fire({
          title: "Đã cập nhật thành công!",
          icon: "success",
        });
        navigate('/student');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Lỗi trong quá trình cập nhật', error);

      Swal.fire({
        title: "Cập nhật không thành công",
        text: error.message || 'Vui lòng thử lại sau.',
        icon: "error",
      });
    }
  };

  if (!student) return (
    <>
      <StudentHeader />
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    </>
  );

  return (
    <>
      <StudentHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Chỉnh sửa hồ sơ</h2>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover ring-4 ring-white shadow-lg border-4 border-indigo-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profileInput"
              />
              <label
                htmlFor="profileInput"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Công nghệ</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech.techName}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech.techName)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) addTechnology(e.target.value);
                  e.target.value = '';
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Chọn công nghệ...</option>
                {allTechnologies.filter(tech =>
                  !formData.technologies.some(t => t.techName === tech)
                ).map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            {/* Job Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lĩnh vực công việc</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.jobsFields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {field.jobField}
                    <button
                      type="button"
                      onClick={() => removeJobField(field.jobField)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 text-green-400 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) addJobField(e.target.value);
                  e.target.value = '';
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Chọn lĩnh vực...</option>
                {allJobFields.filter(field =>
                  !formData.jobsFields.some(f => f.jobField === field)
                ).map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
