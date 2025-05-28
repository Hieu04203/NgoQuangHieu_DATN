import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 mt-8">
            <div className="max-w-screen-xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <a href="/" className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                        CareerLink
                    </a>
                    <ul className="flex flex-wrap space-x-6 text-gray-600 dark:text-gray-400 text-sm font-medium">
                        <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Trang chủ</a></li>
                        <li><a href="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Tìm việc</a></li>
                        <li><a href="/employer" className="hover:text-indigo-600 dark:hover:text-indigo-400">Nhà tuyển dụng</a></li>
                        <li><a href="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400">Khóa học</a></li>
                        <li><a href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a></li>
                        <li><a href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Liên hệ</a></li>
                        <li><a href="/support" className="hover:text-indigo-600 dark:hover:text-indigo-400">Hỗ trợ</a></li>
                        <li><a href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Chính sách bảo mật</a></li>
                    </ul>
                </div>

                <hr className="my-8 border-gray-300 dark:border-gray-700" />

                <div className="flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 dark:text-gray-400 text-sm space-y-4 sm:space-y-0">
                    <p>© 2025 CareerLink. All rights reserved.</p>
                    <div className="flex space-x-5">
                        <a href="https://facebook.com" aria-label="Facebook" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            <FaFacebookF size={18} />
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            <FaTwitter size={18} />
                        </a>
                        <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            <FaLinkedinIn size={18} />
                        </a>
                        <a href="https://instagram.com" aria-label="Instagram" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            <FaInstagram size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
