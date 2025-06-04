import axios from 'axios'

const StudentRegisterApi = async (formData) => {
  try {
    // Create a new FormData object
    const data = new FormData();

    // Create the student data object
    const studentData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      university: formData.university,
      department: formData.department,
      degree: formData.degree,
      acedemicResults: formData.academicStatus,
      jobFields: formData.jobsFields,
      technologies: formData.technologies,
      userSaveRequestDTO: {
        username: formData.userName,
        password: formData.password
      }
    };

    // Append the student data as a JSON string
    data.append('student', JSON.stringify(studentData));

    // If there's a photo, append it
    if (formData.photo) {
      data.append('image', formData.photo);
    }

    const response = await axios.post(
      'http://localhost:8091/api/auth/register/student',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Form Data:', formData);
    console.log('Response:', response);
    return response.data.message;
  }
  catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      return error.response.data.message;
    }
    return 'Registration failed. Please try again.';
  }
}

export default StudentRegisterApi