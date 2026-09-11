import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KnowledgeGraph } from '../components/graph/KnowledgeGraph';
import { Layers, Network, Info, Sparkles } from 'lucide-react';

export function StartupGraph() {
  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Interactive Startup Knowledge Graph"
        subtitle="Network topology connecting 413+ Failed Startups ↔ Founders ↔ Venture Investors ↔ Failure Causes ↔ Industry Sectors."
        badge="D3 Force Topology"
        tagline="GRAPH INTELLIGENCE"
        breadcrumbs={[{ label: 'Insights' }, { label: 'Knowledge Graph' }]}
      />

      <div className="vault-container space-y-6">
        {/* Instructions banner */}
        <div className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs text-[#737373] dark:text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-black dark:text-white shrink-0" />
            <span>Click any node to open the forensic entity inspector. Drag nodes to explore cluster connectivity. Use mousewheel to zoom.</span>
          </div>
          <span className="font-mono text-[11px] text-[#737373] dark:text-[#A3A3A3] hidden sm:inline">
            Force Simulation v2.1
          </span>
        </div>

        {/* D3 Graph Component */}
        <KnowledgeGraph />
      </div>
    </div>
  );
}

export default StartupGraph;
