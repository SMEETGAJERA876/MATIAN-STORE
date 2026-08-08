// NOTE: Login page hero lineup image (/images/matrin-hero-lineup.png) shows the target studio photography lineup style — individual product shots (/images/products/*.webp) match this cohesive studio aesthetic.

"use client";

import { useState, useEffect } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-square', 'aspect-4/3'
  fitMode?: "cover" | "contain";
  fallbackSrc?: string;
  roundedClassName?: string;
  showHoverEffect?: boolean;
  paddingClassName?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  aspectRatio = "aspect-square",
  fitMode = "cover",
  fallbackSrc = "/images/matrin-logo-sticker.png",
  roundedClassName = "rounded-2xl",
  showHoverEffect = true,
  paddingClassName = "p-3",
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(!src);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(!src);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden ${roundedClassName} bg-[#F4F6FB] ${paddingClassName} flex items-center justify-center border border-slate-100/80 shadow-2xs ${className}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`h-full w-full ${roundedClassName} ${
          fitMode === "contain" ? "object-contain" : "object-cover object-center"
        } ${
          showHoverEffect ? "transition-transform duration-500 group-hover:scale-105" : ""
        } ${imgClassName}`}
      />

      {/* Fallback Badge Overlay if image failed */}
      {hasError && (
        <span className="absolute bottom-2 inset-x-2 rounded-lg bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white text-center">
          Matrin Product
        </span>
      )}
    </div>
  );
}
