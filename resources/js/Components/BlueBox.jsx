import React from 'react';
import PCboard from '@assets/backgrounds/01-ABoard_PC.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';
import btnCloseXImg from '@assets/buttons/07-Button.png';

export default function BlueModalWrapper({ isOpen, onClose, children, className = "" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-[85vw] aspect-[3/4] sm:w-auto sm:h-[85vh] sm:aspect-[4/3] max-w-[1000px] flex flex-col items-center justify-center animate-popup">
                
                {/* 1. BACKGROUND FRAME */}
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

                {/* 2. TOMBOL CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-[15%] right-[18%] sm:top-[27%] sm:right-[18%] z-20 w-16 h-16 hover:scale-110 transition-transform active:scale-90"
                >
                    <img 
                        src={btnCloseXImg} 
                        alt="Close" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                </button>

                {/* 3. AREA KONTEN DINAMIS */}
                <div className={`absolute px-10 sm:px-0 sm:top-[30%] sm:bottom-[25%] sm:left-[18%] sm:right-[18%] z-10 overflow-hidden ${className}`}>
                    {children}
                </div>

            </div>
        </div>
    );
}