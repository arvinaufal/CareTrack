import { useState, useEffect, useRef } from "react"; // Import useState dan useEffect
import { MdAdd } from "react-icons/md";
import Sidebar from "../../components/fragments/Sidebar";
import { FaCartShopping, FaLaptopMedical, FaMagnifyingGlass } from "react-icons/fa6";
import DataTable from "react-data-table-component";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import FormMedicalTreatment from "../../components/auth/formMedicalTreatment";
// import FormMasterPatient from "../components/auth/formMasterPatient";

export default function MedicalRecordActionPage() {

    const [dataSelectListPatients, setDataSelectListPatients] = useState([]);
    const [dataSelectListMedicines, setDataSelectListMedicines] = useState([]);
    const [dataSelectListTreatments, setDataSelectListTreatments] = useState([]);
    const [datatableOptions, setDatatableOptions] = useState({ searchKeyword: '', perPage: 10, page: 1, totalRows: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const searchTimerRef = useRef(null);

    const getSelectListMedicines = async () => {

        const endpoint = `http://127.0.0.1:3000/api/medicines?perPage=all`;

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ` + localStorage.getItem('access_token')
                }
            });

            let formattedSelectLists = response.data.data.map((data) => {
                return {
                    value: data.id,
                    label: data.name,
                    price: data.price
                }
            });

            setDataSelectListMedicines(formattedSelectLists);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getSelectListPatients = async () => {

        const endpoint = `http://127.0.0.1:3000/api/patients?perPage=all`;

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ` + localStorage.getItem('access_token')
                }
            });

            console.log(response.data.data, 'patients')

            let formattedSelectLists = response.data.data.map((data) => {
                return {
                    value: data.id,
                    label: data.name,
                }
            });

            setDataSelectListPatients(formattedSelectLists);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getSelectListTreatments = async () => {

        const endpoint = `http://127.0.0.1:3000/api/treatments?perPage=all`;

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ` + localStorage.getItem('access_token')
                }
            });
            
            let formattedSelectLists = response.data.data.map((data) => {
                return {
                    value: data.id,
                    label: data.name,
                    cost: data.cost,
                }
            });

            setDataSelectListTreatments(formattedSelectLists);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const addMedicalRecord = async (payload) => {
        const { 
            patientId, 
            date, 
            totalPrice,
            treatments,
            medicines,
            note,
            isNewPatient,
            newPatient 
        } = payload;

        console.log(payload, 'payload');

        try {
            const response = await axios.post(
                `http://127.0.0.1:3000/api/medical-records`,
                {
                    patientId, 
                    date, 
                    totalPrice,
                    treatments,
                    medicines,
                    note,
                    isNewPatient,
                    newPatient 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ` + localStorage.getItem('access_token')
                    }
                }
            );

            if (response.status === 201) {
                // getPatient();
                return response.data;

            }

        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            return error.response?.data;
        }
    };

    useEffect(() => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        searchTimerRef.current = setTimeout(() => {
            // getPatient();
        }, 500);

        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, [datatableOptions.searchKeyword, datatableOptions.perPage, datatableOptions.page]);

    useEffect(() => {
        getSelectListPatients();
        getSelectListTreatments();
        getSelectListMedicines();
    }, [])


    return (
        <section className="w-full flex flex-row min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-5/6 bg-slate-100 px-6 py-4 gap-4">
                <div className="flex flex-row w-full rounded-xl shadow-xl bg-white px-4 py-4">
                    <div className="flex w-1/2 items-center content-center gap-4 flex-row">
                        <FaLaptopMedical size={40} className={`text-[#fc84ac]`} />
                        <span className="text-xl font-semibold text-[#fc84ac]">Add Medical Record</span>
                    </div>
                    <div className="flex flex-row w-1/2 px-4 justify-end">
                        <div className="breadcrumbs text-md">
                            <ul>
                                <li>
                                    <a>
                                        <FaLaptopMedical size={20} className={`text-[#fc84ac]`} />
                                        <span className="text-[#fc84ac]">
                                            Medical Record
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <IoMdAddCircle size={20} className={`text-[#fc84ac]`} />
                                        <span className="text-[#fc84ac]">
                                            Add
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full bg-white px-8 py-4 rounded-xl shadow-xl">
                    <div className="flex flex-col w-full rounded-xl overflow-hidden">
                        <FormMedicalTreatment 
                            dataSelectListMedicines={dataSelectListMedicines} 
                            dataSelectListTreatments={dataSelectListTreatments} 
                            dataSelectListPatients={dataSelectListPatients} 
                            addMethod={addMedicalRecord}
                        />
                    </div>
                </div>
            </div>

        </section>
    );
}