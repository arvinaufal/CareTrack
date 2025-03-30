import { Report } from "notiflix";
import { ChangeEvent, useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export default function FormMasterPatient({ formType, addMethod, updateMethod, selectedData }) {
    const [form, setForm] = useState({
        id: '',
        name: '',
        codeId: '',
        email: '',
        birthDate: ''
    });
    const [formTyping, setFormTyping] = useState({ nameTyping: false, codeIdTyping: false, emailTyping: false });
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        codeId: '',
        email: '',
        birthDate: ''
    });

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Patient name is required!";
        } else if (form.name.trim().length > 200) {
            newErrors.name = "Max 200 characters!";
        }

        if (!form.birthDate.trim()) {
            newErrors.birthDate = "Patient Birth Date is required!";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required!";
        } else if (!validateEmail(form.email)) {
            newErrors.email = "Invalid email address!";
        } else if(form.email.trim().length > 200){
            newErrors.email = "Max 200 characters!";
        }

        if (!form.codeId.trim()) {
            newErrors.codeId = "Patient code is required!";
        } else if (form.codeId.trim().length > 8) {
            newErrors.codeId = "Max 8 characters!";
        }

        return newErrors;
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setErrors({});
        }

        setPending(true);
        try {
            const result = await addMethod(form);
            if (result.status === "success") {

                Report.success(
                    "Success",
                    result.message,
                    "Ok",
                    () => {
                        // Tutup modal setelah berhasil
                    }
                );
            } else {
                Report.failure("Failed", result.message || "Something went wrong", "Ok");
            }
        } catch (error) {
            Report.failure("Failed", error.message, "Ok");
        } finally {
            setForm({
                id: '',
                name: '',
                codeId: '',
                email: '',
                birthDate: ''
            });
            setPending(false);
        }
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setErrors({});
        }


        setPending(true);
        try {
            const result = await updateMethod(form);

            if (result.status === "success") {

                Report.success(
                    "Success",
                    result.message,
                    "Ok",
                    () => {
                    }
                );
            } else {
                Report.failure("Failed", result.message || "Something went wrong", "Ok");
            }
        } catch (error) {
            Report.failure("Failed", error.message, "Ok");
        } finally {
            setForm({
                id: '',
                name: '',
                codeId: '',
                email: '',
                birthDate: ''
            });
            setPending(false);
        }
    };

    useEffect(() => {
        if (formType === 'update') {
            setForm(selectedData)
        }
    }, [selectedData])

    return (
        <form onSubmit={formType === 'add' ? handleAddPatient : handleUpdatePatient} >
            <div className="pb-1">
                <label htmlFor="name" className="text-black/90 text-sm">
                    Name<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-1">
                <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => {
                        setForm({ ...form, name: e.target.value });

                        if (e.target.value !== "" || !e.target.value) {
                            setFormTyping({ ...formTyping, nameTyping: true });
                        }
                    }}
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.name ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.name && (
                    <span className="text-[0.70rem] text-red-500">{errors.name}</span>
                )}

                {
                    formTyping.nameTyping && form.name !== ''
                    &&
                    (
                        <div className="absolute right-3" onClick={() => setForm({ ...form, name: "" })} style={{ top: '0.35rem' }}>
                            <img
                                src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.4244 4.57557C23.5257 8.67683 23.5247 15.3242 19.4244 19.4244C15.3242 23.5247 8.67683 23.5257 4.57557 19.4244C0.474315 15.3232 0.475305 8.67584 4.57557 4.57557C8.67584 0.475305 15.3232 0.474315 19.4244 4.57557ZM10.5151 12L8.28778 14.2273C7.87774 14.6374 7.87774 15.3022 8.28778 15.7122C8.69782 16.1223 9.36263 16.1223 9.77267 15.7122L12 13.4849L14.2273 15.7122C14.6374 16.1223 15.3022 16.1223 15.7122 15.7122C16.1223 15.3022 16.1223 14.6374 15.7122 14.2273L13.4849 12L15.7122 9.77267C16.1223 9.36263 16.1223 8.69782 15.7122 8.28778C15.3022 7.87774 14.6374 7.87774 14.2273 8.28778L12 10.5151L9.77267 8.28778C9.36263 7.87774 8.69782 7.87774 8.28778 8.28778C7.87774 8.69782 7.87774 9.36263 8.28778 9.77267L10.5151 12Z' fill='%238E919B'/%3E%3C/svg%3E"
                                alt="My SVG Image"
                                width={20}
                                height={20}
                            />
                        </div>
                    )
                }
            </div>


            <div className="pb-1">
                <label htmlFor="codeId" className="text-black/90 text-sm">
                    Patient Code<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-1">
                <input
                    type="text"
                    id="codeId"
                    value={form.codeId}
                    onChange={(e) => {
                        setForm({ ...form, codeId: e.target.value });

                        if (e.target.value !== "" || !e.target.value) {
                            setFormTyping({ ...formTyping, codeIdTyping: true });
                        }
                    }}
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.codeId ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.codeId && (
                    <span className="text-[0.70rem] text-red-500">{errors.codeId}</span>
                )}

                {
                    formTyping.codeIdTyping && form.codeId !== ''
                    &&
                    (
                        <div className="absolute right-3" onClick={() => setForm({ ...form, codeId: "" })} style={{ top: '0.35rem' }}>
                            <img
                                src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.4244 4.57557C23.5257 8.67683 23.5247 15.3242 19.4244 19.4244C15.3242 23.5247 8.67683 23.5257 4.57557 19.4244C0.474315 15.3232 0.475305 8.67584 4.57557 4.57557C8.67584 0.475305 15.3232 0.474315 19.4244 4.57557ZM10.5151 12L8.28778 14.2273C7.87774 14.6374 7.87774 15.3022 8.28778 15.7122C8.69782 16.1223 9.36263 16.1223 9.77267 15.7122L12 13.4849L14.2273 15.7122C14.6374 16.1223 15.3022 16.1223 15.7122 15.7122C16.1223 15.3022 16.1223 14.6374 15.7122 14.2273L13.4849 12L15.7122 9.77267C16.1223 9.36263 16.1223 8.69782 15.7122 8.28778C15.3022 7.87774 14.6374 7.87774 14.2273 8.28778L12 10.5151L9.77267 8.28778C9.36263 7.87774 8.69782 7.87774 8.28778 8.28778C7.87774 8.69782 7.87774 9.36263 8.28778 9.77267L10.5151 12Z' fill='%238E919B'/%3E%3C/svg%3E"
                                alt="My SVG Image"
                                width={20}
                                height={20}
                            />
                        </div>
                    )
                }
            </div>



            <div className="pb-1">
                <label htmlFor="email" className="text-black/90 text-sm">
                    Patient Email<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-1">
                <input
                    type="text"
                    id="email"
                    value={form.email}
                    onChange={(e) => {
                        setForm({ ...form, email: e.target.value });

                        if (e.target.value !== "" || !e.target.value) {
                            setFormTyping({ ...formTyping, emailTyping: true });
                        }
                    }}
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                        errors.email ? "border-red-500" : "border-slate-800/10"
                    }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.email && (
                    <span className="text-[0.70rem] text-red-500">{errors.email}</span>
                )}

                {
                    formTyping.emailTyping && form.email !== ''
                    &&
                    (
                        <div className="absolute right-3 cursor-pointer" onClick={() => setForm({ ...form, email: "" })} style={{ top: '0.4rem' }}>
                            <img
                                src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.4244 4.57557C23.5257 8.67683 23.5247 15.3242 19.4244 19.4244C15.3242 23.5247 8.67683 23.5257 4.57557 19.4244C0.474315 15.3232 0.475305 8.67584 4.57557 4.57557C8.67584 0.475305 15.3232 0.474315 19.4244 4.57557ZM10.5151 12L8.28778 14.2273C7.87774 14.6374 7.87774 15.3022 8.28778 15.7122C8.69782 16.1223 9.36263 16.1223 9.77267 15.7122L12 13.4849L14.2273 15.7122C14.6374 16.1223 15.3022 16.1223 15.7122 15.7122C16.1223 15.3022 16.1223 14.6374 15.7122 14.2273L13.4849 12L15.7122 9.77267C16.1223 9.36263 16.1223 8.69782 15.7122 8.28778C15.3022 7.87774 14.6374 7.87774 14.2273 8.28778L12 10.5151L9.77267 8.28778C9.36263 7.87774 8.69782 7.87774 8.28778 8.28778C7.87774 8.69782 7.87774 9.36263 8.28778 9.77267L10.5151 12Z' fill='%238E919B'/%3E%3C/svg%3E"
                                alt="My SVG Image"
                                width={20}
                                height={20}
                            />
                        </div>
                    )
                }
            </div>




            <div className="pb-1">
                <label htmlFor="birthDate" className="text-black/90 text-sm">
                    Patient Birthdate<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="date"
                    max={new Date(new Date().setDate(new Date().getDate() + 1))
                        .toISOString()
                        .split("T")[0]}
                    id="birthDate"
                    value={form.birthDate}
                    onChange={(e) => {
                        setForm({ ...form, birthDate: e.target.value });
                    }}
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${errors.birthDate ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.birthDate && (
                    <span className="text-[0.70rem] text-red-500">{errors.birthDate}</span>
                )}
            </div>



            <div className="flex w-full mt-4 justify-end gap-4">
                <div className="flex justify-center items-center content-center px-8 py-1 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 transition-colors duration-500"
                    onClick={() => {
                        setForm({
                            id: '',
                            name: '',
                            codeId: '',
                            email: '',
                            birthDate: ''
                        });
                        document.getElementById('modal-update').close();
                        document.getElementById('modal-add').close();
                        document.getElementById('modal-delete').close();
                    }}
                >
                    <span className="text-sm text-white">Back</span>
                </div>
                {pending ? (
                    <button disabled={true} className="h-8 rounded-full flex justify-center items-center cursor-pointer w-1/4 bg-[#fc84ac] text-black/40 transition-colors duration-500">
                        <span className="loading loading-spinner loading-md text-white"></span>
                    </button>


                ) : (


                    <button
                        type="submit"
                        className="h-8 bg-[#fc84ac] rounded-full flex justify-center items-center cursor-pointer  w-1/4 hover:bg-[rgb(255,186,207)] transition-colors duration-500"
                    >
                        <span className="text-sm text-white">{formType === 'add' ? "Tambah" : "Edit"}</span>
                    </button>
                )}
            </div>



        </form>
    )
}