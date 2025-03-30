import { Checkbox, DatePicker, Select, InputNumber, Empty } from "antd";
import dayjs from "dayjs";
import { Report } from "notiflix";
import { useEffect, useState } from "react";


const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
export default function FormMedicalTreatment({
    addMethod,
    dataSelectListMedicines,
    dataSelectListTreatments,
    dataSelectListPatients
}) {
    const [form, setForm] = useState({
        patientId: "",
        date: "",
        totalPrice: 0,
        treatments: [],
        medicines: [],
        note: "",
        isNewPatient: false,
        newPatient: {
            name: "",
            codeId: '',
            email: '',
            birthDate: ''
        }
    });

    const [pending, setPending] = useState(false);
    // const [isNewPatient, setIsNewPatient] = useState(false);
    const [isManualCount, setIsManualCount] = useState(false);
    const [errors, setErrors] = useState({
        patientId: "",
        date: "",
        treatments: "",
        medicines: "",
        newPatient: {
            name: "",
            codeId: '',
            email: '',
            birthDate: ''
        }
    });

    // Handle treatment selection change with quantity persistence
    const handleChangeMedicines = (selectedMedicineIds) => {
        const currentMedicines = form.medicines;
        const existingMedicinesMap = new Map(
            currentMedicines.map(medicine => [medicine.id, medicine])
        );

        const selectedMedicines = dataSelectListMedicines
            .filter(medicine => selectedMedicineIds.includes(medicine.value))
            .map(medicine => ({
                id: medicine.value,
                name: medicine.label,
                price: medicine.price,
                quantity: existingMedicinesMap.get(medicine.value)?.quantity || 1
            }));

            if (isManualCount) {
                
                setForm(prev => ({
                    ...prev,
                    medicines: selectedMedicines
                }));
                
            }else {

                setForm(prev => ({
                    ...prev,
                    medicines: selectedMedicines,
                    totalPrice: calculateTotalPrice(prev.treatments, selectedMedicines)
                }));
            }

    };

    const handleMedicineQuantityChange = (medicineId, quantity) => {
        setForm(prev => {
            const updatedMedicines = prev.medicines.map(medicine =>
                medicine.id === medicineId ? { ...medicine, quantity } : medicine
            );

            if (isManualCount) {
                return {
                    ...prev,
                    medicines: updatedMedicines
                };
            }else{
                return {
                    ...prev,
                    medicines: updatedMedicines,
                    totalPrice: calculateTotalPrice(prev.treatments, updatedMedicines)
                };
            }

        });
    };



    const handleChangeTreatments = (selectedTreatmentIds) => {
        const currentTreatments = form.treatments;
        const existingTreatmentsMap = new Map(
            currentTreatments.map(treatment => [treatment.id, treatment])
        );

        const selectedTreatments = dataSelectListTreatments
            .filter(treatment => selectedTreatmentIds.includes(treatment.value))
            .map(treatment => ({
                id: treatment.value,
                name: treatment.label,
                cost: treatment.cost,
                quantity: existingTreatmentsMap.get(treatment.value)?.quantity || 1
            }));

        if (isManualCount) {
            setForm(prev => ({
                ...prev,
                treatments: selectedTreatments
            }));
        }else{
            setForm(prev => ({
                ...prev,
                treatments: selectedTreatments,
                totalPrice: calculateTotalPrice(selectedTreatments, prev.medicines)
            }));
        }

    };

    // Handle quantity change for a specific treatment
    const handleTreatmentQuantityChange = (treatmentId, quantity) => {
        setForm(prev => {
            const updatedTreatments = prev.treatments.map(treatment =>
                treatment.id === treatmentId ? { ...treatment, quantity } : treatment
            );

            if (isManualCount) {
                return {
                    ...prev,
                    treatments: updatedTreatments
                };
            } else {
                return {
                    ...prev,
                    treatments: updatedTreatments,
                    totalPrice: calculateTotalPrice(updatedTreatments, prev.medicines)
                };
            }

        });
    };

    // Calculate total price
    const calculateTotalPrice = (treatments, medicines) => {
        const treatmentsTotal = treatments.reduce((sum, treatment) =>
            sum + (treatment.cost * treatment.quantity), 0);
        const medicinesTotal = medicines.reduce((sum, medicine) =>
            sum + (medicine.price * medicine.quantity), 0);
        return treatmentsTotal + medicinesTotal;
    };

    const validateForm = () => {
        const newErrors = {
            newPatient: {}
        };
    
        // Validate based on patient type
        if (form.isNewPatient) {
            // Validate new patient fields
            if (!form.newPatient.name.trim()) {
                newErrors.newPatient.name = "Patient name is required!";
            } else if (form.newPatient.name.trim().length > 200) {
                newErrors.newPatient.name = "Max 200 characters!";
            }
    
            if (!form.newPatient.birthDate.trim()) {
                newErrors.newPatient.birthDate = "Patient Birth Date is required!";
            }
    
            if (!form.newPatient.email.trim()) {
                newErrors.newPatient.email = "Email is required!";
            } else if (!validateEmail(form.newPatient.email)) {
                newErrors.newPatient.email = "Invalid email address!";
            } else if (form.newPatient.email.trim().length > 200) {
                newErrors.newPatient.email = "Max 200 characters!";
            }
    
            if (!form.newPatient.codeId.trim()) {
                newErrors.newPatient.codeId = "Patient code is required!";
            } else if (form.newPatient.codeId.trim().length > 8) {
                newErrors.newPatient.codeId = "Max 8 characters!";
            }

        } else {
            // Validate existing patient
            if (!form.patientId) {
                newErrors.patientId = "Patient is required!";
            }
        }
    
        // Remove newPatient object if no errors exist
        if (Object.keys(newErrors.newPatient).length === 0) {
            delete newErrors.newPatient;
        }
    
        // Validate common fields
        if (!form.date) {
            newErrors.date = "Date is required!";
        }
    
        if (form.treatments.length < 1) {
            newErrors.treatments = "Minimum 1 treatment selected!";
        }
    
        if (form.medicines.length < 1) {
            newErrors.medicines = "Minimum 1 medicine selected!";
        }
    
        if (form.totalPrice < 1) {
            newErrors.totalPrice = "More than Rp. 0 is required!";
        }
    
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
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
                patientId: "",
                date: "",
                totalPrice: 0,
                treatments: [],
                medicines: [],
                note: "",
                isNewPatient: false,
                newPatient: {
                    name: "",
                    codeId: '',
                    email: '',
                    birthDate: ''
                }
            });
            setPending(false);
        }
    };

    return (
        <div className="flex flex-col w-full items-center">
            <form className="bg-white w-2/3" onSubmit={handleSubmit}>
                <div className="w-full flex flex-row py-2">
                    <Checkbox
                        checked={form.isNewPatient}
                        onChange={(e) => {
                            setForm({ ...form, isNewPatient: e.target.checked })
                        }}
                    >
                        New patient
                    </Checkbox>
                </div>

                {
                    !form.isNewPatient  && (
                        <>
                            <div className="pb-1">
                                <label htmlFor="patientId" className="text-black/90 text-sm">
                                    Patient<span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="relative pb-4">
                                <Select
                                    showSearch
                                    placeholder="Select a patient"
                                    options={dataSelectListPatients}
                                    id="patientId"
                                    value={form.patientId}
                                    onChange={(id) => setForm({ ...form, patientId: id })}
                                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full ${errors.patientId ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                    style={{ borderWidth: 1 }}
                                />
                                {errors.patientId && (
                                    <span className="text-[0.70rem] text-red-500">{errors.patientId}</span>
                                )}
                            </div>

                        </>
                    )
                }

                {
                    form.isNewPatient && (
                        <>


                            <div className="pb-1">
                                <label htmlFor="name" className="text-black/90 text-sm">
                                    Name<span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="relative pb-1">
                                <input
                                    type="text"
                                    id="name"
                                    value={form.newPatient.name}
                                    onChange={(e) => {
                                        setForm(prev => ({
                                            ...prev,
                                            newPatient: {
                                                ...prev.newPatient,
                                                name: e.target.value
                                            }
                                        }));
                                    }}
                                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.newPatient?.name ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                    style={{ borderWidth: 1 }}
                                />
                                {errors.newPatient?.name && (
                                    <span className="text-[0.70rem] text-red-500">{errors.newPatient?.name}</span>
                                )}


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
                                    value={form.newPatient.codeId}
                                    onChange={(e) => {
                                        setForm(prev => ({
                                            ...prev,
                                            newPatient: {
                                            ...prev.newPatient,
                                            codeId: e.target.value
                                            }
                                        }));
                                    }}
                                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.newPatient?.codeId ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                    style={{ borderWidth: 1 }}
                                />
                                {errors.newPatient?.codeId && (
                                    <span className="text-[0.70rem] text-red-500">{errors.newPatient?.codeId}</span>
                                )}

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
                                    value={form.newPatient.email}
                                    onChange={(e) => {
                                        setForm(prev => ({
                                            ...prev,
                                            newPatient: {
                                            ...prev.newPatient,
                                            email: e.target.value
                                            }
                                        }));
                                    }}
                                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.newPatient?.email ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                    style={{ borderWidth: 1 }}
                                />
                                {errors.newPatient?.email && (
                                    <span className="text-[0.70rem] text-red-500">{errors.newPatient?.email}</span>
                                )}

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
                                    value={form.newPatient.birthDate}
                                    onChange={(e) => {
                                        setForm(prev => ({
                                            ...prev,
                                            newPatient: {
                                            ...prev.newPatient,
                                            birthDate: e.target.value
                                            }
                                        }));
                                    }}
                                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${errors.newPatient?.birthDate ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                    style={{ borderWidth: 1 }}
                                />
                                {errors.newPatient?.birthDate && (
                                    <span className="text-[0.70rem] text-red-500">{errors.newPatient?.birthDate}</span>
                                )}
                            </div>

                        </>
                    )
                }

                <div className="pb-1">
                    <label htmlFor="treatments" className="text-black/90 text-sm">
                        Treatment Description<span className="text-red-500">*</span>
                    </label>
                </div>
                <div className="relative pb-4">
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select treatments"
                        options={dataSelectListTreatments}
                        id="treatments"
                        onChange={handleChangeTreatments}
                        value={form.treatments.map(t => t.id)}
                        className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full ${errors.treatments ? "border-red-500" : "border-slate-800/10"
                            }`}
                        style={{ borderWidth: 1 }}
                    />
                    {errors.treatments && (
                        <span className="text-[0.70rem] text-red-500">{errors.treatments}</span>
                    )}
                </div>

                {form.treatments.length > 0 && (
                    <div className="mb-4 p-4 bg-white rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Treatment Quantities:</h4>
                        <div className="space-y-3">
                            {form.treatments.map((treatment) => (
                                <div key={treatment.id} className="flex items-center justify-between">
                                    <span className="text-sm">
                                        {treatment.name} (Rp{treatment.cost.toLocaleString()})
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Qty:</span>
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            value={treatment.quantity}
                                            onChange={(value) =>
                                                handleTreatmentQuantityChange(treatment.id, value)
                                            }
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <div className="pb-1">
                    <label htmlFor="medicines" className="text-black/90 text-sm">
                        Medications Prescribed<span className="text-red-500">*</span>
                    </label>
                </div>
                <div className="relative pb-4">
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select medicines"
                        options={dataSelectListMedicines}
                        id="medicines"
                        onChange={handleChangeMedicines}
                        value={form.medicines.map(t => t.id)}
                        className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full ${errors.medicines ? "border-red-500" : "border-slate-800/10"
                            }`}
                        style={{ borderWidth: 1 }}
                    />
                    {errors.medicines && (
                        <span className="text-[0.70rem] text-red-500">{errors.medicines}</span>
                    )}
                </div>

                {form.medicines.length > 0 && (
                    <div className="mb-4 p-4 bg-white rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Medicine Quantities:</h4>
                        <div className="space-y-3">
                            {form.medicines.map((medicine) => (
                                <div key={medicine.id} className="flex items-center justify-between">
                                    <span className="text-sm">
                                        {medicine.name} (Rp{medicine.price.toLocaleString()})
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Qty:</span>
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            value={medicine.quantity}
                                            onChange={(value) =>
                                                handleMedicineQuantityChange(medicine.id, value)
                                            }
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pb-1">
                    <label htmlFor="date" className="text-black/90 text-sm">
                        Date<span className="text-red-500">*</span>
                    </label>
                </div>
                <div className="relative pb-4">
                    <DatePicker
                        format="YYYY-MM-DD"
                        id="date"
                        value={form.date ? dayjs(form.date, 'YYYY-MM-DD') : null}
                        onChange={(date, dateString) => {
                        setForm({ ...form, date: dateString });
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: errors.date ? "#ef4444" : "rgba(0, 0, 0, 0.1)",
                            borderRadius: "0.5rem",
                            width: "100%",
                            height: "2rem",
                            padding: "1rem",
                        }}
                        className="focus:bg-blue-100 focus:outline-none"
                    />
                    {errors.date && (
                        <span className="text-[0.70rem] text-red-500">{errors.date}</span>
                    )}
                </div>

                <div className="pb-1">
                    <label htmlFor="note" className="text-black/90 text-sm">
                        Note
                    </label>
                </div>
                <div className="relative pb-4">
                    <textarea
                        id="note"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg w-full border-slate-800/10"
                        style={{ borderWidth: 1 }}
                        rows={3}
                    />
                </div>

                <div className="w-full flex flex-row py-2">
                    <Checkbox
                        checked={isManualCount}
                        onChange={(e) => setIsManualCount(e.target.checked)}
                    >
                        Manual count for total price
                    </Checkbox>
                </div>

                <div className="pb-1">
                    <label className="text-black/90 text-sm">Total Price<span className="text-red-500">*</span></label>
                </div>
                <div className="relative pb-4">
                    <InputNumber
                        addonBefore="Rp"
                        style={{
                            borderWidth: 1,
                            borderColor: errors.totalPrice ? "#ef4444" : "rgba(0, 0, 0, 0.1)",
                            borderRadius: "0.5rem",
                            width: "100%",
                        }}
                        onChange={(value) => setForm(prev => ({ ...prev, totalPrice: value || 0 }))}
                        value={form.totalPrice}
                        disabled={!isManualCount}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => parseInt(value?.replace(/\./g, '') || '0')}
                    />
                    {errors.totalPrice && (
                        <span className="text-[0.70rem] text-red-500">{errors.totalPrice}</span>
                    )}
                </div>

                <div className="flex w-full mt-4 justify-end gap-4">
                    <button
                        type="button"
                        className="flex justify-center items-center content-center px-8 py-1 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 transition-colors duration-500 text-white text-sm"
                        onClick={() => {
                            setForm({
                                patientId: "",
                                date: "",
                                totalPrice: 0,
                                treatments: [],
                                medicines: [],
                                note: "",
                                isNewPatient: false,
                                newPatient: {
                                    name: "",
                                    codeId: '',
                                    email: '',
                                    birthDate: ''
                                }
                            });
                        }}
                    >
                        Reset
                    </button>

                    {pending ? (
                        <div className="h-8 rounded-full flex justify-center items-center cursor-pointer px-6 bg-blue-600">
                            <span className="loading loading-spinner loading-md text-white"></span>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="h-8 bg-blue-700 rounded-full flex justify-center items-center cursor-pointer px-8 hover:bg-blue-500 transition-colors duration-500"
                        >
                            <span className="text-sm text-white">Submit</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}