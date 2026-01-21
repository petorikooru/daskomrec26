import React, { useRef, useState} from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

export default function Welcome() {
    const parallax = useRef(null);
    const [isShaking, setIsShaking] = useState(false); 

    const handleScrollDown = () => {
        setIsShaking(true);           
       setTimeout(() => {
           if (parallax.current) {
                parallax.current.scrollTo(2); 
            }
            setIsShaking(false);
        }, 1200);
    };


    const styles = `
   @keyframes rumble {
      0% { transform: translate(0, 0) scale(1.02); }
      10% { transform: translate(-1px, -1px) scale(1.02); }
      20% { transform: translate(1px, 1px) scale(1.02); }
      30% { transform: translate(-2px, 1px) scale(1.02); }
      40% { transform: translate(2px, -1px) scale(1.02); }
      50% { transform: translate(-1px, 2px) scale(1.02); }
      60% { transform: translate(1px, -2px) scale(1.02); }
      70% { transform: translate(-2px, -1px) scale(1.02); }
      80% { transform: translate(2px, 1px) scale(1.02); }
      90% { transform: translate(-1px, 0) scale(1.02); }
      100% { transform: translate(0, 0) scale(1.02); }
    }
      .rumble-effect {
        animation: rumble 0.3s infinite linear;
        transform-origin: center center;
    }
 @keyframes swimLeftTop {
    /* Ikan bawah kiri */
      0% { left: -15%; top: 180%; opacity: 0; }
      100% { left: 22%; top: 160%; opacity: 1; }
    }
    /* Ikan atas kiri */
    @keyframes swimLeftBottom {
      0% { left: -15%; top: 160%; opacity: 0; }
      100% { left: 15%; top: 135%; opacity: 1; }
    }
    /* Ikan bawah kanan*/
    @keyframes swimRightTop {
      0% { right: -15%; top: 180%; opacity: 0; }
      100% { right: 22%; top: 160%; opacity: 1; }
    }
    /* Ikan atas kanan */
    @keyframes swimRightBottom {
      0% { right: -15%; top: 160%; opacity: 0; }
      100% { right: 15%; top: 135%; opacity: 1; }
    }

    /* Class untuk menerapkan animasi ikan */
    .fish-lt {
        position: absolute;
        animation: swimLeftTop 8s ease-out forwards;
        animation-delay: 0.5s;
        transform: rotate(0deg);
    }
    .fish-lb { 
        position: absolute;
        animation: swimLeftBottom 9s ease-out forwards;
        animation-delay: 1s;
        transform: rotate(-15deg);
    }
    .fish-rt {
        position: absolute;
        animation: swimRightTop 8s ease-out forwards;
        animation-delay: 0.2s;
        transform: scaleX(-1) rotate(0deg);
    }
    .fish-rb { 
        position: absolute;
        animation: swimRightBottom 9s ease-out forwards;
        animation-delay: 1.2s;
        transform: scaleX(-1) rotate(-15deg);
    }
    .fish-filter {
     filter: brightness(0.9) sepia(1) hue-rotate(190deg) saturate(2) contrast(1.5)}
    }

    @keyframes fadeInSlow {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in-start {
        opacity: 0;
        animation: fadeInSlow 2s ease-out forwards;
        animation-delay: 1.8s; 
  `;
    return (
        <>
            <Head title="Atlantis" />
            <style>{styles}</style>

            <div style={{ width: '100%', height: 'auto', margin: 0, padding: 0 }}>

                <Parallax ref={parallax} pages={3} style={{ top: '0', left: '0', backgroundColor: '#0C365B' }}>
                    {/* SECTION 1 */}
                    <ParallaxLayer
                        offset={0}
                        speed={0}
                        factor={1.5}
                        style={{
                            backgroundImage: "url('/assets/backgrounds/ocean.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundWidth: '100%',
                            zIndex: 0,
                            transform: 'scale(1.2)'
                        }}
                    />

                    <ParallaxLayer
                        offset={0}
                        speed={0}
                        factor={2.1}
                        style={{
                            pointerEvents: 'none',
                            zIndex: 50,
                        }}
                    >
                        <div 
                            className={isShaking ? "rumble-effect" : ""}
                            style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: '100%',
                            }}
                        >
                            <img src="/assets/backgrounds/cave_01.png" style={{ position: 'absolute', top: 0 , left: 0 ,width: '50.1%', height: '50.1%' ,objectFit: 'fill'}}/>
                            <img src="/assets/backgrounds/cave_02.png" style={{ position: 'absolute',top: 0,right: 0,width: '50.1%', height: '50.1%',objectFit: 'fill'}}/>
                            <img src="/assets/backgrounds/cave_03.png" style={{ position: 'absolute',bottom: 0, left: 0,width: '50.1%',height: '50.1%',objectFit: 'fill'}}/>
                            <img src="/assets/backgrounds/cave_04.png" style={{position: 'absolute',bottom: 0,right: 0,width: '50.1%',height: '50.1%',objectFit: 'fill'}}/>
                            </div>
                    </ParallaxLayer>

                    <ParallaxLayer
                        offset={0}
                        speed={0}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: 'white',
                            maxWidth: '650px',
                            padding: '0 20px',
                            fontFamily: 'Caudex',
                            marginTop: '320px',
                        }}
                        >
                            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0px' }}>
                                <img src="/assets/logo/01-DaskomBnW.png" alt="Logo Daskom" style={{ width: '20%', height: 'auto' }} />
                                <img src="/assets/logo/02-DLOR_Plain.png" alt="Logo DLOR" style={{ width: '20%', height: 'auto' }} />
                            </div>

                            <div style={{ fontSize: '30px', lineHeight: '1.6', textShadow: '0 2px 10px rgba(0,0,0,0.5)', textAlign: 'left', }}>
                                <p style={{ marginBottom: '15px' }}>True knowledge, like the lost kingdom,<br />awaits only in the crushing deep.</p>
                                <p style={{ marginBottom: '15px' }}>The gates of this Atlantis have opened for<br />those brave enough to endure the pressure.</p>
                                <p style={{ marginBottom: '15px' }}>We seek resilient guardians to uphold a<br />legacy time could not erode.</p>
                                <p style={{ marginBottom: '15px' }}>Descend into the unknown and forge the<br />future.</p>
                                <p style={{ fontSize: '30px' }}>Are you ready for the adventure?</p>
                            </div>

                            <div
                              onClick={handleScrollDown}
                                style={{
                                    marginTop: '40px',
                                    animation: 'bounce 2s infinite',
                                    display: 'flex',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src="/assets/buttons/09-Button.png"
                                    alt="Scroll Down Button"
                                    style={{ width: '50px', height: 'auto' }}
                                />
                            </div>

                        </div>
                    </ParallaxLayer>

                    {/* SECTION 2 */}
                    <ParallaxLayer 
                      offset={1.5} 
                      speed={0} 
                      factor={2} 
                      style={{ 
                        zIndex: 1 
                    }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img 
                            src="/assets/backgrounds/utama.png" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                filter: 'brightness(0.8) saturate(1.2)'
                            }} 
                        />
                        <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to bottom, transparent 30%, #0C365B 100%)',
                                pointerEvents: 'none' 
                            }} />
                        </div>
                    </ParallaxLayer>
                    
                    {/* LAYER IKAN */}
                   <ParallaxLayer 
                      offset={1.15} 
                      speed={0.1} 
                      style={{ 
                        pointerEvents: 'none', 
                        zIndex:10
                        }}>
                      <img src="/assets/others/01-Fish.png" className="fish-lt fish-filter" style={{ width: '12%' }}/>
                      <img src="/assets/others/02-Fish.png" className="fish-lb fish-filter" style={{ width: '20%' }} />  
                      <img src="/assets/others/01-Fish.png" className="fish-rt fish-filter" style={{ width: '12%' }} />
                      <img src="/assets/others/02-Fish.png" className="fish-rb fish-filter" style={{ width: '20%' }} />

                    </ParallaxLayer>

                    <ParallaxLayer
                        offset={1.15}
                        speed={0.1}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            paddingTop: '25%',
                            zIndex: 3
                        }}
                    >
                        <img
                            src="/assets/backgrounds/trial.png"
                            alt="trial"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </ParallaxLayer>

                    <ParallaxLayer
                        offset={1.15}
                        speed={0.1}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            paddingTop: '20%',
                            zIndex: 3
                        }}
                    >
                        <img
                            src="/assets/backgrounds/door2.png"
                            alt="door"
                            style={{
                                width: '100%',
                                height: 'auto',
                                marginTop: '10%',
                                filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)'
                            }}
                        />
                    </ParallaxLayer>

                    <ParallaxLayer
                        offset={1.15}
                        speed={0.1}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: '5vh',
                            zIndex: 50,
                            pointerEvents: 'none'
                        }}
                    >
                        <Link href="/login">
                            <div
                                style={{
                                    marginBottom: '5vh',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    position: 'relative',
                                    pointerEvents: 'auto',
                                    width: 'clamp(200px, 30vw, 400px)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img
                                    src="/assets/buttons/04-Sign.png"
                                    alt="Start"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))',
                                        display: 'block',
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -60%)',
                                    fontFamily: 'Caudex',
                                    fontSize: 'clamp(24px. 4vw, 45px)',
                                    fontWeight: 'semibold',
                                    color: '#ffffff',
                                    letterSpacing: '2px',
                                    pointerEvents: 'none',
                                    textShadow: '0 0 10px rgba(0,255,255,0.8)'
                                }}>
                                    START
                                </span>
                            </div>
                        </Link>

                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Caudex',
                            color: 'white',
                            fontSize: 'clamp(12px, 2vw, 20px)',
                            letterSpacing: '1px',
                            pointerEvents: 'none',
                        }}>
                            @Atlantis.DLOR2026. All Right Served
                        </div>

                    </ParallaxLayer>

                    <ParallaxLayer
                        offset={1.15}
                        speed={0.1}
                        factor={2}
                        style={{
                            zIndex: 3,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src="/assets/backgrounds/road.png"
                            alt="rocks"
                            style={{
                                width: '100%',
                                minWidth: '800px',
                                height: 'auto',
                                position: 'absolute',
                                bottom: '5vh',
                                filter: 'sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)'
                            }}

                        />
                    </ParallaxLayer>

                </Parallax>
            </div>
        </>
    )
}