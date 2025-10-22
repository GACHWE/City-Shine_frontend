import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollManager = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', or 'REPLACE'
  const scrollPositions = useRef({});

  useEffect(() => {
    // Save scroll position before route changes
    return () => {
      scrollPositions.current[pathname] = window.scrollY;
    };
  }, [pathname]);

  useEffect(() => {
    if (navigationType === 'POP') {
      // Restore previous scroll position
      const savedY = scrollPositions.current[pathname] ?? 0;
      window.scrollTo(0, savedY);
    } else {
      // Scroll to top for new navigation
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollManager;