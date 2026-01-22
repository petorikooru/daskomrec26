import React, { useState, useRef, useEffect } from 'react';

// Assets
import Map from '@assets/map/map.png';
import Euprus from '@assets/map/Territory/Euprus.png';
import Northgard from '@assets/map/Territory/Northgard.png';
import Thevia from '@assets/map/Territory/Thevia.png';
import Xurith from '@assets/map/Territory/Xurith.png';

const TERRITORIES = [
  { id: 'euprus', src: Euprus, className: "w-28 ml-[55%] mt-[20%]" },
  { id: 'northgard', src: Northgard, className: "w-22 ml-[55%] mt-[8%]" },
  { id: 'thevia', src: Thevia, className: "w-[42%] h-[35%] ml-[39%] mt-[30%]" },
  { id: 'xurith', src: Xurith, className: "w-[19%] ml-[24.5%] mt-[60.5%]" },
];

const MAX_ROTATION = 2;

export default function CoresMap() {
  const [dummyStatus, setDummyStatus] = useState({
    euprus: false,
    northgard: false,
    thevia: false,
    xurith: false,
  });

  const [clickedId, setClickedId] = useState(null);
  const containerRef = useRef(null);
  const imageRefs = useRef({});

  // 3D Tilt Logic
  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    const xRot = (yPct - 0.5) * 2;
    const yRot = (xPct - 0.5) * 2;

    containerRef.current.style.setProperty('--rx', `${-xRot * MAX_ROTATION}deg`);
    containerRef.current.style.setProperty('--ry', `${yRot * MAX_ROTATION}deg`);
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--rx', '0deg');
    containerRef.current.style.setProperty('--ry', '0deg');
  };

  useEffect(() => {
    if (clickedId) {
      const timer = setTimeout(() => setClickedId(null), 300);
      return () => clearTimeout(timer);
    }
  }, [clickedId]);

  const isPixelOpaque = (img, clientX, clientY) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = img.getBoundingClientRect();
    const x = (clientX - rect.left) * (img.naturalWidth / rect.width);
    const y = (clientY - rect.top) * (img.naturalHeight / rect.height);
    canvas.width = 1; canvas.height = 1;

    try {
      ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
      const alpha = ctx.getImageData(0, 0, 1, 1).data[3];
      return alpha > 10;
    } catch (err) { return false; }
  };

  const handleMapClick = (e) => {
    const reversedIds = TERRITORIES.map(t => t.id).reverse();
    for (const id of reversedIds) {
      const img = imageRefs.current[id];
      if (!img) continue;
      const rect = img.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        if (isPixelOpaque(img, e.clientX, e.clientY)) {
          handleInteract(id);
          return;
        }
      }
    }
  };

  const handleInteract = (id) => {
    setClickedId(id);
    setDummyStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <style>{`
        .map-container {
          --rx: 0deg;
          --ry: 0deg;
          perspective: 1200px;
        }
        .map-inner {
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.2s ease-out;
          filter: url(#paper-grain) drop-shadow(0 20px 30px rgba(0,0,0,0.3));
          background: #f4ecd8; /* Vintage paper base color */
        }
        .paper-overlay {
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.4;
          background: url('https://www.transparenttextures.com/patterns/natural-paper.png');
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-8">
        <div 
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleMapClick}
          className="map-container relative w-full max-w-[600px] cursor-pointer select-none"
        >
          <div className="map-inner relative overflow-hidden rounded-sm border-8 border-[#3d2b1f]/10">
            {/* Main Map Background */}
            <img src={Map} alt="Main Map" className="w-full h-auto block grayscale-[0.2] sepia-[0.2]" />

            {/* Paper Texture Layers */}
            <div className="paper-overlay absolute inset-0 z-20" />

            {/* Territories */}
            {TERRITORIES.map((t) => {
              const isActive = dummyStatus[t.id] ?? false;
              const isAnimating = clickedId === t.id;

              return (
                <div key={t.id} className="absolute inset-0 pointer-events-none">
                  <img
                    ref={el => imageRefs.current[t.id] = el}
                    src={t.src}
                    crossOrigin="anonymous"
                    className={`
                      absolute transition-all duration-500 pointer-events-none
                      ${t.className} 
                      ${isActive ? 'opacity-100' : 'grayscale'}
                      ${isAnimating ? 'brightness-125 scale-105 z-10' : 'scale-100'}
                    `}
                    alt={t.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}