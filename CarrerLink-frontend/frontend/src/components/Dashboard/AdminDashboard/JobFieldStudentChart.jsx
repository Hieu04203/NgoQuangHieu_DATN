// JobFieldLineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const JobFieldStudentChart = ({ data }) => {
    const theme = useTheme();

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Ứng viên theo lĩnh vực nghề nghiệp</h3>
            <div className="overflow-x-auto">
                <div className="min-w-[600px] h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="jobFieldName"
                                angle={-45}
                                textAnchor="end"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="studentCount"
                                stroke={theme.palette.secondary.main}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default JobFieldStudentChart ;