import axiosInstance from './AxiosInstance';

const getAllJobs = async () => {
    try {
        const response = await axiosInstance.get('jobs');
        console.log('Jobs API Response:', response);

        if (response.data?.success && response.data?.data) {
            console.log('Jobs data:', response.data.data);
            return { success: true, data: response.data.data };
        }
        console.error('Invalid response structure:', response.data);
        return { success: false, error: 'Invalid response structure' };
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return { success: false, error: error.message };
    }
};

export { getAllJobs };