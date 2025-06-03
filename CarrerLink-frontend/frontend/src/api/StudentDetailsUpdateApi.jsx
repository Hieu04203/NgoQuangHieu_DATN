import axios from "axios";

const UpdateStudent = async (studentData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("student", JSON.stringify(studentData));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put("http://localhost:8091/api/students", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }
    return {
      success: false,
      error: "No data received from server"
    };
  } catch (error) {
    console.error("Error updating student:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export default UpdateStudent;
