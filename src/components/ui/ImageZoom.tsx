"use client";

import React, { useState, useRef } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200 ease-out"
        style={{
          transform: isZoomed ? "scale(2)" : "scale(1)",
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        }}
      />
      {isZoomed && (
        <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-[10px] text-gold-400 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
          Zoomed
        </div>
      )}
    </div>
  );
};
