import React, { useState } from 'react'; 
import { router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';

import PCboard from '@assets/backgrounds/01-ABoard_PC.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';
import logoImg from '@assets/logo/ORB_DLOR 1.png';

export default function ShiftSuccessModal({ isOpen, onClose, shift }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!isOpen) return null;

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        return timeString.substring(0, 5);
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 transition-opacity duration-300 px-4">

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
                <ButtonSidebar onClick={() => setIsSidebarOpen(true)} />
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
                <ButtonHome onClick={() => router.visit('/user/home')} />
            </div>

            <div className="relative w-[85vw] aspect-[3/4] sm:w-auto sm:h-[85vh] sm:aspect-[4/3] max-w-[1000px] flex flex-col items-center justify-center animate-popup">
                
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

                <div className="absolute top-[26%] bottom-[22%] left-0 right-0 z-10 flex flex-col items-center justify-center">
                    
                    <div className="p-12 sm:p-0 w-fit max-w-[85%] flex flex-col items-start text-left">
                        
                        <h1 className="font-caudex text-base sm:text-xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-2 md:mb-5">
                            You can't change the shift once you <br/> choose it
                        </h1>

                        <div className="flex flex-col mb-2 md:mb-5 w-full">
                            <h1 className="font-caudex text-base sm:text-xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-1 tracking-wide whitespace-nowrap">
                                Date : {shift?.date}
                            </h1>
                            <h1 className="font-caudex text-base sm:text-xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide whitespace-nowrap">
                                Time : {formatTime(shift?.time_start)} - {formatTime(shift?.time_end)} WIB
                            </h1>
                        </div>

                        <h1 className="font-caudex text-base sm:text-xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide">
                            Don't forget to check OA Line for next <br/> information!
                        </h1>

                    </div>
                    
                    <div className="absolute bottom-[2%] right-[20%] sm:right-[15%] md:right-[20%] pointer-events-none">
                        <img 
                            src={logoImg} 
                            alt="DLOR Logo" 
                            className="w-[12vw] max-w-[50px] md:max-w-[90px] h-auto object-contain drop-shadow-md"
                        />
                    </div>
                    
                </div>
            </div>

            <UserSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={() => router.post('/logout')} 
            />

        </div> 
    );
}