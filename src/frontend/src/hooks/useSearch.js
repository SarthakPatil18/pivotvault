import { useState, useEffect } from 'react';

/**
 * Global Search Hook with Cmd+K shortcut and debouncing
 */
export function useSearch(initialQuery = '', delay = 250) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    isSearchOpen,
    setIsSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
  };
}

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
      localStorage.setItem('pivotvault_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
