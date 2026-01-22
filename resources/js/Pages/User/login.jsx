import React, { useRef, useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

import background from '@assets/backgrounds/utama.png';
import road from '@assets/backgrounds/road.png';
import trial from '@assets/backgrounds/trial.png';
import door_closed from '@assets/backgrounds/door2.png';
import door_opened from '@assets/backgrounds/door2_open.png';
import scroll from '@assets/backgrounds/scroll2.png';
import Sign04 from '@assets/buttons/sign1.png';
import BlueInputBox from '@components/BlueInputBox';
import UnderwaterEffect from '@components/UnderwaterEffect';

export default function Login() {
    const trialRef = useRef(null);
    const rafRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const doorRef = useRef(null);
    const roadRef = useRef(null);

    const BASE_OFFSET = { x: 0, y: 430 };
    const OUT_OFFSET = { x: 0, y: 430 };
    const IN_OFFSET = { x: 0, y: 1100 };

    const SCALE = {
        bg: { enter: 1.0, idle: 1.7, out: 1.2 },
        door: { enter: 1.0, idle: 1.7, in: 3.5, out: 1.2 },
        road: { enter: 1.0, idle: 1.7, in: 3.5, out: 1.2 },
        scroll: { enter: 0.6, idle: 1, in: 0.95, out: 0.6 },
    };

    const [isIntro, setIsIntro] = useState(true);
    const [cameraState, setCameraState] = useState('enter'); 
    const [showColorFade, setShowColorFade] = useState(false);
    const [fadeScroll, setFadeScroll] = useState(false);

    const { data, setData, processing } = useForm({ username: '', password: '' });

    const getTransform = (type) => {
        const scale = SCALE[type][cameraState] ?? SCALE[type].idle;
        const offset = cameraState === 'out' ? OUT_OFFSET : (cameraState === 'in' ? IN_OFFSET : BASE_OFFSET);

        return `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;
    };

    // Parallax effect
    const handleMouseMove = (e) => {
        if (rafRef.current || isIntro || cameraState !== 'idle') return;

        rafRef.current = requestAnimationFrame(() => {
            if (!trialRef.current || !roadRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 30;
            const y = (e.clientY / innerHeight - 0.5) * 30;
t
            trialRef.current.style.transform = `translate(${x}px, ${y}px) scale(${SCALE.bg.idle})`;
            roadRef.current.style.transform = `translate(${x}px, ${y}px) scale(${SCALE.road.idle})`;

            rafRef.current = null;
        });
    };

    const handleMouseLeave = () => {
        if (!trialRef.current || !roadRef.current) return;
        trialRef.current.style.transform = getTransform('bg');
        roadRef.current.style.transform = getTransform('road');
    };

    const handleOutsideClick = (e) => {
        if (cameraState !== 'idle' || isIntro) return;
        if (!scrollWrapperRef.current?.contains(e.target)) {
            setCameraState('out');
            setTimeout(() => router.visit('/'), 1200);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cameraState !== 'idle') return;

        setFadeScroll(true);
        setTimeout(() => setCameraState('in'), 500);
        setTimeout(() => setShowColorFade(true), 800);
        setTimeout(() => router.visit('/user/home'), 2000);
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setIsIntro(false);
            setCameraState('idle');
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const commonTransformStyle = { 
        transformOrigin: 'bottom center',
        transition: 'transform 2000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };

    const bgStyle = { ...commonTransformStyle, transform: getTransform('bg') };
    const doorStyle = { ...commonTransformStyle, transform: getTransform('door') };
    const roadStyle = { ...commonTransformStyle, transform: getTransform('road') };

    return (
        <>
            <Head title="Login" />
            <style>{`
                .atlantis-sync {
                     filter: sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9);
                }
                .deep-ocean-bg {
                    filter: brightness(0.8) saturate(1.2) contrast(1.1);
                }
                .cold-blue-filter-scroll { filter: brightness(1.1) contrast(1) saturate(0.2) hue-rotate(220deg) sepia(0.2); }
                
                /* [NEW] Shared placement class to match Welcome.js */
                .bottom-centered-asset {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    /* We use margin-left or transform in JS, but here strictly CSS centering */
                    /* Note: The JS parallax adds 'translate', so we must be careful not to conflict. */
                    /* We will use a wrapper-less approach: relying on the JS 'translate' to include the centering? 
                       No, that's messy. Let's keep the -translate-x-1/2 in CSS and let JS add RELATIVE movement. */
                }
            `}</style>

            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleOutsideClick}
                className="relative w-full min-h-screen overflow-hidden bg-[#0a243b]"
            >
                <UnderwaterEffect/>

                {/* Main BG */}
                <img 
                    src={background} 
                    alt="background" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none deep-ocean-bg" 
                />
                
                {/* --- Atlantis Door --- */}
                <img 
                    ref={roadRef} 
                    src={road} 
                    alt="road" 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-auto min-w-[1200px] max-w-[2000px] z-5 atlantis-sync" 
                    style={roadStyle} 
                />
                
                <img 
                    ref={trialRef} 
                    src={trial} 
                    alt="background" 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-auto min-w-[1200px] max-w-[2000px] z-0 atlantis-sync" 
                    style={bgStyle} 
                />
                
                <img 
                    ref={doorRef} 
                    src={cameraState === 'in' ? door_opened : door_closed} 
                    alt="door" 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-auto min-w-[1200px] max-w-[2000px] z-10 atlantis-sync" 
                    style={doorStyle} 
                />

                {/* Blur & glow overlays */}
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-800/5 via-blue-900/10 to-indigo-900/15 z-25 pointer-events-none mix-blend-screen" />

                {/* Scroll & Form */}
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none" ref={scrollWrapperRef}>
                    <div
                        className="flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
                        style={{
                            transform: `scale(${SCALE.scroll[cameraState] ?? SCALE.scroll.idle})`,
                            opacity: fadeScroll ? 0 : (cameraState === 'enter' || cameraState === 'out' ? 0 : 1),
                            filter: cameraState === 'out' ? 'blur(8px)' : 'blur(0px)',
                            pointerEvents: cameraState === 'idle' ? 'auto' : 'none',
                            width: '520px',
                            maxHeight: '90vh',
                        }}
                    >
                        <img
                            src={scroll}
                            alt="scroll"
                            className="w-auto max-h-full object-contain cold-blue-filter-scroll origin-center scale-125 sm:scale-170 md:scale-190"
                        />  
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-14 sm:px-12 text-[#0b3a66] gap-1 sm:gap-6">
                            <h1 className="font-serif font-extrabold tracking-wide drop-shadow-lg text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 text-center"
                                style={{ 
                                    fontFamily: 'Cormorant Infant', 
                                    color: '#0c365b', 
                                    textShadow: '0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)' }}
                            >
                                Insert The Key
                            </h1>
                            
                            <form onSubmit={handleSubmit} className="w-[80%] sm:w-[90%] max-w-105 flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1">
                                    <label 
                                        className="font-serif font-bold text-xl sm:text-2xl md:text-4xl" 
                                        style={{ 
                                            fontFamily: 'Cormorant Infant', 
                                            color: '#0c365b', 
                                            textShadow: '0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)' 
                                        }}
                                    >
                                        Username
                                    </label>
                                    <BlueInputBox 
                                        value={data.username} 
                                        onChange={(e) => setData('username', e.target.value)} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label 
                                        className="font-serif font-bold text-xl sm:text-2xl md:text-4xl" 
                                        style={{ 
                                            fontFamily: 'Cormorant Infant', 
                                            color: '#0c365b', 
                                            textShadow: '0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)' 
                                        }}
                                    >
                                        Password
                                    </label>
                                    <BlueInputBox 
                                        type="password" 
                                        value={data.password} 
                                        onChange={(e) => setData('password', e.target.value)} 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="mt-4 sm:mt-6 relative self-center transition-transform duration-300 hover:scale-110"
                                >
                                    <img 
                                        src={Sign04} 
                                        alt="Start" 
                                        className="w-45 sm:w-55 h-9 sm:h-13 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light" 
                                    />
                                    <span 
                                        className="absolute inset-0 flex items-center justify-center text-xl sm:text-3xl font-extrabold tracking-[2px]" 
                                        style={{ 
                                            color: '#e0f2fe', 
                                            textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                        }}>
                                        Dive In
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 z-30 pointer-events-none mix-blend-lighten opacity-30">
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-blue-500/5" />
                </div>
                <div 
                    className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ease-in-out" 
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: showColorFade ? 1 : 0 }} 
                />
            </div>
        </>
    );
}