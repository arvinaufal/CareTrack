import { Report } from "notiflix";
import { useEffect, useState } from "react";

export default function FormMasterSales({ addMethod, dataSelectListProduct }) {
    const [form, setForm] = useState({ 
        code: "",
        total_price: 0,
        sale_date: "",
        sales_detail: []
    });
    const [formTyping, setFormTyping] = useState({ codeTyping: false });
    const [pending, setPending] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(false);
    const [errors, setErrors] = useState({
        code: "",
        sales_detail: "",
    });
    const [productLeft, setProductLeft] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const validateForm = () => {
        const newErrors = {};

        let code = String(form.code.trim());
        if (!code) {
            newErrors.code = "Code is required!";
        }

        if (form.sales_detail.length < 1) {
            newErrors.sales_detail = "Minimum 1 product required!";
        }
        
        // Validate each product quantity
        form.sales_detail.forEach((item, index) => {
            if (item.product_quantity <= 0) {
                newErrors[`product_quantity_${index}`] = "Quantity must be greater than 0";
            }
            
            const product = productLeft.find(p => p.product_id === item.product_id);
            if (product && item.product_quantity > product.product_stock) {
                newErrors[`product_quantity_${index}`] = "Quantity cannot exceed stock";
            }
        });
        
        return newErrors;
    };
    
    const handleAddSales = async (e) => {
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
            // Calculate total price
            const totalPrice = form.sales_detail.reduce((total, item) => {
                const product = productLeft.find(p => p.product_id === item.product_id);
                return total + (product.sell_price * item.product_quantity);
            }, 0);
            
            const payload = {
                code: form.code,
                sale_date: form.sale_date,
                total_price: totalPrice,
                items: form.sales_detail.map(item => ({
                    product_id: item.product_id,
                    product_quantity: item.product_quantity
                }))
            };

            
            
            const result = await addMethod(payload);
            
            if (result.status === "success") {
                setForm({ 
                    code: "",
                    total_price: 0,
                    sale_date: new Date().toISOString().split('T')[0],
                    sales_detail: []
                });
                setSelectedProducts([]);
                Report.success(
                    "Success",
                    result.message,
                    "Ok"
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
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setForm(prev => ({ ...prev, sale_date: formattedDate }));
        
        if (dataSelectListProduct) {
            const formattedProductLeft = dataSelectListProduct.map((product) => {
                const {id, name, sell_price, stock} = product;
                return {
                    product_id: id,
                    product_name: name,
                    sell_price,
                    product_stock: stock,
                    isLeft: true
                };
            });

            setProductLeft(formattedProductLeft);
        }
    }, [dataSelectListProduct]);

    const addProduct = () => {
        setForm(prev => ({
            ...prev,
            sales_detail: [...prev.sales_detail, {
                product_id: "",
                product_quantity: 0
            }]
        }));
    };

    const removeProduct = (index) => {
        const updatedSalesDetail = [...form.sales_detail];
        const removedProduct = updatedSalesDetail.splice(index, 1)[0];
        
        setForm(prev => ({
            ...prev,
            sales_detail: updatedSalesDetail
        }));

        if (removedProduct.product_id) {
            setProductLeft(prev => 
                prev.map(product => 
                    product.product_id === removedProduct.product_id 
                        ? { ...product, isLeft: true } 
                        : product
                )
            );
        }
    };
    const handleProductChange = (index, productId) => {
        const previousProductId = form.sales_detail[index]?.product_id;
        if (previousProductId) {
            setProductLeft(prev => 
                prev.map(product => 
                    product.product_id === previousProductId 
                        ? { ...product, isLeft: true } 
                        : product
                )
            );
        }

        setProductLeft(prev => 
            prev.map(product => 
                product.product_id === productId 
                    ? { ...product, isLeft: false } 
                    : product
            )
        );

        // Update the form state
        const updatedSalesDetail = [...form.sales_detail];
        updatedSalesDetail[index] = {
            ...updatedSalesDetail[index],
            product_id: productId,
            product_quantity: 0
        };
        
        setForm(prev => ({
            ...prev,
            sales_detail: updatedSalesDetail
        }));
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedSalesDetail = [...form.sales_detail];
        updatedSalesDetail[index] = {
            ...updatedSalesDetail[index],
            product_quantity: parseInt(quantity) || 0
        };
        
        setForm(prev => ({
            ...prev,
            sales_detail: updatedSalesDetail
        }));
    };

    const getAvailableProducts = () => {
        return productLeft;
    };

    useEffect(() => {
        setIsProductEmpty(productLeft.length === form.sales_detail.length);
    }, [productLeft, form.sales_detail]);

    const getProductStock = (productId) => {
        const product = productLeft.find(p => p.product_id === productId);
        return product ? product.product_stock : 0;
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full justify-center items-end content-end mb-4">
            <button 
                className="flex cursor-pointer rounded-full bg-[#084ca4] text-white px-4 py-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={addProduct}
                disabled={isProductEmpty}
            >
                + Add product
            </button>

            </div>
            <form onSubmit={handleAddSales}>
                <div className="pb-1">
                    <label htmlFor="sale_date" className="text-black/90 text-sm">
                        Sales Date<span className="text-red-500">*</span>
                    </label>
                </div>
                <div className="relative pb-4">
                    <input
                        type="text"
                        id="sale_date"
                        value={form.sale_date}
                        disabled={true}
                        // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                        className={`bg-slate-200 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 border-slate-800/10`}
                        style={{ borderWidth: 1 }}
                    />
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
                        className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                            errors.code ? "border-red-500" : "border-slate-800/10"
                        }`}
                        style={{ borderWidth: 1 }}
                    />
                    {errors.code && (
                        <span className="text-[0.70rem] text-red-500">{errors.code}</span>
                    )}
                    {formTyping.codeTyping && form.code !== '' && (
                        <div className="absolute right-3" onClick={() => setForm({ ...form, code: "" })} style={{ top: '0.35rem' }}>
                            <img
                                src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.4244 4.57557C23.5257 8.67683 23.5247 15.3242 19.4244 19.4244C15.3242 23.5247 8.67683 23.5257 4.57557 19.4244C0.474315 15.3232 0.475305 8.67584 4.57557 4.57557C8.67584 0.475305 15.3232 0.474315 19.4244 4.57557ZM10.5151 12L8.28778 14.2273C7.87774 14.6374 7.87774 15.3022 8.28778 15.7122C8.69782 16.1223 9.36263 16.1223 9.77267 15.7122L12 13.4849L14.2273 15.7122C14.6374 16.1223 15.3022 16.1223 15.7122 15.7122C16.1223 15.3022 16.1223 14.6374 15.7122 14.2273L13.4849 12L15.7122 9.77267C16.1223 9.36263 16.1223 8.69782 15.7122 8.28778C15.3022 7.87774 14.6374 7.87774 14.2273 8.28778L12 10.5151L9.77267 8.28778C9.36263 7.87774 8.69782 7.87774 8.28778 8.28778C7.87774 8.69782 7.87774 9.36263 8.28778 9.77267L10.5151 12Z' fill='%238E919B'/%3E%3C/svg%3E"
                                alt="Clear input"
                                width={20}
                                height={20}
                            />
                        </div>
                    )}
                </div>
            
                <div className="w-full flex flex-col justify-center items-center content-center gap-4">
                    {form.sales_detail.map((item, index) => (
                        <div key={index} className="w-full flex flex-row justify-center items-center content-center gap-2 border p-4 rounded-lg">
                            <div className="flex flex-col flex-1"> 
                                <div className="pb-1">
                                    <label htmlFor={`product-${index}`} className="text-black/90 text-sm">
                                        Product<span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative pb-4 flex flex-col w-full gap-2">
                                    <select
                                        className={`select select-bordered w-full ${
                                            errors[`product_${index}`] ? "border-red-500" : ""
                                        }`}
                                        value={item.product_id}
                                        onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                                        required
                                    >
                                        <option value="" disabled>Select Product</option>
                                        {getAvailableProducts().map((data) => (
                                            <option 
                                                key={data.product_id} 
                                                value={data.product_id}
                                                disabled={!data.isLeft}
                                            >
                                                {data.product_name} (Stock: {data.product_stock}, Price: {data.sell_price})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="pb-1">
                                    <label htmlFor={`stock-${index}`} className="text-black/90 text-sm">
                                        Stock
                                    </label>
                                </div>
                                <div className="relative pb-4">
                                    <input
                                        type="number"
                                        id={`stock-${index}`}
                                        value={item.product_id ? getProductStock(item.product_id) : 0}
                                        className="bg-slate-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full"
                                        style={{ borderWidth: 1 }}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="pb-1">
                                    <label htmlFor={`quantity-${index}`} className="text-black/90 text-sm">
                                        Quantity<span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative pb-4">
                                    <input
                                        type="number"
                                        min={0}
                                        max={item.product_id ? getProductStock(item.product_id) : 0}
                                        id={`quantity-${index}`}
                                        value={item.product_quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full ${
                                            errors[`product_quantity_${index}`] ? "border-red-500" : "border-slate-800/10"
                                        }`}
                                        style={{ borderWidth: 1 }}
                                        required
                                    />
                                    {errors[`product_quantity_${index}`] && (
                                        <span className="text-[0.70rem] text-red-500">{errors[`product_quantity_${index}`]}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-end h-full pt-2">
                                <button 
                                    type="button" 
                                    className="btn btn-error btn-sm text-white"
                                    onClick={() => removeProduct(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {errors.sales_detail && (
                    <div className="text-red-500 text-sm mt-2">{errors.sales_detail}</div>
                )}

                <div className="flex w-full mt-4 justify-end gap-4">
                    <button 
                        type="button"
                        className="flex justify-center items-center content-center px-8 py-1 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 transition-colors duration-500 text-white text-sm"
                        onClick={() => {
                            setForm({ 
                                code: "",
                                total_price: 0,
                                sale_date: "",
                                sales_detail: []
                            });
                            document.getElementById('modal-update')?.close();
                            document.getElementById('modal-add')?.close();
                            document.getElementById('modal-delete')?.close();
                        }}
                    >
                        Back
                    </button>
                    
                    {pending ? (
                        <div className="h-8 rounded-full flex justify-center items-center cursor-pointer px-6 bg-blue-600 text-black/40 transition-colors duration-500">
                            <span className="loading loading-spinner loading-md text-white"></span>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="h-8 bg-blue-700 rounded-full flex justify-center items-center cursor-pointer px-8 hover:bg-blue-500 transition-colors duration-500"
                        >
                            <span className="text-sm text-white">Add</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}