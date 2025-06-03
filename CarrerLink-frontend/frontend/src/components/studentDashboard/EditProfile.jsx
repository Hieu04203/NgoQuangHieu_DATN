import React, { useState, useEffect, useContext } from 'react';
import { Camera, Mail, MapPin } from 'lucide-react';
import DashboardLayout from '../Dashboard/StudentDashboard/StudentDashboardLayout';
import UpdateStudent from '../../api/StudentDetailsUpdateApi';
import { AuthContext } from '../../api/AuthProvider';
import { getStudentByUsername } from '../../api/StudentDetailsApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  if (!student) return <div>Đang tải...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
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
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Camera className="h-5 w-5" />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin liên lạc</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>
              </div>
            </div>

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
              </div>
            </div>

            {/* Job Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Lĩnh vực </h3>
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
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {field.jobField}
                      <button
                        type="button"
                        onClick={() => removeJobField(field.jobField)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditProfile;
