import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { getAllCourses } from '../../../api/AdminDetailsApi';
import axiosInstance from '../../../api/AxiosInstance';
import Swal from 'sweetalert2';
import { CourseForm } from './CourseForm'; // Assuming you're still keeping this as a separate component

function Course() {
    const [courses, setCourses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Courses
    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCourses();

            // Log the API response to inspect structure
            console.log("Phản hồi API của quảng cáo:", response);

            if (response.success) {
                console.log("Course data:", response.data);
                setCourses(response.data);
            } else {
                throw new Error('Không thể tải quảng cáo');
            }
        } catch (err) {
            console.error('Lỗi khi tải quảng cáo', err);
            setError('Lỗi khi tải quảng cáo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Submit Handler
    const handleSubmit = async (courseData) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Gửi dữ liệu khóa học:", courseData);

            // Determine correct course ID to use for update
            const courseId = editingCourse?.courseId || editingCourse?.id;

            const url = editingCourse
                ? `/admin/updateCourse/${courseId}`
                : `/admin/saveCourse`;

            console.log("API request:", {
                method: editingCourse ? 'PUT' : 'POST',
                url,
                data: courseData
            });

            const response = await axiosInstance({
                method: editingCourse ? 'PUT' : 'POST',
                url,
                data: courseData,
            });

            console.log("API response:", response);

            // More tolerant response checking
            if (response.data === undefined) {
                throw new Error('API không trả về dữ liệu');
            }

            if (response.data && response.data.success === false) {
                throw new Error(response.data.message || 'API trả về lỗi');
            }

            // Consider request successful if we got a response with data
            // even if success property isn't explicitly true
            await fetchCourses();
            setIsFormOpen(false);
            setEditingCourse(null);

            // Show success message
            Swal.fire({
                title: "Thành công!",
                text: editingCourse ? "Quảng cáo đã được cập nhật thành công" : "Quảng cáo đã được tạo thành công",
                icon: "success",
                timer: 2000
            });
        } catch (err) {
            console.error('Lỗi khi lưu quảng cáo:', err);

            // Get the error message from the API response if available
            const errorMessage = err.response?.data?.message || err.message ||
                (editingCourse ? 'Lỗi khi cập nhật quảng cáo' : 'Lỗi khi tạo quảng cáo');

            setError(errorMessage);

            // Show error in alert
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Edit Handler
    const handleEdit = (course) => {
        console.log("Editing course:", course); // Log course object to inspect
        setEditingCourse(course);
        setIsFormOpen(true);
    };

    // Delete Handler
    const handleDelete = async (course) => {
        // Accept the entire course object instead of just the ID
        console.log('Course to delete:', course); // Log the entire course object

        // Check for ID in multiple possible properties
        const courseId = course?.courseId || course?.id;

        console.log('Deleting course with ID:', courseId);

        if (!courseId) {
            console.error('Không thể xóa: Id không xác định');
            setError('Không thể xóa: Thiếu ID quảng cáo');
            Swal.fire({
                title: "Error",
                text: "Không thể xóa: Thiếu ID quảng cáo",
                icon: "error"
            });
            return;
        }

        const confirmDelete = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn tác điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmDelete.isConfirmed) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.delete(`/admin/deleteCourse/${courseId}`);
                console.log("Xóa phản hồi:", response);

                // More tolerant response checking
                if (response.data && response.data.success === false) {
                    throw new Error(response.data?.message || 'Không xóa được quảng cáo');
                }

                await fetchCourses();
                Swal.fire("Deleted!", "Quảng cáo của bạn đã bị xóa.", "success");
            } catch (err) {
                console.error('Lỗi khi xóa khóa học:', err);
                const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi xóa quảng cáo';
                setError(errorMsg);
                Swal.fire({
                    title: "Error",
                    text: errorMsg,
                    icon: "error"
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Generate a unique key for each course row
    const getUniqueKey = (course, index) => {
        // Try to use existing IDs first
        const id = course.courseId || course.id;
        if (id) return `course-${id}`;

        // Fallback to using index + courseName as a key
        return `course-${index}-${course.courseName}`;
    };

    // List Renderer
    const CourseList = ({ courses, onEdit, onDelete, isLoading }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỹ năng cần thiết</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức độ kỹ năng</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Url</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course, index) => (
                    <tr key={getUniqueKey(course, index)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.requiredSkill}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.skillLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{course.url}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => onEdit(course)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => onDelete(course)} // Pass the entire course object
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý quảng cáo</h1>
                        <button
                            onClick={() => {
                                setEditingCourse(null);
                                setIsFormOpen(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Thêm quảng cáo
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                            <span>{error}</span>
                        </div>
                    )}

                    {isFormOpen ? (
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingCourse ? 'Edit Course' : 'Add New Course'}
                            </h2>
                            <CourseForm
                                initialValues={editingCourse}
                                onSubmit={handleSubmit}
                                onCancel={() => {
                                    setIsFormOpen(false);
                                    setEditingCourse(null);
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">Đang tải quảng cáo...</div>
                            ) : courses.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">Không tìm thấy quảng cáo nào. Nhấp vào "Thêm quảng cáo" để tạo một quảng cáo.</div>
                            ) : (
                                <CourseList
                                    courses={courses}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Course;