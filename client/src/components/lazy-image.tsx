import { useState, useEffect } from "react";
import { useImageLoading } from "@/hooks/use-image-loading";
import { Loader2 } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  spinnerSize?: "sm" | "md" | "lg";
}

export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  fallback,
  spinnerSize = "md"
}: LazyImageProps) {
  const { loading, error, imageSrc } = useImageLoading({ src, fallback });

  const spinnerSizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }[spinnerSize];

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-in fade-in duration-300`}>
        <Loader2 className={`${spinnerSizeClass} animate-spin text-primary`} />
      </div>
    );
  }

  if (error && !fallback) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs`}>
        Failed to load
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} animate-in fade-in duration-500`}
      loading="lazy"
    />
  );
}
