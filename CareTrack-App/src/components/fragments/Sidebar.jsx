import { FaBoxArchive, FaBoxesStacked, FaCartShopping, FaDatabase, FaHandHoldingMedical, FaHospitalUser, FaHouseMedical, FaLaptopMedical, FaUserGroup } from "react-icons/fa6";
import { MdCategory, MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useSidebarStore from "../../stores/SidebarStore";
import { TbReportAnalytics } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { GiMedicinePills } from "react-icons/gi";

export default function Sidebar() {
    const { currentMenu, updateCurrentMenu } = useSidebarStore();
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    }


    return (
        <div className="flex flex-col w-1/6 bg-white border-r border-r-slate-100 shadow-xl px-4">
            {/* Logo dan Judul */}
            <div className="flex flex-col w-full justify-center items-center content-center py-4">
                <div className="w-35">
                    <img src="https://www.carenow.id/_next/image?url=%2Fcarenow-logo-raspberry-black.png&w=3840&q=75" alt="" />
                </div>
                <div className="flex w-full justify-center items-center content-center pb-2">
                    <span className="italic font-bold text-[#fc84ac]">CareTrack</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="w-full flex flex-col gap-4">
                {/* Dashboard */}
                <div className="w-full flex">
                    <Link
                        to={"/"}
                        className={`w-full flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'dashboard' ? 'bg-[#fc84ac]' : ''}`}
                        onClick={() => updateCurrentMenu('dashboard')} // Update state saat diklik
                    >
                        <div className="flex w-1/5 justify-center">
                            <MdDashboard size={24} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'dashboard' ? 'text-white' : ''}`} />
                        </div>
                        <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'dashboard' ? 'text-white' : ''}`}>
                            Dashboard
                        </div>
                    </Link>
                </div>

                {/* Medical Record */}
                <div className="w-full flex">
                    <Link
                        to={"/medical-record"}
                        className={`w-full flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'medical-record' ? 'bg-[#fc84ac]' : ''}`}
                        onClick={() => updateCurrentMenu('medical-record')} // Update state saat diklik
                    >
                        <div className="flex w-1/5 justify-center">
                            <FaLaptopMedical size={20} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'medical-record' ? 'text-white' : ''}`} />
                        </div>
                        <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'medical-record' ? 'text-white' : ''}`}>
                            Medical Record
                        </div>
                    </Link>
                </div>

                <div className="w-full flex">
                    <Link
                        to={"/patient"}
                        className={`w-full flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'patient' ? 'bg-[#fc84ac]' : ''}`}
                        onClick={() => updateCurrentMenu('patient')} // Update state saat diklik
                    >
                        <div className="flex w-1/5 justify-center">
                            <FaHouseMedical size={20} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'patient' ? 'text-white' : ''}`} />
                        </div>
                        <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'patient' ? 'text-white' : ''}`}>
                            Patient
                        </div>
                    </Link>
                </div>

                {/* Data Master dengan Submenu */}
                <div className="w-full flex flex-col">
                    <div className="collapse collapse-arrow text-[#fc84ac]">
                        <input
                            type="checkbox"
                            className="peer"
                            checked={
                                currentMenu === "master/goods" ||
                                    currentMenu === "master/users" ||
                                    currentMenu === "master/categories" ? true : null
                            }
                            onChange={() => { }}
                        />
                        {/* Header Data Master */}
                        <div className="collapse-title w-full flex flex-row justify-center content-center items-center gap-2 hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer">
                            <div className="flex w-1/5 justify-center">
                                <FaDatabase size={20} className="text-[#fc84ac] group-hover:text-white" />
                            </div>
                            <div className="flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white">
                                Master Data
                            </div>
                        </div>

                        {/* Submenu */}
                        <div className="collapse-content">
                            {/* Master Barang */}
                            <Link
                                to={"/master/medicine"}
                                className={`w-full mt-2 gap-2 flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'master/medicine' ? 'bg-[#fc84ac]' : ''}`}
                                onClick={() => updateCurrentMenu('master/medicine')} // Update state saat diklik
                            >
                                <div className="flex w-1/5 justify-center">
                                    <GiMedicinePills size={20} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/medicine' ? 'text-white' : ''}`} />
                                </div>
                                <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/medicine' ? 'text-white' : ''}`}>
                                    Medicine
                                </div>
                            </Link>
                            <Link
                                to={"/master/treatment"}
                                className={`w-full mt-2 gap-2 flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'master/treatment' ? 'bg-[#fc84ac]' : ''}`}
                                onClick={() => updateCurrentMenu('master/treatment')} // Update state saat diklik
                            >
                                <div className="flex w-1/5 justify-center">
                                    <FaHandHoldingMedical size={20} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/treatment' ? 'text-white' : ''}`} />
                                </div>
                                <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/treatment' ? 'text-white' : ''}`}>
                                    Treatment
                                </div>
                            </Link>
                            <Link
                                to={"/master/patient"}
                                className={`w-full mt-2 gap-2 flex flex-row justify-center hover:bg-[#fc84ac] py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'master/patient' ? 'bg-[#fc84ac]' : ''}`}
                                onClick={() => updateCurrentMenu('master/patient')} // Update state saat diklik
                            >
                                <div className="flex w-1/5 justify-center">
                                    <FaHospitalUser size={20} className={`text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/patient' ? 'text-white' : ''}`} />
                                </div>
                                <div className={`flex w-4/5 items-center text-md text-[#fc84ac] group-hover:text-white ${currentMenu === 'master/patient' ? 'text-white' : ''}`}>
                                    Patient
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>

                <div className="w-full flex">
                    <div
                        onClick={logout}
                        className={`w-full flex flex-row justify-center border-2 border-red-400 text-red-400 hover:bg-red-500 py-2 px-3 rounded-full group transition-colors duration-500 cursor-pointer ${currentMenu === 'logout' ? 'bg-red-500' : ''}`}
                    >
                        <div className="flex w-1/5 justify-center">
                            <FiLogOut size={20} className={`text-red-bg-red-500 group-hover:text-white ${currentMenu === 'logout' ? 'text-white' : ''}`} />
                        </div>
                        <div className={`flex w-4/5 items-center text-md text-red-bg-red-500 group-hover:text-white ${currentMenu === 'logout' ? 'text-white' : ''}`}>
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}