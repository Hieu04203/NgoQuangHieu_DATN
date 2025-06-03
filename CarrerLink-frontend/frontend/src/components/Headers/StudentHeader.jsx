import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { AuthContext } from '../../api/AuthProvider';

function StudentHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/student', label: 'Home' },
        { path: '/student-dashboard/jobs', label: 'Công việc' },
        { path: '/testplatform', label: 'TEST' },
        { path: '/student-dashboard/cv', label: 'CV' },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/student" className="flex-shrink-0">
                            <span className="text-2xl font-bold text-blue-600">CareerLink</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(link.path)
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Profile Button */}
                        <Link
                            to="/editprofile"
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/editprofile')
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <User className="w-5 h-5 mr-2" />
                            Hồ sơ cá nhân
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Đăng xuất
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <Link
                            to="/editprofile"
                            className="mr-2 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            <User className="w-6 h-6" />
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="pt-2 pb-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive(link.path)
                                ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Mobile Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
                    >
                        <div className="flex items-center">
                            <LogOut className="w-5 h-5 mr-2" />
                            Đăng xuất
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default StudentHeader; 