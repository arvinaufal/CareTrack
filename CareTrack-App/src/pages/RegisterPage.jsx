import { Link, redirect } from "react-router-dom";
import axios from "axios";
import FormAuth from "../components/auth/formAuth";

export default function RegisterPage() {
    const postRegister = async (payload) => {
        const { name, username, email, password, emailUsername } = payload;

        try {
            const response = await axios.post(
                `http://127.0.0.1:3000/api/register`,
                {
                    name,
                    username,
                    email,
                    password,
                    emailUsername
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            if (response.status === 201) {
                return response.data;
            }

        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);

            return error.response?.data;
        }
    };


    return (
        <section className=" min-h-screen w-screen">
            <div className="flex flex-col w-full h-screen">

                <div className="flex flex-row w-full justify-center my-5 h-10">
                    <a href="https://www.carenow.id/" className="w-40 h-40">
                        <img src="https://www.carenow.id/_next/image?url=%2Fcarenow-logo-raspberry-black.png&w=3840&q=75" alt="" />
                    </a>
                </div>
                <div className=" flex flex-row w-full h-full px-4">
                    <div className="flex flex-col justify-center content-center items-center w-1/2">
                        <div className="flex flex-col justify-center content-center items-center ml-48">
                            <div className=" ">
                                <img src={"/public/images/register-cover.png"} alt="People illustrations by Storyset" style={{ width: 350 }} />
                            </div>
                            <div className="flex flex-col w-full items-center justify-center text-center">
                                <div className="">
                                    <span className="text-lg font-bold text-slate-950 italic">CareTrack</span>
                                </div>
                                <div className="w-5/6 pt-2">
                                    <span className="text-sm font-light">Streamlining Care, One Record at a Time</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className=" flex flex-col justify-center content-center items-center w-1/2 mb-20">
                        <div className="container w-2/3 h-2/3  flex flex-col justify-center content-center items-center mr-48">
                            <div className="w-full mx-4 my-4">
                                <div className="w-full text-center">
                                    <span className="font-bold text-xl">Create your account</span>
                                </div>
                                <div className="w-full text-center">
                                    {/* <span className="text-sm">Sudah punya akun? <Link to={'/login'} className="font-extrabold text-[#ffecf4]">Masuk</Link></span> */}
                                    <span className="text-sm">Already have an account? <Link to={'/login'} className="font-extrabold text-[#fc84ac]">Log In</Link></span>
                                </div>
                            </div>
                            <div className="w-5/6 rounded-2xl shadow-lg flex flex-col">
                                <div className="p-6 flex flex-col w-full">
                                    <FormAuth formType="register" postRegister={postRegister} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}