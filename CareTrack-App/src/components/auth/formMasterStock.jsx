import { Report } from "notiflix";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormMasterStock({ addMethod, dataSelectListProduct }) {
    const [form, setForm] = useState({ 
        id: "",
        stock: 0
    });
    // const [formTyping, setFormTyping] = useState({ nameTyping: false, codeTyping: false });
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState({
        id: "",
        stock: "",
    });

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        let productId = String(form.id);
        let stock = String(form.stock);
        if (!productId.trim()) {
            newErrors.id = "Product is required!";
        } 

            if (!stock.trim()) {
                newErrors.stock = "Stock is required!";
            } else if(Number(stock.trim()) < 0) {
                newErrors.stock = "Min value is 0!";
            }
        
        return newErrors;
    };
    
    
    const handleAddStock = async (e) => {
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
            const formData = new FormData();
            formData.append('id', form.id);
            formData.append('_method', 'PUT');
            formData.append('add_stock', form.stock);
            
            const result = await addMethod(formData);
            
            if (result.status === "success") {
                setForm({ 
                    id: '',
                    stock: ''
                });
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
            setPending(false);
        }
    };


    return (
        <form onSubmit={handleAddStock} encType="multipart/form-data" >
            <div className="pb-1">
                <label htmlFor="id" className="text-black/90 text-sm">
                    Product<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4 flex flex-col w-full gap-2">
                <select
                    // className="select select-primary"
                    className={`select primary border-solid rounded-lg  w-full ${
                        errors.id ? "border-red-500" : "border-slate-800/10"
                    }`}
                    value={form.id || ""}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                >
                    <option value="" disabled>Select Product</option>
                    {dataSelectListProduct &&
                        dataSelectListProduct.map((data) => (
                            <option key={data.id} value={data.id}>
                                {data.name}
                            </option>
                        ))
                    }
                </select>

                {errors.id && (
                    <span className="text-[0.70rem] text-red-500">{errors.id}</span>
                )}

            </div>



            <div className="pb-1">
                <label htmlFor="stock" className="text-black/90 text-sm">
                    Stock<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="number"
                    min={0}
                    id="stock"
                    value={form.stock}
                    onChange={(e) => {
                        setForm({ ...form, stock: e.target.value });
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${
                        errors.stock ? "border-red-500" : "border-slate-800/10"
                    }`}
                    style={{ borderWidth: 1 }}
                />
            </div>
        

            <div className="flex w-full mt-4 justify-end gap-4">
                <div className="flex justify-center items-center content-center px-8 py-1 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 transition-colors duration-500" 
                    onClick={() => {
                        setForm({ 
                            id: "",
                            stock: 0
                        });
                        document.getElementById('modal-update').close();
                        document.getElementById('modal-add').close();
                        document.getElementById('modal-delete').close();
                    }}
                >
                    <span className="text-sm text-white">Back</span>
                </div>
            {pending ? (
                    <div className="h-8 rounded-full flex justify-center items-center cursor-pointer w-1/4 bg-blue-600 text-black/40 transition-colors duration-500">
                        <span className="loading loading-spinner loading-md text-white"></span>
                    </div>
                
                
            ) : (
                
                    <button
                    type="submit"
                    className="h-8 bg-blue-700 rounded-full flex justify-center items-center cursor-pointer  w-1/4 hover:bg-blue-500 transition-colors duration-500"
                    >
                    <span className="text-sm text-white">Add</span>
                    </button>
            )}
            </div>
        </form>
    )
}