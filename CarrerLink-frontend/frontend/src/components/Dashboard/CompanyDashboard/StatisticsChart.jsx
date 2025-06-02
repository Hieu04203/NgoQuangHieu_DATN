import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StatisticsChart = ({ statistics }) => {
    // Dữ liệu mẫu
    const fakeData = {
        jobPostings: 15,
        applications: 156,
        interviews: 23,
        hired: 8
    };

    const statsData = statistics || fakeData;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Thống kê tuyển dụng',
                font: {
                    size: 20,
                    weight: 'bold'
                },
                padding: 20
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    const data = {
        labels: ['Tin tuyển dụng', 'Ứng tuyển', 'Phỏng vấn', 'Đã tuyển'],
        datasets: [
            {
                data: [
                    statsData.jobPostings,
                    statsData.applications,
                    statsData.interviews,
                    statsData.hired
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',  // Xanh dương
                    'rgba(75, 192, 192, 0.8)',   // Xanh lá
                    'rgba(255, 159, 64, 0.8)',   // Cam
                    'rgba(153, 102, 255, 0.8)',  // Tím
                ],
                borderRadius: 6,
                maxBarThickness: 60
            }
        ]
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <Bar options={options} data={data} height={100} />

            {/* Thống kê chi tiết */}
            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                        {statsData.jobPostings}
                    </div>
                    <div className="text-gray-600 text-sm">Tin tuyển dụng</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-teal-500">
                        {statsData.applications}
                    </div>
                    <div className="text-gray-600 text-sm">Ứng tuyển</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                        {statsData.interviews}
                    </div>
                    <div className="text-gray-600 text-sm">Phỏng vấn</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                        {statsData.hired}
                    </div>
                    <div className="text-gray-600 text-sm">Đã tuyển</div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsChart; 