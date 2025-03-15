import { useState, useEffect } from 'react';

const useBreakpoint = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 600;
  const isTablet = width > 600 && width <= 1200;
  const isDesktop = width > 1200;

  return { isMobile, isTablet, isDesktop };
};

export default useBreakpoint;
