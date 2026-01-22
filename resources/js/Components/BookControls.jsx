import React, { useState, useEffect } from 'react';

// Make sure these paths match your project structure
import ButtonLeft from '@assets/buttons/ButtonLeft.png';
import ButtonRight from '@assets/buttons/ButtonRight.png';

// === REUSABLE BUTTON COMPONENT ===
const ControlButton = ({ onClick, disabled, src, alt }) => {
    const [pressed, setPressed] = useState(false);

    return (
        <button
            onMouseDown={() => !disabled && setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            // Touch events for mobile responsiveness
            onTouchStart={() => !disabled && setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative focus:outline-none 
                flex items-center justify-center
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <img 
                src={src} 
                alt={alt}
                className={`
                    h-16 md:h-22 w-auto 
                    object-contain transition-all duration-100 ease-out
                    ${pressed ? 'scale-90 brightness-110' : 'scale-100 hover:brightness-105'}
                `}
                style={{
                    filter: pressed && !disabled
                        ? 'drop-shadow(0 0 14px rgba(0,180,255,.9))'
                        : 'drop-shadow(0 0 5px rgba(0,120,200,0))', 
                }}
            />
        </button>
    );
};

// === MAIN CONTROLS COMPONENT ===
export default function BookControls({ 
    onPrev, 
    onNext, 
    onGoToPage, 
    currentPage, 
    totalPages,
    className = ''
}) {
    const [inputVal, setInputVal] = useState(currentPage);

    useEffect(() => {
        setInputVal(currentPage);
    }, [currentPage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onGoToPage(inputVal);
            e.target.blur();
        }
    };

    return (
        <div 
            className={`flex items-center gap-2 md:gap-6 p-2 md:p-3 px-4 md:px-6 rounded-full ${className}`}
            style={{ fontFamily: 'Cormorant Infant, serif' }}
            onPointerDown={(e) => e.stopPropagation()} 
        >
            <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
            `}</style>

            {/* PREV BUTTON */}
            <ControlButton 
                onClick={onPrev} 
                disabled={currentPage === 0}
                src={ButtonLeft}
                alt="Previous"
            />

            {/* PAGE INPUT */}
            <div 
                className="flex items-center gap-1 md:gap-2 text-white/90 font-bold tracking-wide text-lg md:text-xl drop-shadow-md"
            >
                <input 
                    type="number" 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-4 bg-transparent text-center text-white focus:outline-none focus:border-white transition-colors"
                />
                <span 
                    className="opacity-50 whitespace-nowrap"
                >/ {totalPages}
                </span>
            </div>

            {/* NEXT BUTTON */}
            <ControlButton 
                onClick={onNext} 
                disabled={currentPage === totalPages}
                src={ButtonRight}
                alt="Next"
            />
        </div>
    );
}