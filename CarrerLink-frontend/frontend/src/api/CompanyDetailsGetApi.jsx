import axiosInstance from './AxiosInstance';

const getAllCompaniesusingFilters = async (location, category) => {
  try {
    const response = await axiosInstance.get('companies/filter', {
      params: { location, category } // Pass query parameters properly
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching companies data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

const getCompanyByName = async (name) => {
  try {
    const response = await axiosInstance.get('companies/search', {
      params: { name } // Pass query parameters properly
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching companies data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

const getAllCompanies = async () => {
  try {
    const response = await axiosInstance.get('companies');

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching companies data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

const ApproveJob = async (studentId, jobId, requestBody) => {
  console.log("Sending requestBody:", requestBody);
  try {
    const response = await axiosInstance.put('companies/approve-job', requestBody, {
      params: { studentId, jobId } // Pass query parameters here
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching companies data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

const getApprovedApplicants = async (companyId) => {
  try {
    const response = await axiosInstance.get(`companies/all-the-approved-applicants/${companyId}`);

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching companies data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

const rejectJob = async (studentId, jobId) => {
  try {
    const response = await axiosInstance.put('companies/reject-job', null, {
      params: { studentId, jobId }
    });

    if (!response.data?.success) {
      throw new Error('Invalid API response structure');
    }

    return response.data;
  } catch (error) {
    console.error('Error rejecting job application:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export { getAllCompanies, getCompanyByName, getAllCompaniesusingFilters, ApproveJob, getApprovedApplicants, rejectJob };
