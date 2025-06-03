import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CompanyRegisterApi from "../api/CompanyRegisterApi";

const CompanyRegister = () => {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [companyPic, setCompanyPic] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [formdata, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        website: '',
        location: ''
    });

    const handleChange = (event) => {
        event.preventDefault();
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
        const file = e.target.files?.[0];
        if (file) {
            if (e.target.name === 'companyPic') {
                setCompanyPic(file);
            } else if (e.target.name === 'coverPic') {
                setCoverPic(file);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formdata);
        try {
            const response = await CompanyRegisterApi(formdata, companyPic, coverPic);
            console.log('Response:', response);

            navigate("/company-auth", {
                state: { message: "Successfully registered!" },
            });
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Đăng ký công ty</h2>
                    <p className="mt-2 text-gray-600">Tham gia CareerLink để tìm kiếm nhân tài hàng đầu</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.submit && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
                                {errors.submit}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-semibold">Tên công ty</label>
                                <input
                                    type="text"
                                    placeholder="Enter company name"
                                    className="w-full p-2 border rounded mb-4"
                                    name="name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold">Tên người dùng</label>
                                <input
                                    type="text"
                                    placeholder="Choose username"
                                    className="w-full p-2 border rounded mb-4"
                                    name="username"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full p-2 border rounded mb-4"
                                name="email"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="Choose password"
                                className="w-full p-2 border rounded mb-4"
                                name="password"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Website</label>
                            <input
                                type="text"
                                placeholder="Enter website URL"
                                className="w-full p-2 border rounded mb-4"
                                name="website"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Vị trí</label>
                            <input
                                type="text"
                                placeholder="Enter location"
                                className="w-full p-2 border rounded mb-4"
                                name="location"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Ảnh đại diện</label>
                            <input
                                type="file"
                                name="companyPic"
                                onChange={handleFileChange}
                                className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Ảnh bìa</label>
                            <input
                                type="file"
                                name="coverPic"
                                onChange={handleFileChange}
                                className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded mt-4"
                        >
                            Đăng ký
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Bạn đã có tài khoản?{' '}
                            <Link to="/company-auth" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegister;