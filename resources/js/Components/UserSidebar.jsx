import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

import ButtonProfile from '@assets/buttons/07-Profile.png';
import ButtonPassword from '@assets/buttons/08-ChangePass.png';
import ButtonAssistants from '@assets/buttons/09-Assistants.png';
import ButtonLine from '@assets/buttons/10-OALine.png';
import ButtonAnnouncement from '@assets/buttons/11-Announcement.png';
import ButtonShift from '@assets/buttons/12-Shift.png';
import ButtonCoreUnlocked from '@assets/buttons/Cores.png';
import ButtonCoreLocked from '@assets/buttons/06-Cores.png';
import ButtonLogout from '@assets/buttons/13-LogOut.png';

export default function UserSidebar({ isOpen, onClose, onLogout }) {
    const [coreUnlocked, setCoreUnlocked] = useState(true);
    const [wiggle, setWiggle] = useState(false);
    const [coreClickCount, setCoreClickCount] = useState(0);
    const clickTimer = useRef(null);

    const buttonWrapper =
        "relative transition-transform duration-300 hover:scale-110 active:scale-95";

    const imageStyle =
        "w-100 h-auto drop-shadow-[0_0_16px_rgba(96,165,250,0.6)] hover:drop-shadow-[0_0_28px_rgba(96,165,250,0.9)]";

    const handleCoreClick = () => {
        if (!coreUnlocked) {
            setWiggle(true);
            setTimeout(() => setWiggle(false), 300);

            setCoreClickCount(prev => {
                const newCount = prev + 1;
                if (clickTimer.current) clearTimeout(clickTimer.current);
                clickTimer.current = setTimeout(() => setCoreClickCount(0), 2000);
                if (newCount >= 3) {
                    router.visit('/user'); 
                }
                return newCount;
            });
        } else {
            router.visit('/user/cores')
        }
    };

    const handleLogoutClick = () => {
        if (onLogout) onLogout();
    };

    const style = `
        @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
        }
        .animate-wiggle {
            animation: wiggle 0.3s ease;
        }
    `;

    return (
        <>
            <style>{style}</style>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/10 backdrop-blur-xs transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } z-40`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 left-0 h-screen w-90 bg-gray-900/70 backdrop-blur-md text-white shadow-xl transform transition-transform duration-300 z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-full overflow-y-auto flex">
                    <div className="flex flex-col gap-12 m-auto min-h-0 p-10">

                        {/* Profile / Password */}
                        <div className="flex flex-col gap-2">
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/profile')}}>
                                <img src={ButtonProfile} className={imageStyle} alt="Profile" />
                            </button>
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/password')}}>
                                <img src={ButtonPassword} className={imageStyle} alt="Password" />
                            </button>
                        </div>

                        {/* Assistants / Line */}
                        <div className="flex flex-col gap-2">
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/assistants')}}>
                                <img src={ButtonAssistants} className={imageStyle} alt="Assistants" />
                            </button>
                            <button type="button" className={buttonWrapper}>
                                <img src={ButtonLine} className={imageStyle} alt="Line" />
                            </button>
                        </div>

                        {/* Announcement / Shift / Core */}
                        <div className="flex flex-col gap-2">
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/announcement')}}>
                                <img src={ButtonAnnouncement} className={imageStyle} alt="Announcement" />
                            </button>
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/shift')}}>
                                <img src={ButtonShift} className={imageStyle} alt="Shift" />
                            </button>
                            <button
                                type="button"
                                className={`${buttonWrapper} ${wiggle ? 'animate-wiggle' : ''}`}
                                onClick={handleCoreClick}
                            >
                                <img
                                    src={coreUnlocked ? ButtonCoreUnlocked : ButtonCoreLocked}
                                    className={imageStyle}
                                    alt="Core"
                                />
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="flex flex-col gap-0">
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={handleLogoutClick}
                            >
                                <img src={ButtonLogout} className={imageStyle} alt="Logout" />
                            </button>
                        </div>

                    </div>
                </div>
            </aside>
        </>
    );
}