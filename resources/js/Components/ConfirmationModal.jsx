import React from 'react';
import popupFrameBlue from '@assets/backgrounds/01-Aboard_PC.png';
import btnCloseXImg from '@assets/buttons/07-Button.png';
import buttonImg from '@assets/buttons/sign1.png';

export default function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-[700px] aspect-[4/3] flex flex-col items-center justify-center animate-popup">
                
                <img
                    src={popupFrameBlue}
                    alt="popup frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                />

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

                <div className="absolute top-[26%] bottom-[18%] left-[18%] right-[18%] z-10 flex flex-col justify-center items-center text-center space-y-2">
                    
                    <p className="font-caudex text-xs text-white tracking-[0.2em] uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                        Let The Deep Uncover Your Purpose
                    </p>

                    <h2 className="font-caudex text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                        Are you sure to <br /> change the password?
                    </h2>

                <div className="flex gap-6 mt-2">
                    <button
                        onClick={onClose}
                        className="relative flex items-center justify-center h-12 min-w-[180px] px-6 group active:scale-95 transition-transform">
                    <img
                        src={buttonImg}
                        alt="No bg"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none"/>
    
                    <span className="relative z-10 text-white text-xl tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        No
                    </span>
                    </button>

                    <button
                        onClick={onConfirm}
                        className="relative flex items-center justify-center h-12 min-w-[180px] px-6 group active:scale-95 transition-transform">
                    <img
                        src={buttonImg}
                        alt="Yes bg"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none"/>
    
                    <span className="relative z-10 text-white text-xl tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        Yes
                    </span>
                    </button>
                </div>

                </div>
            </div>
        </div>
    );
}