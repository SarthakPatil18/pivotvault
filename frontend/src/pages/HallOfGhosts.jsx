import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { GhostPersonaCard, GhostChatInterface } from '../components/ghosts/GhostPersonaCard';
import { getGhostPersonas } from '../lib/api';
import { LoadingState } from '../components/common/InsightCard';
import { Search } from 'lucide-react';

export function HallOfGhosts() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getGhostPersonas();
        const data = res.data || [];
        setPersonas(data);
        if (data.length > 0) {
          setSelectedPersona(data[0]);
        }
      } catch (err) {
        console.error('Ghosts load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter industries
  const industries = useMemo(() => {
    const list = ['All'];
    personas.forEach((p) => {
      const mainInd = p.industry.split('&')[0].trim().split('/')[0].trim();
      if (!list.includes(mainInd)) list.push(mainInd);
    });
    return list;
  }, [personas]);

  // Filtered personas
  const filteredPersonas = useMemo(() => {
    return personas.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.failureCause.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = 
        selectedIndustry === 'All' || 
        p.industry.toLowerCase().includes(selectedIndustry.toLowerCase());

      return matchesSearch && matchesIndustry;
    });
  }, [personas, searchQuery, selectedIndustry]);

  if (loading || !selectedPersona) {
    return (
      <div className="site-container py-24 min-h-screen">
        <LoadingState message="Reconstructing founder personas from historical court transcripts & SEC dockets..." />
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Hall of Ghosts"
        badge="Interactive Personas"
        tagline="HISTORICAL RECONSTRUCTIONS"
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Hall of Ghosts' }]}
      />

      <div className="site-container">

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Persona Roster (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                  Select Persona ({filteredPersonas.length})
                </span>
                <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Click to inspect
                </span>
              </div>

              {/* Search & Industry Quick Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by founder, startup, or failure cause..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-[6px] bg-[#FAFAFA] dark:bg-[#0D0D0D] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white placeholder-[#737373] focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Industry Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-[4px] border transition-colors shrink-0 cursor-pointer ${
                      selectedIndustry === ind
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                        : 'bg-white dark:bg-black text-[#737373] dark:text-[#A3A3A3] border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Cards List */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 no-scrollbar">
              {filteredPersonas.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] text-xs text-[#737373]">
                  No matching founder personas found.
                </div>
              ) : (
                filteredPersonas.map((p) => (
                  <GhostPersonaCard
                    key={p.id}
                    persona={p}
                    isSelected={selectedPersona?.id === p.id}
                    onSelect={(selected) => setSelectedPersona(selected)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Interactive Chat & Forensic Dossier (7 cols) */}
          <div className="lg:col-span-7">
            <GhostChatInterface persona={selectedPersona} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallOfGhosts;
