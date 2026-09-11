import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { GhostPersonaCard, GhostChatInterface } from '../components/ghosts/GhostPersonaCard';
import { getGhostPersonas } from '../lib/api';
import { LoadingState } from '../components/common/InsightCard';
import { ShieldAlert, Bot, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export function HallOfGhosts() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !selectedPersona) {
    return (
      <div className="vault-container py-20">
        <LoadingState message="Reconstructing founder personas from historical court transcripts..." />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader
        title="Hall of Ghosts — Reconstructed Founder Personas"
        subtitle="Forensic dialogue with AI personas synthesized strictly from public court filings, SEC testimony, and investigative journalism."
        badge="Signature AI Reconstruction"
        tagline="HISTORICAL PERSONAS"
        breadcrumbs={[{ label: 'Learn' }, { label: 'Hall of Ghosts' }]}
      />

      <div className="vault-container">
        {/* Prominent Legal & UX Disclosure Notice */}
        <div className="vault-card p-4 sm:p-5 mb-8 bg-neutral-900 text-white dark:bg-neutral-950 border-neutral-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wider font-mono text-[10px]">
              LEGAL & ETHICAL UX DISCLOSURE
            </span>
            <p className="text-neutral-300 leading-relaxed font-sans">
              These personas are AI-synthesized models based exclusively on public trial records, SEC enforcement releases, published autobiographies, and investigative reporting. They do not constitute live statements by living persons.
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Persona Selector & Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Persona Roster */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span className="font-bold uppercase tracking-wider">Select Persona ({personas.length})</span>
            </div>

            <div className="space-y-3">
              {personas.map((p) => (
                <GhostPersonaCard
                  key={p.id}
                  persona={p}
                  isSelected={selectedPersona?.id === p.id}
                  onSelect={(selected) => setSelectedPersona(selected)}
                />
              ))}
            </div>
          </div>

          {/* Interactive Chat Debrief */}
          <div className="lg:col-span-2">
            <GhostChatInterface persona={selectedPersona} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallOfGhosts;
