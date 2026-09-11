import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { StartupCard } from '../components/common/StartupCard';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { LoadingState, EmptyState } from '../components/common/InsightCard';
import { getStartups } from '../lib/api';
import { INDUSTRIES, FAILURE_MODES, COUNTRIES } from '../lib/data/startupsData';
import { formatCurrency } from '../lib/utils';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, Grid, 
  List, ChevronLeft, ChevronRight, RotateCcw, Download, Check
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
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1, currentPage: 1, limit: 12 });
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
          limit: 12
        });
        
        setStartups(res.data.startups || []);
        setPagination(res.data.pagination || { totalRecords: 0, totalPages: 1, currentPage: 1, limit: 12 });
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
    <div className="pb-20">
      <PageHeader
        title="Startup Failure Archive"
        subtitle="Search, filter, and analyze 413+ verified startup failure post-mortems across 15 industries and 12 failure vectors."
        badge="413+ Startups Indexed"
        tagline="ARCHIVE DATABASE"
        breadcrumbs={[{ label: 'Explore Archive' }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="vault-btn-secondary text-xs flex items-center gap-1.5"
            title="Export currently filtered dataset as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      <div className="vault-container">
        {/* Search & Filter Controls Bar */}
        <div className="vault-card p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  updateFilters({ q: e.target.value, page: 1 });
                }}
                placeholder="Search by company, founder, investor, root cause..."
                className="vault-input pl-9"
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
                className="vault-input"
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
                className="vault-input"
              >
                {FAILURE_MODES.map((fm) => (
                  <option key={fm} value={fm}>{fm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Country, Sort, View Mode & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Country Selector */}
              <div className="flex items-center gap-1.5 font-mono text-neutral-500">
                <span>Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                    updateFilters({ country: e.target.value, page: 1 });
                  }}
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 font-mono text-neutral-500">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <span>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  <option value="score_desc">Highest Failure Score</option>
                  <option value="score_asc">Lowest Failure Score</option>
                  <option value="capital_desc">Most Capital Evaporated</option>
                  <option value="capital_asc">Least Capital Raised</option>
                  <option value="year_desc">Most Recent Failure Year</option>
                  <option value="name_asc">Company Name (A–Z)</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {(searchQuery || selectedIndustry !== 'All Industries' || selectedFailureMode !== 'All Failure Modes' || selectedCountry !== 'All Countries') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline font-mono text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Results Count & Grid/Table View Mode */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-neutral-500">
                Showing <strong className="text-neutral-900 dark:text-neutral-100">{pagination.totalRecords}</strong> failures
              </span>

              <div className="flex items-center p-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs' : 'text-neutral-400'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded ${viewMode === 'table' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs' : 'text-neutral-400'}`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        )}

        {/* Table View Rendering */}
        {!loading && !error && startups.length > 0 && viewMode === 'table' && (
          <div className="vault-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Startup</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Failure Score</th>
                  <th className="py-3 px-4">Capital Lost</th>
                  <th className="py-3 px-4">Lifespan</th>
                  <th className="py-3 px-4">Primary Failure Mode</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-sans">
                {startups.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      <Link to={`/startup/${s.id}`} className="hover:text-rose-600 transition-colors">
                        {s.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      {s.industry}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {s.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <FailureScoreBadge score={s.failureScore} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {formatCurrency(s.capitalRaised)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {s.foundedYear}–{s.failedYear}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      {s.failureMode}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/startup/${s.id}`}
                        className="font-mono text-xs text-neutral-900 dark:text-neutral-100 hover:text-rose-600 font-semibold"
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
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <div className="text-neutral-500">
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
                className="vault-btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
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
                      className={`w-8 h-8 rounded text-xs transition-colors ${
                        currentPage === pNum
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
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
                className="vault-btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
