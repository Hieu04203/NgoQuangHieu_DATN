import axiosInstance from './AxiosInstance';

const CompanyRegisterApi = async (formdata, companyPic, coverPic) => {
  try {
    // Tạo FormData object
    const formDataObj = new FormData();

    // Tạo object chứa dữ liệu công ty
    const companyData = {
      name: formdata.name,
      email: formdata.email,
      website: formdata.website,
      location: formdata.location,
      userSaveRequestDTO: {
        username: formdata.username,
        password: formdata.password,
      }
    };

    // Append company data dưới dạng JSON string
    formDataObj.append('company', JSON.stringify(companyData));

    // Append ảnh nếu có
    if (companyPic) {
      formDataObj.append('companyPic', companyPic);
    }
    if (coverPic) {
      formDataObj.append('coverPic', coverPic);
    }

    // Gửi request với Content-Type là multipart/form-data
    const response = await axiosInstance.post(
      '/auth/register/company',
      formDataObj,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data) {
      return response.data;
    }
    throw new Error('No data received from server');
  } catch (error) {
    console.error('Registration error:', error.response || error);
    throw error;
  }
};

export default CompanyRegisterApi;