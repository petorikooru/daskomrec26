import { useState, useEffect, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';
import ShiftTable from '@components/Table';
import BlueModalWrapper from '@components/BlueBox';
import ShiftSuccessModal from '@components/ShiftInfo';

import utama from '@assets/backgrounds/utama.png';
import buttonImg from '@assets/buttons/ButtonRegular.png';

export default function ShiftPage() {
    // --- UI & ANIMATION STATES ---
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // --- LOGIC STATES ---
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null); 
    const [hasChosen, setHasChosen] = useState(false);

    // --- DATA ---
    const [shifts, setShifts] = useState([
        { id: 1, shift: 'Interview 90', type: 'Onsite', place: 'GKU 03', date: '2026-08-17', timeStart: '10:00', timeEnd: '12:00', quota: 99, caasBooked: Array(45).fill({ id: '1', name: 'Test' }) },
        { id: 2, shift: 'Interview 91', type: 'Onsite', place: 'LAB TELE', date: '2026-08-18', timeStart: '13:00', timeEnd: '15:00', quota: 50, caasBooked: Array(12).fill({ id: '2', name: 'Test' }) },
        { id: 3, shift: 'Technical 01', type: 'Online', place: 'ZOOM MEETING', date: '2026-08-20', timeStart: '09:00', timeEnd: '11:00', quota: 20, caasBooked: Array(20).fill({ id: '3', name: 'Test' }) },
    ]);

    // --- INTRO ANIMATION LOGIC ---
    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => { 
            setIsZooming(false); 
            setInputLocked(false); 
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer); 
            clearTimeout(zoomTimer);
            setShowImage(true); 
            setIsZooming(false); 
            setInputLocked(false);
        };

        window.addEventListener('keydown', (e) => e.key === 'Escape' && skipIntro());
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer); 
            clearTimeout(zoomTimer);
            window.removeEventListener('keydown', skipIntro);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    // --- HANDLERS ---
    const handleAddClick = (shift) => {
        if (hasChosen) return;
        setSelectedShift(shift); 
        setShowModal(true); 
    };

    const handleConfirmAdd = () => {
        setHasChosen(true);
        setShowModal(false);
        setTimeout(() => setShowSuccess(true), 300);
    };

    const handleHomeClick = () => {
        setIsLoggingOut(true); 
        setTimeout(() => router.visit('/user/home'), 500);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000);
        }, 350);
    };

    const styles = `
        @keyframes subtlePulse { 0%,100% { opacity:1 } 50% { opacity:.9 } }
        .pulse-effect { animation: subtlePulse 4s ease-in-out infinite; }
        .cold-blue-filter { filter: brightness(0.8) contrast(1.1) saturate(1.2); }
    `;

    return (
        <>
            <Head title="Choose Shift" />
            <style>{styles}</style>
            
            <div className="fixed inset-0 w-full h-full text-white font-caudex bg-[#0a2a4a] overflow-y-auto md:overflow-hidden">
                
                {/* 1. Background Layer with Zoom & Pulse */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img 
                        ref={backgroundRef}
                        src={utama} 
                        alt="bg" 
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out 
                            ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'} 
                            ${!isZooming ? 'pulse-effect' : ''} cold-blue-filter`} 
                        style={{ 
                            transform: showImage && imageLoaded ? 'scale(1.0)' : 'scale(1.2)',
                            transformOrigin: 'center'
                        }}
                    />
                </div>

                {/* 2. Effects Layer */}
                <div className="fixed inset-0 z-10 pointer-events-none">
                     <UnderwaterEffect />
                </div>

                {/* 3. Global Navigation: Side-Slide Entry */}
                <div className={`fixed top-4 left-4 md:top-6 md:left-6 z-[80] transition-all duration-700 ease-out 
                    ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={() => setIsSidebarOpen(prev => !prev)} />
                </div>

                <div className={`fixed top-4 right-4 md:top-6 md:right-6 z-[80] transition-all duration-700 ease-out 
                    ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                    <ButtonHome onClick={handleHomeClick} />
                </div>

                {/* 4. Content Layer: Entry Scale & Opacity */}
                <div className={`relative z-40 flex flex-col items-center justify-start md:justify-center min-h-full w-full px-4 pt-24 pb-12 md:py-0 transition-all duration-1000
                    ${isZooming || isLoggingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} 
                    ${showModal || showSuccess ? 'blur-sm brightness-75' : ''}`}>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-10 font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-wide text-center shrink-0">
                        Choose Your Shift
                    </h1>

                    <div className="w-full max-w-[95%] md:max-w-7xl">
                         <ShiftTable shifts={shifts} onAddShift={handleAddClick} />
                    </div>

                    <div className="mt-10 md:absolute md:bottom-6 w-full text-center text-white text-[10px] md:text-sm tracking-widest opacity-60">
                        @Atlantis.DLOR2026. All Right Served
                    </div>
                </div>

                {/* 5. Sidebars & Modals */}
                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                <BlueModalWrapper isOpen={showModal} onClose={() => setShowModal(false)}>
                    <div className="flex flex-col justify-center items-center text-center h-full w-full space-y-6 px-4">
                        <h1 className="text-[0px] sm:text-sm text-left sm:text-center -2 sm:pl-0 text-white tracking-[0.2em] uppercase font-bold">Let The Deep Uncover Your Purpose</h1>
                        <h1 className="text-xl sm:text-5xl text-white font-bold leading-tight">Are you sure you want <br /> to add this shift?</h1>
                        <div className="flex gap-4 flex-col sm:flex-row md:gap-6">                    
                            <button onClick={() => setShowModal(false)} className="relative w-40 h-12 px-6 active:scale-95 transition-transform">
                                <img src={buttonImg} alt="btn" className="absolute inset-0 w-full h-full object-fill" />
                                <span className="relative z-10 text-white text-2xl font-bold">No</span>
                            </button>
                            <button onClick={handleConfirmAdd} className="relative w-40 h-12 px-6 active:scale-95 transition-transform">
                                <img src={buttonImg} alt="btn" className="absolute inset-0 w-full h-full object-fill" />
                                <span className="relative z-10 text-white text-2xl font-bold">Yes</span>
                            </button>
                        </div>
                    </div>
                </BlueModalWrapper>

                <ShiftSuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} shift={selectedShift} />

                {/* 6. Exit / Input Lock Layer */}
                <div className={`fixed inset-0 z-[90] pointer-events-none transition-opacity duration-1000 bg-[#0a2a4a] ${isLoggingOut ? 'opacity-100' : 'opacity-0'}`} />
                {inputLocked && <div className="fixed inset-0 z-[100] cursor-wait" />}
            </div>
        </>
    );
}