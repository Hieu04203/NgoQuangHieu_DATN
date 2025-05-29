import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import passwordApi from "../api/passwordApi";

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      await passwordApi.resetPassword({
        email: state.email,
        otp,
        newPassword
      });
      navigate("/student-auth", { state: { message: "Đặt lại mật khẩu thành công!" } });
    } catch (err) {
      setError("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="h-[calc(100vh-265px)] grid place-content-center ">
      <div className="max-w-md p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Xác minh OTP & Đặt lại mật khẩu</h2>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Đặt lại mật khẩu
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
