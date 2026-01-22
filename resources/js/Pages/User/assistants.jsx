import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import AssistantBook from '@components/AssistantBook';
import BookControls from '@components/BookControls';

import background from '@assets/backgrounds/AssistantBackground.png';

export default function Assistants() {
    const backgroundRef = useRef(null);
    const bookControlRef = useRef(null); 

    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isBookPlacing, setIsBookPlacing] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const totalIndices = 89 + 2; 
    
    const [bookDim, setBookDim] = useState({ width: 300, height: 450 });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            
            if (w < 480) {
                setBookDim({ width: 260, height: 390 });
            } 
            else if (w < 768) {
                setBookDim({ width: 320, height: 480 });
            } 
            else if (w < 1280) {
                setBookDim({ width: 380, height: 570 });
            } 
            else {
                setBookDim({ width: 420, height: 630 });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        
        const placeBookTimer = setTimeout(() => {
            setIsBookPlacing(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(placeBookTimer);
            setShowImage(true);
            setIsBookPlacing(false);
            setInputLocked(false);
        };

        const handleKeyDown = e => e.key === 'Escape' && skipIntro();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(placeBookTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    const goHome = () => {
        if (inputLocked || isLoggingOut) return;
        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit('/user/home'), 1000);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000);
        }, 350);
    };

    // Book Control
    const handlePrev = () => bookControlRef.current?.flipPrev();
    const handleNext = () => bookControlRef.current?.flipNext();
    
    const handleGoToPage = (val) => {
        let p = parseInt(val);
        if (isNaN(p)) p = 0;
        if (p < 0) p = 0;
        if (p >= totalIndices) p = totalIndices - 1;
        bookControlRef.current?.flip(p);
    };

    const onBookFlip = (index) => {
        setPageIndex(index);
    };

    const styles = `
        /* Background Filter */
        .cold-blue-filter {
            filter:
                brightness(1.1)
                contrast(1.2)
                saturate(1)
                hue-rotate(15deg)
                sepia(0);
        }

        /* Book Filter */
        .book-filter {
            filter:
                brightness(1)
                contrast(1)
                saturate(1.2)
                hue-rotate(0deg)
                sepia(0);
        }
    `;

    const getBackgroundStyle = () => {
        let scale = 1.1;
        let blur = showImage && imageLoaded ? 0 : 10;
        if (isExiting) { scale = 1; blur = 15; }
        return {
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            transformOrigin: 'center',
            transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
            objectPosition: 'center 10%',
        };
    };

    const getBookStyle = () => {
        let scale = 1;
        let translateY = 0;
        let opacity = 1;

        if (isBookPlacing) {
            scale = 1.5;
            translateY = 100;
            opacity = 0;
        }

        if (isExiting) {
            scale = 0.9;
            opacity = 0;
        }

        return {
            transform: `scale(${scale}) translateY(${translateY}px)`,
            opacity,
            transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease-in-out',
        };
    };

    return (
        <>
            <Head title="Assistants" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">

                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }} />
                <div className="absolute inset-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={background}
                        alt="background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ background: 'rgba(2, 99, 196, 0.2)' }} />
                <UnderwaterEffect isLoaded={showImage && imageLoaded} isZooming={false} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000" style={{ opacity: showImage && imageLoaded ? 1 : 0 }} />


                {/* The Book */}
                <div 
                    className={`absolute top-22 md:top-6 z-60 text-center font-extrabold transition-all duration-700
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
                    style={{ fontFamily: 'Cormorant Infant, serif' }}
                >
                    <h1 
                        className="text-4xl md:text-4xl text-white leading-tight"
                    >
                        Daskom Laboratory
                    </h1>
                    <h1 className="text-6xl text-white leading-tight">
                        Assistants 2026
                    </h1>
                </div>
                <div 
                    className="absolute z-50 transition-all duration-1000 book-filter"
                    style={getBookStyle()}
                >
                    <AssistantBook 
                        ref={bookControlRef} 
                        onPageChange={onBookFlip}
                        width={bookDim.width}
                        height={bookDim.height}
                    />
                </div>

                <BookControls 
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-60 transition-all duration-700
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onGoToPage={handleGoToPage}
                    currentPage={pageIndex}
                    totalPages={totalIndices - 1} 
                />

                <div className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-60 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                    <ButtonHome onClick={goHome} />
                </div>

                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                <div className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: isLoggingOut ? 1 : 0 }} />
                
                {inputLocked && <div className="fixed inset-0 z-80 pointer-events-auto" />}
            </div>
        </>
    );
}