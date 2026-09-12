import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { StartupCard } from '../components/common/StartupCard';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { LoadingState, EmptyState } from '../components/common/InsightCard';
import { getStartups } from '../lib/api';
import { INDUSTRIES, FAILURE_MODES, COUNTRIES, CURATED_STARTUPS } from '../lib/data/startupsData';
import { formatCurrency } from '../lib/utils';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, Grid, 
  List, ChevronLeft, ChevronRight, RotateCcw, Download, Check,
  Trophy, ArrowRight, ArrowUpRight, Flame, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query state from URL params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || 'All Industries');
  const [selectedFailureMode, setSelectedFailureMode] = useState(searchParams.get('failureMode') || 'All Failure Modes');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'All Countries');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'score_desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Data & loading state
  const [startups, setStartups] = useState([]);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1, currentPage: 1, limit: 20 });
  const [top20List, setTop20List] = useState(() => (CURATED_STARTUPS ? CURATED_STARTUPS.slice(0, 20) : []));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state from URL query changes
  useEffect(() => {
    const q = searchParams.get('q');
    const ind = searchParams.get('industry');
    const fm = searchParams.get('failureMode');
    const ctry = searchParams.get('country');
    const s = searchParams.get('sort');
    const p = searchParams.get('page');

    if (q !== null) setSearchQuery(q);
    if (ind !== null) setSelectedIndustry(ind);
    if (fm !== null) setSelectedFailureMode(fm);
    if (ctry !== null) setSelectedCountry(ctry);
    if (s !== null) setSortOption(s);
    if (p !== null) setCurrentPage(parseInt(p, 10));
  }, [searchParams]);

  // Fetch startups on filter or page change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getStartups({
          query: searchQuery,
          industry: selectedIndustry,
          failureMode: selectedFailureMode,
          country: selectedCountry,
          sort: sortOption,
          page: currentPage,
          limit: 20
        });
        
        const fetchedStartups = res.data.startups || [];
        setStartups(fetchedStartups);
        setPagination(res.data.pagination || { totalRecords: fetchedStartups.length, totalPages: 1, currentPage: 1, limit: 20 });

        // If on first page with default or top sort, capture the top 20 list
        if (fetchedStartups.length >= 20 && (!searchQuery || searchQuery.trim() === '')) {
          setTop20List(fetchedStartups.slice(0, 20));
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch startup intelligence records.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchQuery, selectedIndustry, selectedFailureMode, selectedCountry, sortOption, currentPage]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '' || val === 'All Industries' || val === 'All Failure Modes' || val === 'All Countries' || val === 1) {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All Industries');
    setSelectedFailureMode('All Failure Modes');
    setSelectedCountry('All Countries');
    setSortOption('score_desc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleExportCSV = () => {
    if (startups.length === 0) return;
    const headers = ['Name', 'Industry', 'Country', 'Founded', 'Failed', 'Capital Raised', 'Failure Score', 'Failure Mode', 'Primary Root Cause'];
    const rows = startups.map((s) => [
      `"${s.name}"`,
      `"${s.industry}"`,
      `"${s.country}"`,
      s.foundedYear,
      s.failedYear,
      s.capitalRaised,
      s.failureScore,
      `"${s.failureMode}"`,
      `"${(s.rootCauses && s.rootCauses[0]) || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pivotvault_failures_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-20 bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <PageHeader
        title="Startup Failure Archive"
        subtitle="Search, filter, and analyze 768+ verified startup failure post-mortems across 15 industries and 12 failure vectors."
        badge="768+ Startups Indexed"
        tagline="ARCHIVE DATABASE"
        breadcrumbs={[{ label: 'Explore Archive' }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="vault-btn-secondary flex items-center gap-1.5 cursor-pointer text-xs px-3.5 py-2 rounded-[6px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      <div className="vault-container">
        {/* Top 20 Companies Spotlight Showcase */}
        {top20List.length > 0 && (
          <div className="mb-8 p-5 bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[10px] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center p-1 rounded-full bg-amber-500/10 text-amber-500">
                    <Trophy className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold font-sans tracking-tight text-black dark:text-white">
                    Top 20 Startup Failures & Historical Collapses
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Hall of Autopsies
                  </span>
                </div>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  The 20 most catastrophic venture liquidations, accounting scandals, and unit-economic breakdowns.
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('All Industries');
                  setSelectedFailureMode('All Failure Modes');
                  setSelectedCountry('All Countries');
                  setSortOption('score_desc');
                  setCurrentPage(1);
                  updateFilters({ q: '', industry: 'All Industries', failureMode: 'All Failure Modes', country: 'All Countries', sort: 'score_desc', page: 1 });
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-black dark:text-white hover:underline cursor-pointer"
              >
                <span>View All 20 In Archive Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal scrollable rail of Top 20 company cards */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {top20List.map((c, idx) => (
                <Link
                  key={c.id || idx}
                  to={`/startup/${c.id}`}
                  className="shrink-0 w-[210px] p-3.5 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-all group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#222222] text-[#737373] dark:text-[#A3A3A3] font-mono">
                        #{idx + 1}
                      </span>
                      <FailureScoreBadge score={c.failureScore || (99 - idx)} size="xs" />
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <CompanyLogo startup={c} name={c.name} id={c.id} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs truncate text-black dark:text-white group-hover:underline">
                          {c.name}
                        </h3>
                        <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] truncate">
                          {c.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 mt-1 border-t border-[#F0F0F0] dark:border-[#222222] flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-black dark:text-white">
                      {formatCurrency(c.capitalRaised)}
                    </span>
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] group-hover:text-black dark:group-hover:text-white flex items-center gap-0.5">
                      Autopsy <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Controls Bar */}
        <div className="p-5 mb-8 space-y-4 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  updateFilters({ q: e.target.value, page: 1 });
                }}
                placeholder="Search by company, founder, investor, root cause..."
                className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3]"
              />
            </div>

            {/* Industry Selector */}
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setCurrentPage(1);
                  updateFilters({ industry: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Failure Mode Selector */}
            <div>
              <select
                value={selectedFailureMode}
                onChange={(e) => {
                  setSelectedFailureMode(e.target.value);
                  setCurrentPage(1);
                  updateFilters({ failureMode: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white"
              >
                {FAILURE_MODES.map((fm) => (
                  <option key={fm} value={fm}>{fm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Country, Sort, View Mode & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Country Selector */}
              <div className="flex items-center gap-1.5 font-sans text-[#737373] dark:text-[#A3A3A3] text-[12px]">
                <span>Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                    updateFilters({ country: e.target.value, page: 1 });
                  }}
                  className="px-2.5 py-1 rounded-[4px] focus:outline-none cursor-pointer bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white text-[12px]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 font-sans text-[#737373] dark:text-[#A3A3A3] text-[12px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="px-2.5 py-1 rounded-[4px] focus:outline-none cursor-pointer bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white text-[12px]"
                >
                  <option value="score_desc">Highest Failure Score</option>
                  <option value="score_asc">Lowest Failure Score</option>
                  <option value="capital_desc">Most Capital Evaporated</option>
                  <option value="capital_asc">Least Capital Raised</option>
                  <option value="year_desc">Most Recent Failure Year</option>
                  <option value="name_asc">Company Name (A–Z)</option>
                </select>
              </div>

              {/* Quick Filter: Top 20 Titans */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('All Industries');
                  setSelectedFailureMode('All Failure Modes');
                  setSelectedCountry('All Countries');
                  setSortOption('score_desc');
                  setCurrentPage(1);
                  updateFilters({ q: '', industry: 'All Industries', failureMode: 'All Failure Modes', country: 'All Countries', sort: 'score_desc', page: 1 });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="View Top 20 Companies by Failure Score"
              >
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Top 20 Titans</span>
              </button>

              {/* Reset Filters Button */}
              {(searchQuery || selectedIndustry !== 'All Industries' || selectedFailureMode !== 'All Failure Modes' || selectedCountry !== 'All Countries') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 hover:underline text-xs font-bold cursor-pointer text-black dark:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Results Count & Grid/Table View Mode */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Showing <strong className="text-black dark:text-white font-extrabold">{pagination.totalRecords}</strong> failures
              </span>

              <div className="flex items-center p-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-[#737373] dark:text-[#A3A3A3]'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-[#737373] dark:text-[#A3A3A3]'}`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading && <LoadingState message="Loading failure archive records..." />}

        {error && (
          <EmptyState
            title="Error loading startup records"
            description={error}
            actionLabel="Retry Query"
            onAction={() => setCurrentPage(1)}
          />
        )}

        {!loading && !error && startups.length === 0 && (
          <EmptyState
            title="No matching startup failure records"
            description="No startups matched your exact filter combination. Try clearing filters or searching for broad terms like 'FinTech', 'Theranos', or 'Unit Economics'."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}

        {/* Grid View Rendering */}
        {!loading && !error && startups.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        )}

        {/* Table View Rendering */}
        {!loading && !error && startups.length > 0 && viewMode === 'table' && (
          <div className="overflow-x-auto bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] font-sans text-[11px] uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Startup</th>
                  <th className="py-3.5 px-4 font-bold">Industry</th>
                  <th className="py-3.5 px-4 font-bold">Country</th>
                  <th className="py-3.5 px-4 font-bold">Failure Score</th>
                  <th className="py-3.5 px-4 font-bold">Capital Lost</th>
                  <th className="py-3.5 px-4 font-bold">Lifespan</th>
                  <th className="py-3.5 px-4 font-bold">Primary Failure Mode</th>
                  <th className="py-3.5 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A] font-sans">
                {startups.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-black dark:text-white">
                      <Link to={`/startup/${s.id}`} className="hover:underline transition-colors flex items-center gap-2.5">
                        <CompanyLogo startup={s} size="xs" />
                        <span>{s.name}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-black dark:text-white">
                      {s.industry}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] dark:text-[#A3A3A3]">
                      {s.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <FailureScoreBadge score={s.failureScore} size="sm" />
                    </td>
                    <td 
                      className="py-3.5 px-4 font-bold text-black dark:text-white font-mono"
                      style={{ letterSpacing: '-0.42px' }}
                    >
                      {formatCurrency(s.capitalRaised)}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] dark:text-[#A3A3A3]">
                      {s.foundedYear}–{s.failedYear}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] dark:text-[#A3A3A3]">
                      {s.failureMode}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/startup/${s.id}`}
                        className="text-xs hover:underline font-bold text-black dark:text-white"
                      >
                        Autopsy →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-xs">
            <div className="text-[#737373] dark:text-[#A3A3A3]">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} records)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const p = Math.max(1, currentPage - 1);
                  setCurrentPage(p);
                  updateFilters({ page: p });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={!pagination.hasPrevPage}
                className="vault-btn-secondary text-xs px-3 py-1.5 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1 inline" />
                Previous
              </button>

              {/* Page Number Chips */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pNum;
                  if (pagination.totalPages <= 5) {
                    pNum = i + 1;
                  } else if (currentPage <= 3) {
                    pNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pNum = pagination.totalPages - 4 + i;
                  } else {
                    pNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        updateFilters({ page: pNum });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-[4px] text-xs transition-colors cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                          : 'bg-white dark:bg-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A]'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const p = Math.min(pagination.totalPages, currentPage + 1);
                  setCurrentPage(p);
                  updateFilters({ page: p });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={!pagination.hasNextPage}
                className="vault-btn-secondary text-xs px-3 py-1.5 disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
