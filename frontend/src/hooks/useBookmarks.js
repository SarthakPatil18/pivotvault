import { useState, useEffect } from 'react';

/**
 * Saved / Bookmarked Startups Hook
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('pivotvault_bookmarks');
      return saved ? JSON.parse(saved) : ['theranos', 'wework', 'quibi'];
    } catch {
      return ['theranos', 'wework', 'quibi'];
    }
  });

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pivotvault_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist bookmarks:', e);
      }
      return updated;
    });
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}

export default useBookmarks;
