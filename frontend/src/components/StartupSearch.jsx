import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function StartupSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/startups?search=${encodeURIComponent(query)}`);
        setResults(data.startups || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (slug) => {
    setQuery('');
    setResults([]);
    navigate(`/startup/${slug}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search startups..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
      />
      {results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border rounded-lg shadow">
          {results.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelect(s.slug)}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              {s.name} <span className="text-xs text-slate-400">({s.industry})</span>
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="absolute right-2 top-2 text-sm">...</div>}
    </div>
  );
}
