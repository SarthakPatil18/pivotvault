import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Globe, Database } from 'lucide-react';

const LandingPage = () => {
  const [search, setSearch] = React.useState('');

  const stats = [
    { label: 'Failures Documented', value: '12,437', icon: Database },
    { label: 'Industries', value: '48', icon: TrendingUp },
    { label: 'Countries', value: '112', icon: Globe },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              💀 PivotVault — Where Startup <br />
              <span className="text-accent">Lessons Live Forever</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              The world's first open knowledge base of startup failures. 
              Analyze thousands of postmortems with AI to build your next venture smarter.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-text-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search startup ideas, industries, mistakes..."
                className="w-full bg-surface-2 border border-border rounded-full py-4 pl-14 pr-32 text-lg focus:outline-none focus:border-accent transition-all shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link
                to={`/explore?q=${search}`}
                className="absolute right-3 top-2 bottom-2 bg-accent hover:bg-orange-600 text-white px-8 rounded-full flex items-center font-bold transition-colors"
              >
                Search
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-surface/50 border border-border p-6 rounded-card backdrop-blur-sm"
              >
                <stat.icon className="w-8 h-8 text-accent-2 mx-auto mb-4" />
                <div className="text-3xl font-data font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Failures Preview */}
      <section className="bg-surface/30 py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold">Featured Failures</h2>
            <Link to="/explore" className="text-accent hover:underline font-medium">Explore All Failures →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample Card */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center font-bold text-accent">FV</div>
                  <h3 className="font-bold">Failed Ventures {i}</h3>
                </div>
                <p className="text-sm text-text-secondary line-clamp-3 mb-4">
                  A revolutionary AI fitness platform that raised $2M but failed to retain users after the first month...
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red/10 text-red text-[10px] font-bold rounded-badge uppercase tracking-wider">Failed</span>
                  <span className="px-2 py-1 bg-surface-2 text-text-secondary text-[10px] font-bold rounded-badge uppercase tracking-wider">Fitness</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-[800px] pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-2/30 rounded-full blur-[128px]" />
      </div>
    </div>
  );
};

export default LandingPage;