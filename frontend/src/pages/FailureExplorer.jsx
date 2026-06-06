import React from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import StartupCard from '../components/StartupCard';
import { Search, Filter, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const FailureExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);

  const query = searchParams.get('q') || '';
  const industry = searchParams.get('industry') || '';
  const status = searchParams.get('status') || '';

  React.useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/startups`, {
          params: Object.fromEntries(searchParams)
        });
        setStartups(response.data.data);
        setTotal(response.data.total);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl font-display font-bold mb-6">Failure Explorer</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Filter by name, industry, or keyword..."
              className="w-full bg-surface border border-border rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-accent"
              value={query}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <select 
            className="bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent"
            value={industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="Fitness & AI">Fitness & AI</option>
            <option value="Streaming / Entertainment">Streaming / Entertainment</option>
            <option value="FinTech">FinTech</option>
            <option value="EdTech">EdTech</option>
          </select>

          <select 
            className="bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent"
            value={status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="failed">Failed</option>
            <option value="acquired">Acquired</option>
            <option value="pivoted">Pivoted</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between text-sm text-text-secondary">
        <div>Showing {startups.length} of {total} documented failures</div>
        <div className="flex gap-2">
          {searchParams.toString() && (
            <button 
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1 text-accent hover:underline"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-[250px] glass-card animate-pulse bg-surface-2/50" />
          ))}
        </div>
      ) : startups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {startups.map(startup => (
            <StartupCard key={startup.id} {...startup} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface/20 rounded-card border border-dashed border-border">
          <p className="text-text-secondary text-lg">No failures found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FailureExplorer;