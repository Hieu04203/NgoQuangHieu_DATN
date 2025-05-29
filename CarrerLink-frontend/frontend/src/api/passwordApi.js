import axios from "axios";

const API_BASE_URL = "http://localhost:8091/api/auth";

const passwordApi = {
    sendOtp: (email) => {
        return axios.post(`${API_BASE_URL}/forgot-password?email=${email}`);
    },

    resetPassword: (data) => {
        return axios.post(`${API_BASE_URL}/reset-password`, data);
    }
};

export default passwordApi;
