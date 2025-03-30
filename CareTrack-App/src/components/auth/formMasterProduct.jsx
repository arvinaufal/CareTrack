import { Report } from "notiflix";
import { useEffect, useState } from "react";

export default function FormMasterProduct({ formType, addMethod, updateMethod, selectedData, dataSelectListCategory }) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const [form, setForm] = useState({
        id: '',
        name: '',
        code: '',
        sell_price: 0,
        buy_price: 0,
        category_id: '',
        photos: [],
        registered_date: formattedDate,
        stock: 0
    });
    const [formTyping, setFormTyping] = useState({ nameTyping: false, codeTyping: false });
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        code: "",
        sell_price: "",
        buy_price: "",
        category_id: "",
        stock: "",
        photos: "",
    });

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Category name is required!";
        } else if (form.name.trim().length > 200) {
            newErrors.name = "Max 200 characters!";
        }

        if (!form.category_id) {
            newErrors.category_id = "Category is required!";
        }
        if (!form.code.trim()) {
            newErrors.code = "Code is required!";
        }

        if (formType === 'update') {
            let stock = String(form.stock);
            if (!stock.trim()) {
                newErrors.stock = "Stock is required!";
            } else if (Number(stock.trim()) < 0) {
                newErrors.stock = "Min value is 0!";
            }
        }

        let sellPrice = String(form.sell_price);
        let buyPrice = String(form.buy_price);

        if (!sellPrice.trim()) {
            newErrors.sell_price = "Sell price is required!";
        } else if (Number(sellPrice.trim()) < 1) {
            newErrors.sell_price = "Must be more than 0!";
        } else if (sellPrice <= buyPrice) {
            newErrors.sell_price = "Sell price must be more than buy price!";
        }

        if (!buyPrice.trim()) {
            newErrors.buy_price = "Buy price is required!";
        } else if (Number(buyPrice.trim()) < 1) {
            newErrors.buy_price = "Must be more than 0!";
        }

        // Add photo validation
        if (!form.photos || form.photos.length < 3) {
            newErrors.photos = "Minimum 3 photos required!";
        } else if (form.photos.length > 6) {
            newErrors.photos = "Maximum 6 photos allowed!";
        }

        return newErrors;
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 6) {
            setErrors({ ...errors, photos: "Maximum 6 photos allowed!" });
            return;
        }

        setForm({ ...form, photos: files });
        setErrors({ ...errors, photos: "" });
    };

    const handleAddCategory = async (e) => {
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
            formData.append('name', form.name);
            formData.append('code', form.code);
            formData.append('sell_price', form.sell_price);
            formData.append('buy_price', form.buy_price);
            formData.append('category_id', form.category_id);
            formData.append('registered_date', form.registered_date);


            form.photos.forEach((photo) => {
                formData.append('photos[]', photo);
            });


            const result = await addMethod(formData);

            if (result.status === "success") {
                setForm({
                    id: '',
                    name: '',
                    code: '',
                    sell_price: '',
                    buy_price: '',
                    category_id: '',
                    photos: [],
                    registered_date: '',
                    stock: ''
                });
                Report.success("Success", result.message, "Ok");
            } else {
                Report.failure("Failed", result.message || "Something went wrong", "Ok");
            }
        } catch (error) {
            Report.failure("Failed", error.message, "Ok");
        } finally {
            setPending(false);
        }
    };


    const handleUpdateCategory = async (e) => {
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
            formData.append('name', form.name);
            formData.append('code', form.code);
            formData.append('sell_price', form.sell_price);
            formData.append('buy_price', form.buy_price);
            formData.append('category_id', form.category_id);
            formData.append('stock_id', form.stock_id);
            formData.append('stock', form.stock);
            formData.append('registered_date', form.registered_date);


            form.photos.forEach((photo, index) => {
                if (photo instanceof File) {
                    formData.append(`new_photos[${index}]`, photo);
                } else {
                    formData.append(`existing_photos[${index}]`, photo);
                }
            });

            const result = await updateMethod(formData);

            if (result.status === "success") {
                setForm({
                    id: '',
                    name: '',
                    code: '',
                    sell_price: '',
                    buy_price: '',
                    category_id: '',
                    photos: [],
                    registered_date: '',
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

    useEffect(() => {
        if (formType === 'update' && selectedData) {

            setForm({
                ...selectedData,
                photos: selectedData.photos || []
            });
        }
    }, [selectedData, formType]);


    return (
        <form onSubmit={formType === 'add' ? handleAddCategory : handleUpdateCategory} encType="multipart/form-data" >
            <div className="pb-1">
                <label htmlFor="name" className="text-black/90 text-sm">
                    Name<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
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
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
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
                <label htmlFor="category_id" className="text-black/90 text-sm">
                    Category<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4 flex flex-col w-full gap-2">
                <select
                    className={`select primary border-solid rounded-lg  w-full ${errors.category_id ? "border-red-500" : "border-slate-800/10"
                        }`}
                    value={form.category_id || ""}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                    <option value="" disabled>Select category</option>
                    {dataSelectListCategory &&
                        dataSelectListCategory.map((data) => (
                            <option key={data.id} value={data.id}>
                                {data.name}
                            </option>
                        ))
                    }
                </select>

                {errors.category_id && (
                    <span className="text-[0.70rem] text-red-500">{errors.category_id}</span>
                )}

            </div>

            <div className="pb-1">
                <label htmlFor="code" className="text-black/90 text-sm">
                    Code<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="text"
                    id="code"
                    value={form.code}
                    onChange={(e) => {
                        setForm({ ...form, code: e.target.value });

                        if (e.target.value !== "" || !e.target.value) {
                            setFormTyping({ ...formTyping, codeTyping: true });
                        }
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${errors.code ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.code && (
                    <span className="text-[0.70rem] text-red-500">{errors.code}</span>
                )}

                {
                    formTyping.codeTyping && form.code !== ''
                    &&
                    (
                        <div className="absolute right-3" onClick={() => setForm({ ...form, code: "" })} style={{ top: '0.35rem' }}>
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
                <label htmlFor="sell_price" className="text-black/90 text-sm">
                    Sell Price<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="number"
                    min={0}
                    id="sell_price"
                    value={form.sell_price}
                    onChange={(e) => {
                        setForm({ ...form, sell_price: e.target.value });
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${errors.sell_price ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.sell_price && (
                    <span className="text-[0.70rem] text-red-500">{errors.sell_price}</span>
                )}
            </div>



            <div className="pb-1">
                <label htmlFor="buy_price" className="text-black/90 text-sm">
                    Buy Price<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="number"
                    min={0}
                    id="buy_price"
                    value={form.buy_price}
                    onChange={(e) => {
                        setForm({ ...form, buy_price: e.target.value });
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${errors.buy_price ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.buy_price && (
                    <span className="text-[0.70rem] text-red-500">{errors.buy_price}</span>
                )}
            </div>


            <div className="pb-1">
                <label htmlFor="registered_date" className="text-black/90 text-sm">
                    Registered Date<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="text"
                    id="registered_date"
                    value={form.registered_date}
                    disabled={true}
                    className={`bg-slate-200 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 border-slate-800/10`}
                    style={{ borderWidth: 1 }}
                />
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
                    disabled={formType === 'add' ? true : false}
                    onChange={(e) => {
                        setForm({ ...form, stock: e.target.value });
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`${formType === 'update' ? 'focus:bg-blue-100 focus:outline-none p-4 h-8 w-full' : 'bg-slate-200'} focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full  ${errors.stock ? "border-red-500" : "border-slate-800/10"
                        }`}
                    style={{ borderWidth: 1 }}
                />
            </div>



            <div className="pb-1">
                <label htmlFor="photo" className="text-black/90 text-sm">
                    Photo<span className="text-red-500">*</span> (3-6 photos)
                </label>
            </div>
            <div className="relative pb-4">
                <input
                    type="file"
                    className={`file-input file-input-primary border-solid rounded-lg w-full ${errors.photos ? "border-red-500" : ""
                        }`}
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={handlePhotoChange}
                />
                {errors.photos && (
                    <span className="text-[0.70rem] text-red-500">{errors.photos}</span>
                )}
                {form.photos.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                        Selected {form.photos.length} photo(s)
                    </div>
                )}
            </div>


            {form.photos && form.photos.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {form.photos.map((photo, index) => (
                        <div key={index} className="relative">
                            <img
                                src={photo instanceof File ? URL.createObjectURL(photo) : `https://erlangga-inventory.arvinaufal.my.id/${photo.path}`}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover rounded"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                onClick={() => {
                                    const newPhotos = [...form.photos];
                                    newPhotos.splice(index, 1);
                                    setForm({ ...form, photos: newPhotos });
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}



            <div className="flex w-full mt-4 justify-end gap-4">
                <div className="flex justify-center items-center content-center px-8 py-1 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 transition-colors duration-500"
                    onClick={() => {
                        
                        setForm({
                            id: '',
                            name: '',
                            code: '',
                            sell_price: 0,
                            buy_price: 0,
                            category_id: '',
                            photos: [],
                            registered_date: formattedDate,
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
                        <span className="text-sm text-white">{formType === 'add' ? "Tambah" : "Edit"}</span>
                    </button>
                )}
            </div>
        </form>
    )
}