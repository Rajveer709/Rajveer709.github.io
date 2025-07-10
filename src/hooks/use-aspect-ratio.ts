import { useEffect, useState } from 'react';

/**
 * React hook to get the current aspect ratio and orientation of the viewport.
 * Returns { aspectRatio, orientation, isFoldable, width, height }
 */
export function useAspectRatio() {
  const getInfo = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const orientation = width > height ? 'landscape' : 'portrait';
    // Foldable detection (very basic)
    const isFoldable = 'getWindowSegments' in window || (navigator.userAgent.includes('Fold') || navigator.userAgent.includes('Surface Duo'));
    return { aspectRatio, orientation, isFoldable, width, height };
  };
  const [info, setInfo] = useState(getInfo());
  useEffect(() => {
    const onResize = () => setInfo(getInfo());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return info;
}
