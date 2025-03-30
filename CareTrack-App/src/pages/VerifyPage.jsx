import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function VerifyPage() {
    const [status, setStatus] = useState('verifying');
    // <a href="https://storyset.com/user">User illustrations by Storyset</a>
    const [searchParams] = useSearchParams();
    const data = searchParams.get("data");

    useEffect(() => {
        if (data) {
            axios.post("http://127.0.0.1:3000/api/verify", { data })
                .then(response => {
                    setStatus('success')
                })
                .catch(error => {
                    setStatus('failed')
                });
        } else {
            setStatus('failed')
        }
    }, [data]);

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
                                <img src={"/public/images/verify-cover.png"} alt="People illustrations by Storyset" style={{ width: 350 }} />
                            </div>
                            <div className="flex flex-col w-full items-center justify-center text-center">
                                <div className="">
                                    <span className="text-lg font-bold text-slate-950 italic">CareTrack</span>
                                </div>
                                <div className="w-5/6 pt-2">
                                    <span className="text-sm font-light">Where Healthcare Meets Seamless Documentation</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className=" flex flex-col justify-center content-center items-center w-1/2 mb-20">
                        <div className="container w-2/3 h-2/3  flex flex-col justify-center content-center items-center mr-48">
                            <div className="w-5/6 rounded-2xl shadow-lg flex flex-col">

                                {
                                    status === 'verifying' && (
                                        <div className="pb-16 px-16 pt-6 flex flex-col w-full justify-center items-center content-center">
                                            <div className="w-full mb-14">
                                                <div className="w-full text-center">
                                                    <span className="font-bold text-xl">Please wait!</span>
                                                </div>
                                                <div className="w-full text-center flex flex-col">
                                                    <span className="text-sm">Your account is currently being verified.</span>
                                                    <span className="text-sm">Please wait a moment!</span>
                                                </div>
                                            </div>
                                            <Spin indicator={<LoadingOutlined style={{ fontSize: 58 }} spin />} />
                                        </div>
                                    )
                                }
                                {
                                    status === 'failed' && (
                                        <div className="pb-8 px-8 pt-6 flex flex-col w-full justify-center items-center content-center">
                                            <div className="w-full mb-6">
                                                <div className="w-full text-center">
                                                    <span className="font-bold text-xl">Verification Failed!</span>
                                                </div>
                                                <div className="w-full text-center flex flex-col">
                                                    <span className="text-sm">The account was not found or has already been verified.</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-center content-center w-56">
                                                <DotLottieReact
                                                    src={"/public/lottie/1742762093915.lottie"}
                                                    loop
                                                    autoplay
                                                />

                                            </div>
                                            <div className="flex mt-8">
                                                <span className="text-sm">Back to <Link to={'/login'} className="text-[#fc84ac] font-semibold">Login</Link></span>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    status === 'success' && (
                                        <div className="pb-8 px-8 pt-6 flex flex-col w-full justify-center items-center content-center">
                                            <div className="w-full mb-6">
                                                <div className="w-full text-center">
                                                    <span className="font-bold text-xl">Verification Successful!</span>
                                                </div>
                                                <div className="w-full text-center flex flex-col">
                                                    <span className="text-sm">The account has been successfully verified.</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-center content-center w-56">
                                                <DotLottieReact
                                                    src={"/public/lottie/1742762151857.lottie"}
                                                    loop
                                                    autoplay
                                                />

                                            </div>
                                            <div className="flex mt-8">
                                                <span className="text-sm">Back to <Link to={'/login'} className="text-[#fc84ac] font-semibold">Login</Link></span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}