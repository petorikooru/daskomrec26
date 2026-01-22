import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import ConfirmationModal from '@components/ConfirmationModal';
import SuccessModal from '@components/SuccessModal';

import utama from '@assets/backgrounds/utama.png'; 
import build from '@assets/others/DECORATIONS/Atlantis Ruins/06-Building.png';
import road from '@assets/backgrounds/road2.png'; 
import seaweed from '@assets/others/DECORATIONS/Seaweed & Coral Reefs/29.png';
import fishGroup from '@assets/others/DECORATIONS/Fish & Other Sea Creatures/02-Fish.png';
import buttonImg from '@assets/buttons/sign1.png'; 

export default function ChangePassword() {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000); 
        }, 350);
    };

    const handleChangeClick = () => {
        setShowModal(true); 
    };

const handleConfirmChange = () => {
        setShowModal(false); 
        setTimeout(() => {
            setShowSuccess(true); 
        }, 300);
        
        setOldPassword('');
        setNewPassword('');
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false); 
        }, 1800);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') { 
                if (showModal) {
                    setShowModal(false);
                } else {
                    clearTimeout(showTimer);
                    clearTimeout(zoomTimer);
                    setShowImage(true);
                    setIsZooming(false);
                    setInputLocked(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal]);

    const getBackgroundStyle = () => ({
        transform: isZooming ? 'scale(1.5)' : 'scale(1)',
        opacity: showImage ? 1 : 0, 
        filter: isSidebarOpen || showModal ? 'brightness(0.5) blur(3px)' : 'brightness(0.8) saturate(1.2)', 
        transition: 'transform 1.5s ease-out, opacity 0.7s ease-in, filter 0.5s ease',
    });

    const getFormStyle = () => ({
        opacity: !inputLocked && !isLoggingOut ? 1 : 0,
        transform: !inputLocked && !isLoggingOut ? 'translateY(0)' : 'translateY(20px)',
        filter: showModal ? 'blur(5px)' : 'none',
        pointerEvents: showModal ? 'none' : 'auto',
        transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s, filter 0.3s', 
    });

    const swimStyle = `
        @keyframes swimRightToLeft {
            0% { transform: translateX(110vw) translateY(0); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateX(-30vw) translateY(-20px); opacity: 0; }
        }
        @keyframes swimLeftToRight {
            0% { transform: translateX(-30vw) translateY(0); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateX(110vw) translateY(-20px); opacity: 0; }
        }
        .fish-top-anim {
            animation: swimRightToLeft 35s linear infinite;
        }
        .fish-bottom-anim {
            animation: swimLeftToRight 40s linear infinite;
        }
    `;

    return (
        <>
            <Head title="Change Password" />
            <style>{swimStyle}</style>

            <div className="relative w-full h-screen overflow-hidden text-white font-caudex">
                
                {/* 1. BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none blur-[3px] transition-all duration-700">
                    <div className="absolute inset-0 bg-[#0C365B]" /> 
                    <img
                        ref={backgroundRef}
                        src={utama}
                        alt="background"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={getBackgroundStyle()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                            src={build} 
                            alt="building" 
                            className="absolute inset-0 w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* 2. ROAD */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <img 
                        src={road} 
                        alt="road" 
                        className="absolute bottom-0 left-0 w-full h-auto object-cover"
                        style={{ filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)' }}
                    />
                </div>

                {/* 3. IKAN */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] w-full fish-top-anim">
                        <img src={fishGroup} alt="fish top" className="w-24 md:w-48 transform scale-x-[-1]" />
                    </div>
                    <div className="absolute bottom-[20%] w-full fish-bottom-anim">
                        <img src={fishGroup} alt="fish bottom" className="w-32 md:w-56" />
                    </div>
                </div>

                {/* 4. FORM CHANGE PASSWORD */}
                <div 
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                    style={getFormStyle()}
                >
                    <div className="text-center mb-6">
                        <h1 className="text-4xl md:text-5xl mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wide">
                            Change The Password
                        </h1>
                        <p className="text-sm md:text-lg text-gray-200 opacity-90 tracking-wider drop-shadow-md font-caudex">
                            After you changed don't forget the password
                        </p>
                    </div>

                    <div className="w-full max-w-[450px] px-8 space-y-6">
                        <div className="group">
                            <label className="block text-lg mb-1 ml-1 drop-shadow-md text-gray-100">Old Password</label>
                            <input 
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full h-12 bg-gray-300 text-gray-800 rounded-md px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder-gray-500"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-lg mb-1 ml-1 drop-shadow-md text-gray-100">New Password</label>
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-12 bg-gray-300 text-gray-800 rounded-md px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder-gray-500"
                            />
                        </div>

                        <div className="flex justify-center mt-8">
                            <button 
                                onClick={handleChangeClick}
                                className="relative w-64 h-16 flex items-center justify-center group active:scale-95 transition-transform">
                                <img 
                                    src={buttonImg} 
                                    alt="change button" 
                                    className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-lg" 
                                    style={{ filter: 'brightness(0.9) hue-rotate(10deg) saturate(1.2)' }}
                                />
                                <span className="relative z-10 text-white text-3xl font-caudex tracking-widest pb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                    Change
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 5. RUMPUT LAUT */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                     <img 
                        src={seaweed} 
                        alt="seaweed left" 
                        className="absolute bottom-0 left-0 w-[240px] md:w-[340px] filter brightness-90 -translate-x-30 translate-y-5 origin-bottom rotate-30"
                     />
                     <img 
                        src={seaweed} 
                        alt="seaweed right" 
                        className="absolute bottom-0 right-0 w-[240px] md:w-[340px] filter brightness-90 transform scale-x-[-1] translate-x-30 translate-y-5 origin-bottom -rotate-30" 
                     />
                </div>
                {/* 6. KONFIRMASI PASSWORD */}
                <ConfirmationModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmChange}
                />

                {/* 4. NOTIF BERHASIL */}
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                />       

                {/* 7. NAVIGASI & SIDEBAR*/}
                <div className={`absolute top-6 left-6 z-50 transition-all duration-700 ${!inputLocked ? 'opacity-100' : 'opacity-0 -translate-x-10'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-50 transition-all duration-700 ${!inputLocked ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
                    <ButtonHome onClick={() => router.visit('/dashboard')} />
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div
                    className="fixed inset-0 z-60 pointer-events-none bg-[#0a2a4a] transition-opacity duration-1000"
                    style={{ opacity: isLoggingOut ? 1 : 0 }}
                />
            </div>
        </>
    );
}