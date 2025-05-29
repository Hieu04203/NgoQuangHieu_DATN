import React, { useState } from "react";
import passwordApi from "../api/passwordApi";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            await passwordApi.sendOtp(email);
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            setMessage("Không thể gửi OTP. Vui lòng kiểm tra lại email.");
        }
    };

    return (
        <div className="h-[calc(100vh-265px)] grid place-content-center "><div className="max-w-md p-6 bg-white shadow rounded ">
            <h2 className="text-2xl font-semibold mb-4">Quên mật khẩu</h2>
            <input
                type="email"
                placeholder="Nhập email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
            />
            <button
                onClick={handleSendOtp}
                className="w-full bg-indigo-600 text-white py-2 rounded"
            >
                Gửi mã OTP
            </button>
            {message && <p className="text-red-500 mt-4">{message}</p>}
        </div></div>
    );
};

export default ForgotPasswordPage;
