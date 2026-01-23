import React, { useRef, useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import oceanBg from '@assets/backgrounds/ocean.png';
import cave01 from '@assets/backgrounds/cave_01.png';
import cave02 from '@assets/backgrounds/cave_02.png';
import cave03 from '@assets/backgrounds/cave_03.png';
import cave04 from '@assets/backgrounds/cave_04.png';
import daskomLogo from '@assets/logo/01-DaskomBnW.png';
import dlorLogo from '@assets/logo/02-DLOR_Plain.png';
import scrollButton from '@assets/buttons/09-Button.png';
import utamaBg from '@assets/backgrounds/utama.png';
import fish01 from '@assets/others/01-Fish.png';
import fish02 from '@assets/others/02-Fish.png';
import trialImg from '@assets/backgrounds/trial.png';
import doorImg from '@assets/backgrounds/door2.png';
import startSign from '@assets/buttons/ButtonRegular.png';
import roadImg from '@assets/backgrounds/road.png';

import UnderwaterEffect from '@components/UnderwaterEffect';

export default function Welcome() {
    const parallax = useRef(null);
    const [isShaking, setIsShaking] = useState(false);
    const [fallingRocks, setFallingRocks] = useState([]);

    const [showIntro, setShowIntro] = useState(true);
    const [isLockedIn, setLockedIn] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);

    useEffect(() => {
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
        }, 100); 

        const fadeTimer = setTimeout(() => {
            setShowIntro(false);
        }, 2500);

        const unlockTimer = setTimeout(() => {
            setInputLocked(false);
        }, 3500); 

        const skipIntro = () => {
            clearTimeout(zoomTimer);
            clearTimeout(fadeTimer);
            clearTimeout(unlockTimer);
            setIsZooming(false);
            setShowIntro(false);
            setInputLocked(false);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') skipIntro();
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(zoomTimer);
            clearTimeout(fadeTimer);
            clearTimeout(unlockTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    const handleScrollDown = () => {
        setIsShaking(true);

        // --- GENERATE ROCKS ---
        const newRocks = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 90 + 5, 
            size: Math.random() * 15 + 8, 
            duration: Math.random() * 2 + 2, 
            delay: Math.random() * 0.5, 
            sway: Math.random() > 0.5 ? 1 : -1 
        }));
        setFallingRocks(newRocks);

        setTimeout(() => {
            if (parallax.current) {
                parallax.current.scrollTo(2);
            }
            setIsShaking(false);
        }, 1200);

        setTimeout(() => {
            setFallingRocks([]);
        }, 4500);
    };

    const handleLockedIn = () => {
        setLockedIn(true);
        setTimeout(() => {
            router.visit('login');
        }, 500); 
    };

    const styles = `
        /* Desktop Animation */
        @keyframes rumble {
            0% { transform: translate(0, 0) rotate(0deg); filter: blur(0px); }
            10% { transform: translate(-4px, -4px) rotate(-1deg); }
            20% { transform: translate(4px, 4px) rotate(1deg); filter: blur(1px); }
            30% { transform: translate(-6px, 2px) rotate(0deg); }
            40% { transform: translate(6px, -2px) rotate(1deg); }
            50% { transform: translate(-4px, 4px) rotate(-1deg); filter: blur(1px); }
            60% { transform: translate(4px, -4px) rotate(0deg); }
            70% { transform: translate(-2px, -6px) rotate(1deg); }
            80% { transform: translate(2px, 6px) rotate(-1deg); }
            90% { transform: translate(-1px, 0) rotate(0deg); }
            100% { transform: translate(0, 0) rotate(0deg); filter: blur(0px); }
        }

        /* Mobile Animation */
        @keyframes rumbleMobile {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-2px, 1px); }
            40% { transform: translate(2px, -1px); }
            60% { transform: translate(-1px, 2px); }
            80% { transform: translate(1px, -2px); }
            100% { transform: translate(0, 0); }
        }

        /* The Rock */
        @keyframes fallAndSway {
            0% { 
                top: -10%; 
                opacity: 0; 
                transform: translateX(0) rotate(0deg); 
            }
            10% {
                opacity: 1;
            }
            100% { 
                top: 120%; 
                opacity: 0; 
                transform: translateX(var(--drift-x)) rotate(var(--rot-end)); 
            }
        }

        .rock {
            position: absolute;
            background-color: #0f172a; /* Darker navy/black to match deep ocean */
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.6);
            animation: fallAndSway linear forwards;
            pointer-events: none;
            /* No Z-index here, controlled by parent ParallaxLayer */
        }

        .rumble-effect {
            animation: rumble 0.4s infinite linear;
            transform-origin: center center;
            will-change: transform, filter;
        }

        @media (max-width: 768px) {
            .rumble-effect {
                animation-name: rumbleMobile; 
                animation-duration: 0.5s; 
                filter: none !important; 
            }
        }
        
        @keyframes swimLeftTop {
            0% { left: -15%; top: 180%; opacity: 0; transform: rotate(0deg); } 
            15% { left: 22%; top: 160%; opacity: 1; transform: rotate(0deg); } 
            30% { top: 155%; transform: rotate(-5deg); }
            50% { top: 165%; transform: rotate(5deg); }
            70% { top: 155%; transform: rotate(-5deg); }
            90% { left: 22%; top: 160%; opacity: 0; transform: scale(0.9); } 
            100% { left: -15%; opacity: 0; } 
        }

        @keyframes swimLeftBottom {
            0% { left: -15%; top: 160%; opacity: 0; transform: rotate(-15deg); }
            15% { left: 18%; top: 135%; opacity: 1; transform: rotate(-15deg); }
            35% { top: 140%; transform: rotate(-10deg); }
            55% { top: 130%; transform: rotate(-20deg); }
            75% { top: 140%; transform: rotate(-10deg); }
            90% { left: 18%; opacity: 0; transform: scale(0.9) rotate(-15deg); }
            100% { left: -15%; opacity: 0; }
        }

        @keyframes swimRightTop {
            0% { right: -15%; top: 180%; opacity: 0; transform: scaleX(-1) rotate(0deg); }
            15% { right: 25%; top: 160%; opacity: 1; transform: scaleX(-1) rotate(0deg); }
            30% { top: 165%; transform: scaleX(-1) rotate(5deg); }
            50% { top: 155%; transform: scaleX(-1) rotate(-5deg); }
            70% { top: 165%; transform: scaleX(-1) rotate(5deg); }
            90% { right: 25%; opacity: 0; transform: scaleX(-1) scale(0.9); }
            100% { right: -15%; opacity: 0; }
        }

        @keyframes swimRightBottom {
            0% { right: -15%; top: 160%; opacity: 0; transform: scaleX(-1) rotate(-15deg); }
            15% { right: 18%; top: 135%; opacity: 1; transform: scaleX(-1) rotate(-15deg); }
            35% { top: 130%; transform: scaleX(-1) rotate(-5deg); }
            55% { top: 140%; transform: scaleX(-1) rotate(-20deg); }
            75% { top: 130%; transform: scaleX(-1) rotate(-5deg); }
            90% { right: 18%; opacity: 0; transform: scaleX(-1) scale(0.9) rotate(-15deg); }
            100% { right: -15%; opacity: 0; }
        }
        
        .fish-lt { animation: swimLeftTop 12s ease-in-out infinite; animation-delay: 0s; position: absolute; }
        .fish-lb { animation: swimLeftBottom 14s ease-in-out infinite; animation-delay: 1s; position: absolute; }
        .fish-rt { animation: swimRightTop 12s ease-in-out infinite; animation-delay: 0.5s; position: absolute; }
        .fish-rb { animation: swimRightBottom 14s ease-in-out infinite; animation-delay: 1.5s; position: absolute; }
        
        .cold-blue-filter {
            filter: brightness(1) contrast(.95) saturate(1.2) hue-rotate(5deg);
        }
    `;

    return (
        <>
            <Head title="Atlantis" />
            <style>{styles}</style>

            {/* --- Splash Screen --- */}
            <div 
                className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-[1000ms] ease-in-out bg-[#0C365B] ${showIntro ? 'opacity-100' : 'opacity-0'}`}
            >
                <UnderwaterEffect />
                <div className="relative w-full h-full overflow-hidden">
                    <img 
                        src={utamaBg} 
                        className={`
                            absolute inset-0 w-full h-full object-cover 
                            transition-transform duration-[2500ms] ease-out
                            cold-blue-filter
                            ${isZooming ? 'scale-[1.3]' : 'scale-100'} 
                        `}
                        alt="Intro Background"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0C365B]/80" />
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                         <img 
                            src={dlorLogo}
                            alt="Intro Logo"
                            className="w-200 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                         />
                    </div>
                </div>
            </div>

            {/* The actual contents */}
            <div className={`w-full h-auto m-0 p-0 ${inputLocked ? 'pointer-events-none' : ''}`}>
                <UnderwaterEffect />

                <Parallax ref={parallax} pages={3} style={{ top: '0', left: '0', backgroundColor: '#0C365B' }}>
                      
                    {/* Background Layer (Ocean + Falling Rocks) */}
                    <ParallaxLayer
                        offset={0}
                        speed={0}
                        factor={1.5}
                        style={{
                            backgroundImage: `url(${oceanBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                        className="scale-125 cold-blue-filter relative"
                    >
                         {fallingRocks.map((rock) => (
                            <div
                                key={rock.id}
                                className="rock"
                                style={{
                                    left: rock.left + '%',
                                    width: rock.size + 'px',
                                    height: rock.size + 'px',
                                    animationDuration: rock.duration + 's',
                                    animationDelay: rock.delay + 's',
                                    '--drift-x': (rock.sway * 50) + 'px', 
                                    '--rot-end': (rock.sway * 180) + 'deg' 
                                }}
                            />
                        ))}
                    </ParallaxLayer>

                    {/* Cave (Foreground) */}
                    <ParallaxLayer offset={0} speed={0} factor={2.1} className="pointer-events-none z-50">
                        <div className={`w-full h-full flex items-center justify-center ${isShaking ? "rumble-effect" : ""}`}>
                            <div 
                                className="relative w-full h-full"
                                style={{ 
                                    transform: 'scale(1.05)',
                                    transformOrigin: 'center center' 
                                }}
                            >
                                <img src={cave01} className="absolute top-0 left-0 w-[50.2%] h-[50.2%] object-fill" />
                                <img src={cave02} className="absolute top-0 right-0 w-[50.2%] h-[50.2%] object-fill" />
                                <img src={cave03} className="absolute bottom-0 left-0 w-[50.2%] h-[50.2%] object-fill" />
                                <img src={cave04} className="absolute bottom-0 right-0 w-[50.2%] h-[50.2%] object-fill" />
                            </div>
                        </div>
                    </ParallaxLayer>

                    {/* Contents */}
                    <ParallaxLayer offset={0} speed={0} className="flex items-center justify-center z-[100]">
                        <div className={`flex flex-col items-center text-center text-white max-w-2xl px-14 sm:px-5 mt-20 font-['Caudex'] transition-all duration-1000 delay-500 ${showIntro ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                                
                            <div className="mb-8 flex justify-center items-center gap-2">
                                <img src={daskomLogo} alt="Logo Daskom" className="w-24 md:w-32 h-auto" />
                                <img src={dlorLogo} alt="Logo DLOR" className="w-32 md:w-48 h-auto" />
                            </div>

                            <div className="text-xl md:text-2xl sm:text-3xl leading-relaxed text-left drop-shadow-lg">
                                <p className="mb-4">True knowledge, like the lost kingdom, awaits only in the crushing deep.</p>
                                <p className="mb-4">The gates of this Atlantis have opened for those brave enough to endure the pressure.</p>
                                <p className="mb-4">We seek resilient guardians to uphold a legacy time could not erode.</p>
                                <p className="mb-4">Descend into the unknown and forge the future.</p>
                                <p className="text-xl md:text-4xl font-bold mt-6">Are you ready for the adventure?</p>
                            </div>

                            {/* Scroll Button */}
                            <div onClick={handleScrollDown} className="mt-10 animate-bounce cursor-pointer flex">
                                <img src={scrollButton} alt="Scroll Down" className="w-10 md:w-20 h-auto" />
                            </div>
                        </div>
                    </ParallaxLayer>

                    {/* Deep Ocean Background */}
                    <ParallaxLayer offset={1.5} speed={0} factor={3} className="z-10">
                        <div className="relative w-full h-full">
                            <img src={utamaBg} className="w-full h-full object-cover brightness-[0.8] saturate-[1.2]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0C365B] pointer-events-none" />
                        </div>
                    </ParallaxLayer>

                    {/* Le fishe au Chocolat */}
                    <ParallaxLayer offset={1.15} speed={0.1} className="pointer-events-none z-20">
                        <img src={fish01} className="fish-lt w-[12%] brightness-90 sepia hue-rotate-[190deg] saturate-200 contrast-150" />
                        <img src={fish02} className="fish-lb w-[20%] brightness-90 sepia hue-rotate-[190deg] saturate-200 contrast-150" />
                        <img src={fish01} className="fish-rt w-[12%] brightness-90 sepia hue-rotate-[190deg] saturate-200 contrast-150" />
                        <img src={fish02} className="fish-rb w-[20%] brightness-90 sepia hue-rotate-[190deg] saturate-200 contrast-150" />
                    </ParallaxLayer>

                    {/* The Door */}
                    <ParallaxLayer 
                        offset={1.15} 
                        speed={0.1} 
                        factor={2} 
                        className="z-10 flex flex-col items-center justify-end pb-10"
                    >
                        <img 
                            src={trialImg} 
                            alt="rocks" 
                            className="w-auto h-auto min-w-[1200px] max-w-[2000px] absolute bottom-1 left-1/2 -translate-x-1/2"
                            style={{ filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)' }}
                        />
                        <img 
                            src={doorImg} 
                            alt="door" 
                            className="w-auto h-auto min-w-[1200px] max-w-[2000px] absolute bottom-1 left-1/2 -translate-x-1/2"
                            style={{ filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)' }}
                        />
                        <img 
                            src={roadImg} 
                            alt="road" 
                            className="w-auto h-auto min-w-[1200px] max-w-[2000px] absolute bottom-1 left-1/2 -translate-x-1/2"
                            style={{ filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)' }}
                        />

                        {/* Dive in! */}
                        <button 
                            onClick={handleLockedIn}
                            disabled={isLockedIn}
                            className={`
                                relative mb-118
                                transition-all duration-1000 ease-in-out
                                ${isLockedIn ? 'opacity-0 scale-140 blur-sm' : 'opacity-100 hover:scale-110'}
                            `}
                        >
                            <img 
                                src={startSign} 
                                alt="Start" 
                                className="w-100 h-auto drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light" 
                            />
                            <span 
                                className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold tracking-[2px]" 
                                style={{ 
                                    color: '#e0f2fe', 
                                    textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                }}>
                                START
                            </span>
                        </button>

                        <div className="absolute top-[85%] text-center font-['Caudex'] text-white text-xl tracking-wider">
                            @Atlantis.DLOR2026. All Right Served
                        </div>

                    </ParallaxLayer>
                </Parallax>
            </div>
        </>
    );
}