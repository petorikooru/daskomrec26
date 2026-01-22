import React from 'react';
import popupFrameBlue from '@assets/backgrounds/01-Aboard_PC.png';
import btnCloseXImg from '@assets/buttons/07-Button.png';
import logoImg from '@assets/logo/ORB_DLOR 1.png'; 

export default function SuccessModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-[700px] aspect-[4/3] flex flex-col items-center justify-center animate-popup">
                
                {/* 1. BACKGROUND FRAME */}
                <img
                    src={popupFrameBlue}
                    alt="popup frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                />

                {/* 2. TOMBOL CLOSE (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-[25%] right-[17%] z-20 w-16 h-16 hover:scale-110 transition-transform active:scale-90"
                >
                    <img 
                        src={btnCloseXImg} 
                        alt="Close" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                </button>

                {/* 3. AREA KONTEN TENGAH (LAYAR BIRU) */}
                <div className="absolute top-[30%] bottom-[25%] left-[18%] right-[18%] z-10 flex flex-col justify-center items-center text-left">
                    <h2 className="font-caudex text-3xl md:text-4xl text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] leading-snug font-bold px-4">
                        Your password already <br /> changed, don't forget it <br /> again!
                    </h2>

                    {/* 4. LOGO DI POJOK KANAN BAWAH */}
                    <div className="absolute bottom-0 right-3">
                        <img 
                            src={logoImg} 
                            alt="Logo" 
                            className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-md"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}