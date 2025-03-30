import { useState, useEffect } from "react";
import Sidebar from "../components/fragments/Sidebar";
import axios from "axios";
import { TbReportAnalytics } from "react-icons/tb";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { MdDashboard } from "react-icons/md";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardPage() {
    const [dataStatisticMedicines, setDataStatisticMedicines] = useState([]);
    const [dataStatisticTreatments, setDataStatisticTreatments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getReport = async () => {
        setIsLoading(true);
        const endpoint = `http://127.0.0.1:3000/api/statistics`;

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ` + localStorage.getItem('access_token')
                }
            });

            setDataStatisticMedicines(response.data.data.medicines);
            setDataStatisticTreatments(response.data.data.treatments);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getReport();
    }, []);

    // Prepare chart data
    const chartDataMedicines = {
        labels: dataStatisticMedicines.map(item => item.name),
        datasets: [
            {
                label: 'Profit (Rp)',
                data: dataStatisticMedicines.map(item => item.totalProfit),
                backgroundColor: '#fc84ac',
                borderColor: '#fc84ac',
                borderWidth: 1,
            }
        ]
    };

    const chartMedicineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Medicine Profit Comparison',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Rp ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return `Rp ${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    const chartDataTreatments = {
        labels: dataStatisticTreatments.map(item => item.name),
        datasets: [
            {
                label: 'Profit (Rp)',
                data: dataStatisticTreatments.map(item => item.totalProfit),
                backgroundColor: '#fc84ac',
                borderColor: '#fc84ac',
                borderWidth: 1,
            }
        ]
    };

    const chartTreatmentOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Treatment Profit Comparison',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Rp ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return `Rp ${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    const LoadingSpinner = () => (
        <div className="flex flex-col justify-center items-center content-center h-full gap-20">
            <span className="loading loading-spinner text-primary w-36"></span>
            <div className="flex justify-center items-center content-center">
                <span>Mohon tunggu...</span>
            </div>
        </div>
    );

    return (
        <section className="w-full flex flex-row min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-5/6 bg-slate-100 px-6 py-4 gap-4">
                <div className="flex flex-row w-full rounded-xl shadow-xl bg-white px-4 py-4">
                    <div className="flex w-1/2 items-center content-center gap-4 flex-row">
                        <MdDashboard size={40} className={`text-[#fc84ac]`} />
                        <span className="text-xl font-semibold text-[#fc84ac]">Dashboard</span>
                    </div>
                    <div className="flex flex-row w-1/2 px-4 justify-end">
                        <div className="breadcrumbs text-md">
                            <ul>
                                <li>
                                    <a>
                                        <MdDashboard size={20} className={`text-[#fc84ac]`} />
                                        <span className="text-[#fc84ac]">
                                            Dashboard
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full h-full bg-white px-8 py-4 rounded-xl shadow-xl justify-center items-center content-center">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="flex flex-col w-full rounded-xl overflow-hidden gap-8">
                            <div className="h-96 w-full">
                                <Bar data={chartDataMedicines} options={chartMedicineOptions} />
                            </div>
                            <div className="h-96 w-full">
                                <Bar data={chartDataTreatments} options={chartTreatmentOptions} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}