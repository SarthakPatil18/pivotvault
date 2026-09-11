import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CURATED_STARTUPS } from '../../lib/data/startupsData';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from '../common/FailureScoreBadge';
import { formatCurrency } from '../../lib/utils';
import { X, ZoomIn, ZoomOut, RotateCcw, Filter, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export function KnowledgeGraph() {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Prepare graph nodes and links from curated startups
  const prepareGraphData = () => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    const addNode = (id, label, type, data = {}) => {
      if (!nodeMap.has(id)) {
        const node = { id, label, type, ...data };
        nodeMap.set(id, node);
        nodes.push(node);
      }
      return nodeMap.get(id);
    };

    CURATED_STARTUPS.forEach((s) => {
      // Startup Node
      const sNode = addNode(`startup-${s.id}`, s.name, 'STARTUP', {
        startupId: s.id,
        capitalRaised: s.capitalRaised,
        failureScore: s.failureScore,
        failureMode: s.failureMode,
        industry: s.industry,
        tagline: s.tagline,
        summary: s.summary
      });

      // Industry Node
      const indNode = addNode(`ind-${s.industry}`, s.industry, 'INDUSTRY');
      links.push({ source: sNode.id, target: indNode.id, type: 'IN_INDUSTRY' });

      // Failure Mode Node
      const fNode = addNode(`fail-${s.failureMode}`, s.failureMode, 'FAILURE_CAUSE');
      links.push({ source: sNode.id, target: fNode.id, type: 'FAILED_DUE_TO' });

      // Founder Nodes
      s.founders?.forEach((f) => {
        const fId = `founder-${f.name.replace(/\s+/g, '-').toLowerCase()}`;
        const fndNode = addNode(fId, f.name, 'FOUNDER', { role: f.role, startup: s.name });
        links.push({ source: sNode.id, target: fndNode.id, type: 'FOUNDED_BY' });
      });

      // Investor Nodes
      s.investors?.slice(0, 3).forEach((inv) => {
        const invId = `inv-${inv.replace(/\s+/g, '-').toLowerCase()}`;
        const invNode = addNode(invId, inv, 'INVESTOR');
        links.push({ source: sNode.id, target: invNode.id, type: 'INVESTED_IN' });
      });
    });

    return { nodes, links };
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const { nodes: rawNodes, links: rawLinks } = prepareGraphData();

    // Filter nodes by type or search
    const filteredNodes = rawNodes.filter((n) => {
      if (filterType !== 'ALL' && n.type !== filterType) return false;
      if (searchTerm && !n.label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = rawLinks.filter(
      (l) => activeNodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) &&
             activeNodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)
    );

    const width = svgRef.current.clientWidth || 900;
    const height = 580;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', height);

    const container = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id((d) => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Colors by Type
    const getColor = (type) => {
      switch (type) {
        case 'STARTUP': return '#e11d48'; // Subtle Red accent
        case 'FAILURE_CAUSE': return '#d97706'; // Amber
        case 'FOUNDER': return '#52525b'; // Neutral dark
        case 'INVESTOR': return '#3b82f6'; // Subtle blue
        case 'INDUSTRY': return '#10b981'; // Emerald
        default: return '#71717a';
      }
    };

    // Render Links
    const link = container.append('g')
      .attr('stroke', '#71717a')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 1.2)
      .selectAll('line')
      .data(filteredLinks)
      .join('line');

    // Render Node Groups
    const node = container.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles
    node.append('circle')
      .attr('r', (d) => d.type === 'STARTUP' ? 18 : d.type === 'FAILURE_CAUSE' ? 14 : 10)
      .attr('fill', (d) => getColor(d.type))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-transform duration-200 hover:scale-125');

    // Node text labels
    node.append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', (d) => (d.type === 'STARTUP' ? 26 : 20))
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('class', 'text-[10px] font-mono font-medium fill-neutral-800 dark:fill-neutral-200 select-none pointer-events-none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node
        .attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filterType, searchTerm]);

  return (
    <div className="relative vault-card overflow-hidden">
      {/* Graph Toolbar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Node Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { label: 'All Entities', value: 'ALL' },
            { label: 'Startups', value: 'STARTUP' },
            { label: 'Failure Causes', value: 'FAILURE_CAUSE' },
            { label: 'Founders', value: 'FOUNDER' },
            { label: 'Investors', value: 'INVESTOR' },
            { label: 'Industries', value: 'INDUSTRY' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterType(item.value)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filterType === item.value
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search within Graph */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search node name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-xs w-44 placeholder-neutral-400 focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[580px] bg-neutral-50/30 dark:bg-neutral-950/40">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono space-y-1.5 shadow-sm">
          <div className="font-bold uppercase tracking-wider text-neutral-400 mb-1">Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Failed Startup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>Failure Root Cause</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span>Founder</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Venture Investor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Industry Sector</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 max-w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-5 animate-fade-in z-10 text-xs">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="vault-badge vault-badge-neutral font-mono text-[10px]">
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50 mb-1">
              {selectedNode.label}
            </h4>

            {selectedNode.type === 'STARTUP' && (
              <div className="space-y-3 mt-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Capital Lost:</span>
                  <span className="font-bold">{formatCurrency(selectedNode.capitalRaised)}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Failure Score:</span>
                  <FailureScoreBadge score={selectedNode.failureScore} size="sm" />
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <strong className="block text-[10px] font-mono uppercase text-neutral-400 mb-0.5">Primary Failure Vector:</strong>
                  {selectedNode.failureMode}
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-3">
                  {selectedNode.summary}
                </p>
                <Link
                  to={`/startup/${selectedNode.startupId}`}
                  className="vault-btn-primary w-full text-xs font-mono mt-2"
                >
                  <span>Open Full Autopsy</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            )}

            {selectedNode.type === 'FAILURE_CAUSE' && (
              <div className="space-y-2 mt-2 text-neutral-600 dark:text-neutral-400">
                <p className="text-xs">
                  A systemic failure mode observed across numerous venture-backed startup bankruptcies.
                </p>
                <Link
                  to={`/explore?failureMode=${encodeURIComponent(selectedNode.label)}`}
                  className="vault-btn-secondary w-full text-xs font-mono mt-3 inline-block text-center"
                >
                  View Startups with this Cause
                </Link>
              </div>
            )}

            {selectedNode.type === 'FOUNDER' && (
              <div className="space-y-2 mt-2 text-neutral-600 dark:text-neutral-400">
                <p className="text-xs font-mono">
                  Role: {selectedNode.role || 'Executive Leadership'}
                </p>
                <p className="text-xs">
                  Associated venture: <strong>{selectedNode.startup}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeGraph;
