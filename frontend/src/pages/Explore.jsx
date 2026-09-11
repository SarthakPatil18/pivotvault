import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { StartupCard } from '../components/common/StartupCard';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { CompanyLogo } from '../components/common/CompanyLogo';
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
    <div className="pb-20 bg-[#f6f9fc] min-h-screen">
      <PageHeader
        title="Startup Failure Archive"
        subtitle="Search, filter, and analyze 413+ verified startup failure post-mortems across 15 industries and 12 failure vectors."
        badge="413+ Startups Indexed"
        tagline="ARCHIVE DATABASE"
        breadcrumbs={[{ label: 'Explore Archive' }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 transition-colors shadow-xs"
            style={{
              color: '#2d72f0',
              border: '1px solid #dcdbda',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f5f3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            {exported ? <Check className="w-3.5 h-3.5 text-[#47d096]" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exported ? 'Exported' : 'Export CSV'}</span>
          </button>
        }
      />

      <div className="vault-container">
        {/* Search & Filter Controls Bar */}
        <div 
          className="p-5 mb-8 space-y-4"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 8px'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-[#787673] absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  updateFilters({ q: e.target.value, page: 1 });
                }}
                placeholder="Search by company, founder, investor, root cause..."
                className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #dcdbda',
                  borderRadius: '8px',
                  color: '#111111',
                }}
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
                className="w-full px-3 py-2 text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #dcdbda',
                  borderRadius: '8px',
                  color: '#373634'
                }}
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
                className="w-full px-3 py-2 text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #dcdbda',
                  borderRadius: '8px',
                  color: '#373634'
                }}
              >
                {FAILURE_MODES.map((fm) => (
                  <option key={fm} value={fm}>{fm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Country, Sort, View Mode & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e3e8ee] text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Country Selector */}
              <div className="flex items-center gap-1.5 font-sans" style={{ color: '#787673', fontSize: '12px' }}>
                <span>Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                    updateFilters({ country: e.target.value, page: 1 });
                  }}
                  className="px-2.5 py-1 rounded focus:outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dcdbda',
                    borderRadius: '8px',
                    color: '#111111',
                    fontSize: '12px'
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 font-sans" style={{ color: '#787673', fontSize: '12px' }}>
                <ArrowUpDown className="w-3.5 h-3.5 text-[#787673]" />
                <span>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="px-2.5 py-1 rounded focus:outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dcdbda',
                    borderRadius: '8px',
                    color: '#111111',
                    fontSize: '12px'
                  }}
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
                  className="flex items-center gap-1 hover:underline text-xs font-medium"
                  style={{ color: '#e16540' }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Results Count & Grid/Table View Mode */}
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: '#787673' }}>
                Showing <strong style={{ color: '#2d72f0', fontWeight: 600 }}>{pagination.totalRecords}</strong> failures
              </span>

              <div className="flex items-center p-0.5 rounded bg-[#f6f5f3] border border-[#dcdbda]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#ffffff] text-[#111111] shadow-xs' : 'text-[#787673]'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-[#ffffff] text-[#111111] shadow-xs' : 'text-[#787673]'}`}
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
          <div 
            className="overflow-x-auto"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 8px'
            }}
          >
            <table className="w-full text-left text-xs">
              <thead 
                className="border-b border-[#dcdbda] font-sans text-[11px] uppercase tracking-wider"
                style={{ backgroundColor: '#f6f5f3', color: '#787673' }}
              >
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Startup</th>
                  <th className="py-3.5 px-4 font-semibold">Industry</th>
                  <th className="py-3.5 px-4 font-semibold">Country</th>
                  <th className="py-3.5 px-4 font-semibold">Failure Score</th>
                  <th className="py-3.5 px-4 font-semibold">Capital Lost</th>
                  <th className="py-3.5 px-4 font-semibold">Lifespan</th>
                  <th className="py-3.5 px-4 font-semibold">Primary Failure Mode</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecebea] font-sans">
                {startups.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f6f5f3] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      <Link to={`/startup/${s.id}`} className="hover:text-[#2d72f0] transition-colors flex items-center gap-2.5">
                        <CompanyLogo startup={s} size="xs" />
                        <span>{s.name}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#373634]">
                      {s.industry}
                    </td>
                    <td className="py-3.5 px-4 text-[#787673]">
                      {s.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <FailureScoreBadge score={s.failureScore} size="sm" />
                    </td>
                    <td 
                      className="py-3.5 px-4 font-bold text-[#e16540]"
                      style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.42px' }}
                    >
                      {formatCurrency(s.capitalRaised)}
                    </td>
                    <td className="py-3.5 px-4 text-[#787673]">
                      {s.foundedYear}–{s.failedYear}
                    </td>
                    <td className="py-3.5 px-4 text-[#373634]">
                      {s.failureMode}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/startup/${s.id}`}
                        className="text-xs hover:underline font-semibold"
                        style={{ color: '#2d72f0' }}
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
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e3e8ee] text-xs">
            <div style={{ color: '#64748d' }}>
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
                      className={`w-8 h-8 rounded-full text-xs transition-colors ${
                        currentPage === pNum
                          ? 'bg-[#0d253d] text-white font-bold'
                          : 'bg-[#ffffff] text-[#273951] border border-[#e3e8ee] hover:bg-[#f6f9fc]'
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
