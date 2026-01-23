import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';

import utama from '@assets/backgrounds/utama.png';
import logoImg from '@assets/logo/ORB_DLOR 1.png';
import PCboard from '@assets/backgrounds/01-ABoard_PC.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';
import qrCodeImg from '@assets/logo/Code.jpeg';

export default function OaLinePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const lineInfo = {
        id: "@492ehaee",
        link: "https://line.me/R/ti/p/%40492ehaee" 
    };

    return (
        <>
            <Head title="OA Line Information" />
            <div className="relative w-full h-screen overflow-hidden text-white font-caudex">

                {/* --- NAVIGATION --- */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
                    <ButtonSidebar onClick={() => setIsSidebarOpen(true)} />
                </div>

                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
                    <ButtonHome onClick={() => router.visit('/user/home')} />
                </div>

                {/* --- BACKGROUND --- */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={utama}
                        alt="Background Utama"
                        className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-slate-900/80" />
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none">
                    <UnderwaterEffect />
                </div>

                {/* --- MAIN CONTENT BOARD --- */}
                <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                    
                    {/* Container Board Responsif */}
                    <div className="relative w-[85vw] aspect-[3/4] sm:w-auto sm:h-[85vh] sm:aspect-[4/3] max-w-[1000px] flex flex-col items-center justify-center animate-popup">
                        
                        {/* Frame Images */}
                        <img
                            src={Mobileboard}
                            alt="Frame Mobile"
                            className="block sm:hidden absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                        />
                        <img
                            src={PCboard}
                            alt="Frame PC"
                            className="hidden sm:block absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                        />

                        {/* Content Safe Zone */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center 
                                        pt-[28%] pb-[22%] px-[14%] 
                                        sm:pt-[22%] sm:pb-[18%] sm:px-[18%]">
                            
                            <h1 className="text-2xl sm:text-5xl font-bold mb-6 mx-5 sm:mx-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                                Official Account Line
                            </h1>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 w-full h-full max-h-[70%]">
                                
                                {/* QR Code Area */}
                                <div className="shrink-0 bg-white p-2 rounded-xl shadow-lg rotate-0 sm:-rotate-2 transition-transform hover:rotate-0 duration-300">
                                    <img 
                                        src={qrCodeImg} 
                                        alt="QR Code Line" 
                                        className="w-24 h-24 sm:w-32 sm:h-32 sm:w-50 sm:h-50 object-contain"
                                    />
                                </div>

                                {/* Text Info Area */}
                                <div className="flex flex-col items-center sm:items-start space-y-2 sm:space-y-4 max-w-full">
                                    
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-[10px] sm:text-sm text-white uppercase tracking-widest font-bold">
                                            ID Line
                                        </span>
                                        <p className="text-lg sm:text-xl sm:text-3xl font-bold drop-shadow-sm select-all tracking-wide">
                                            {lineInfo.id}
                                        </p>
                                    </div>

                                    <a 
                                        href={lineInfo.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#0C365B] hover:brightness-110 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold shadow-lg 
                                                   transition-all active:scale-95 flex items-center gap-2 text-xs sm:text-sm sm:text-base mt-1"
                                    >
                                        <span>Add Friend</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Logo DLOR */}
                        <div className="absolute bottom-[13%] right-[20%] sm:bottom-[22%] sm:right-[20%] pointer-events-none">
                            <img 
                                src={logoImg} 
                                alt="DLOR Logo" 
                                className="w-10 h-10 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
                            />
                        </div>

                    </div>
                </div>

                {/* --- SIDEBAR --- */}
                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={() => router.post('/logout')} 
                />

            </div>
        </>
    );
}