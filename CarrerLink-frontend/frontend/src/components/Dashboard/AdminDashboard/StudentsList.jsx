import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from "../../../api/StudentDetailsApi";

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getAllStudents();
                if (response.success) {
                    setStudents(response.data);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách ứng viên</h2>
            <div className="space-y-4">
                {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-4">
                                <h3 className="font-semibold text-gray-800 text-lg">{student.firstName + student.lastName}</h3>
                            </div>
                            <p className="text-gray-600">{student.email}</p>
                            <p className="text-gray-600 text-sm">Ngành: {student.department}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {student.jobFields?.map((field, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {field.jobField}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/student-dashboard/viewcv/${student.studentId}`)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Xem CV
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentsList;