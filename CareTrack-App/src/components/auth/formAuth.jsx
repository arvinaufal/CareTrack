// import { Report } from "notiflix";
import { Report } from "notiflix";
import { ChangeEvent, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};


export default function FormAuth({ formType, postRegister, postLogin }) {
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '', emailUsername: ''});
    const [formTyping, setFormTyping] = useState({ nameTyping: false, usernameTyping: false, emailTyping: false, passwordShowing: false, emailUsernameTyping: false });
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        emailUsername: ""
    });

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (formType === 'register') {
            if (!form.name.trim()) {
                newErrors.name = "Name is required!";
            }else if(form.name.trim().length > 200){
                newErrors.name = "Max 200 characters!";
            }

            if (!form.username.trim()) {
                newErrors.username = "Username is required!";
            } else if(form.username.trim().length > 50){
                newErrors.username = "Max 50 characters!";
            }

            if (!form.email.trim()) {
                newErrors.email = "Email is required!";
            } else if (!validateEmail(form.email)) {
                newErrors.email = "Invalid email address!";
            } else if(form.email.trim().length > 200){
                newErrors.email = "Max 200 characters!";
            }
        } else {
            if (!form.emailUsername.trim()) {
                newErrors.emailUsername = "Username/Email is required!";
            } 
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required!";
        } else if(form.password.trim().length < 8){
            newErrors.password = "Min 8 characters!";
        } else if(form.password.trim().length > 50){
            newErrors.password = "Max 50 characters!";
        }
        
        return newErrors;
    };

    const handleRegister = async (e) => {
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
            const result = await postRegister(form);
            if (result.status === "success") {
                Report.success(
                    "Success",
                    result.message,
                    "Ok",
                    () => {
                        setForm({ name: '', username: '', email: '', password: '' });
                        navigate('/login')
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
    
    const handleLogin = async (e) => {
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
            const result = await postLogin(form);
            
            if (result.status === "success") {
                if (result.data.access_token) {
                    localStorage.setItem('access_token', result.data.access_token);
                }


                Report.success(
                    "Success",
                    result.message,
                    "Ok",
                    () => {
                        setForm({ emailUsername: '', password: '' });
                        navigate('/')
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
        <form onSubmit={formType === 'register' ? handleRegister : handleLogin}>
            {
                formType === 'register'
                &&
                (
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
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });

                                    if (e.target.value !== "" || !e.target.value) {
                                        setFormTyping({ ...formTyping, nameTyping: true });
                                    }
                                }}
                                className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                                    errors.name ? "border-red-500" : "border-slate-800/10"
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
                                    <div className="absolute right-3 cursor-pointer" onClick={() => setForm({ ...form, name: "" })} style={{ top: '0.4rem' }}>
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
                    </>
                )
            }
            {
                formType === 'register'
                &&
                (
                    <>
                        <div className="pb-1">
                            <label htmlFor="username" className="text-black/90 text-sm">
                                Username<span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="relative pb-1">
                            <input
                                type="text"
                                id="username"
                                value={form.username}
                                onChange={(e) => {
                                    setForm({ ...form, username: e.target.value });

                                    if (e.target.value !== "" || !e.target.value) {
                                        setFormTyping({ ...formTyping, usernameTyping: true });
                                    }
                                }}
                                className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                                    errors.username ? "border-red-500" : "border-slate-800/10"
                                }`}
                                style={{ borderWidth: 1 }}
                            />
                            {errors.username && (
                                <span className="text-[0.70rem] text-red-500">{errors.username}</span>
                            )}

                            {
                                formTyping.usernameTyping && form.username !== ''
                                &&
                                (
                                    <div className="absolute right-3 cursor-pointer" onClick={() => setForm({ ...form, username: "" })} style={{ top: '0.4rem' }}>
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



                        {/* Email */}
                        <div className="pb-1">
                            <label htmlFor="email" className="text-black/90 text-sm">
                                Email<span className="text-red-500">*</span>
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
                    </>

                )
            }

            {
                formType === 'login' && (
                    <>       
                        <div className="pb-1">
                            <label htmlFor="emailUsername" className="text-black/90 text-sm">
                                Email/Username<span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="relative pb-1">
                            <input
                                type="text"
                                id="emailUsername"
                                value={form.emailUsername}
                                onChange={(e) => {
                                    setForm({ ...form, emailUsername: e.target.value });

                                    if (e.target.value !== "" || !e.target.value) {
                                        setFormTyping({ ...formTyping, emailUsernameTyping: true });
                                    }
                                }}
                                className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                                    errors.emailUsername ? "border-red-500" : "border-slate-800/10"
                                }`}
                                style={{ borderWidth: 1 }}
                            />
                            {errors.emailUsername && (
                                <span className="text-[0.70rem] text-red-500">{errors.emailUsername}</span>
                            )}

                            {
                                formTyping.emailUsernameTyping && form.emailUsername !== ''
                                &&
                                (
                                    <div className="absolute right-3 cursor-pointer" onClick={() => setForm({ ...form, emailUsername: "" })} style={{ top: '0.4rem' }}>
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
                    </>
                )
            }

            <div className="pb-1">
                <label htmlFor="password" className="text-black/90 text-sm">
                    Password<span className="text-red-500">*</span>
                </label>
            </div>
            <div className="relative pb-1">
                <input
                    type={formTyping.passwordShowing ? "text" : "password"}
                    id="password"
                    value={form.password}
                    onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                    }}
                    // className="focus:bg-blue-100 focus:outline-none p-4 border-solid border-slate-800/10 rounded-lg h-10 w-full pr-10"
                    className={`focus:bg-blue-100 focus:outline-none p-4 border-solid rounded-lg h-8 w-full pr-10 ${
                        errors.password ? "border-red-500" : "border-slate-800/10"
                    }`}
                    style={{ borderWidth: 1 }}
                />
                {errors.password && (
                    <span className="text-[0.70rem] text-red-500">{errors.password}</span>
                )}

                {
                    !formTyping.passwordShowing
                        ?
                        <div className="absolute right-3" style={{ top: '0.35rem' }}>

                            <FaRegEyeSlash
                                size={22}
                                onClick={() => setFormTyping({ ...formTyping, passwordShowing: true })}
                                style={{ cursor: 'pointer', color: "gray" }}
                            />

                        </div>
                        :
                        <div className="absolute right-3" style={{ top: '0.43rem' }}>
                            <FaRegEye
                                size={20}
                                onClick={() => setFormTyping({ ...formTyping, passwordShowing: false })}
                                style={{ cursor: 'pointer', color: "gray" }}
                            />
                        </div>
                }
            </div>
            {pending ? (
                <button disabled={true} className="w-full h-12 rounded-xl flex justify-center items-center cursor-pointer mt-4 bg-[#fc84ac] text-white">
                    <span className="loading loading-spinner loading-md text-white"></span>
                </button>
            ) : (
                <button
                type="submit"
                className="h-12 bg-[#fc84ac] rounded-xl flex justify-center items-center cursor-pointer mt-4 w-full hover:bg-[rgb(255,186,207)] transition-colors duration-500"
                >
                <span className="font-bold text-white">{formType === 'register' ? "Register" : "Log In"}</span>
                </button>
            )}
        </form>
    )
}