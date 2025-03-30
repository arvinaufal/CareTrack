import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyPage from "../pages/VerifyPage";
import MasterMedicinePage from "../pages/Master/MasterMedicinePage";
import MasterProductPage from "../pages/Master/MasterProductPage";
import MasterTreatmentPage from "../pages/Master/MasterTreatmentPage";
import MasterPatientPage from "../pages/Master/MasterPatientPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";
import MedicalRecordActionPage from "../pages/Action/MedicalRecordActionPage";
import PatientPage from "../pages/PatientPage";
import DashboardPage from "../pages/DashboardPage";

const router = createBrowserRouter([
    {
        loader: () => {
            const isLogin = localStorage.getItem('access_token');
            if (!isLogin || isLogin === '') {
                throw redirect("/login");
            }

            return null;
        },
        path: "/",
        children: [
            {
                path: "",
                element: <DashboardPage />,
            },
            {
                path: "patient",
                element: <PatientPage />,
            },
            {
                path: "medical-record",
                children: [
                    {
                        path: "",
                        element: <MedicalRecordPage />,
                    },
                    {
                        path: "add",
                        element: <MedicalRecordActionPage />,
                    },
                ],
            },
            {
                path: "master",
                // element: <StokBarangPage />,
                children: [
                    {
                        path: "medicine",
                        element: <MasterMedicinePage />,
                    },
                    {
                        path: "treatment",
                        element: <MasterTreatmentPage />,
                    },
                    {
                        path: "patient",
                        element: <MasterPatientPage />,
                    },
                ]
            },
        ],
    },
    {
        loader: () => {
            const isLogin = localStorage.getItem('access_token');
            if (isLogin) {
                throw redirect("/");
            }

            return null;
        },
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/verify',
        element: <VerifyPage />
    }
]);

export default router;