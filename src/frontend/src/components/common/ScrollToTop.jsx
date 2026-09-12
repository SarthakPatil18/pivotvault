import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that whenever the URL / route changes,
 * or when the user navigates to a new page, the window scroll position
 * resets to the top instantly.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's an anchor hash, let the browser scroll to it; otherwise go to top
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
