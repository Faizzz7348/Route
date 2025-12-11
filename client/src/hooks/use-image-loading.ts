import { useState, useEffect } from 'react';

interface UseImageLoadingProps {
  src: string;
  fallback?: string;
}

export function useImageLoading({ src, fallback }: UseImageLoadingProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(fallback || '');

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(false);
    };

    img.onerror = () => {
      setLoading(false);
      setError(true);
      if (fallback) {
        setImageSrc(fallback);
      }
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  return { loading, error, imageSrc };
}
