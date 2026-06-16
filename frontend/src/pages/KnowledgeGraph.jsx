import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Info, ZoomIn, ZoomOut, RotateCcw, Building2, MapPin, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const KnowledgeGraph = () => {
  const containerRef = React.useRef(null);
  const [data, setData] = React.useState(null);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { theme } = useTheme();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/graph/edges`);
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!data || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous svg
    d3.select(containerRef.current).selectAll("svg").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // Links
    const linkColor = theme === 'blue' ? '#CBD5E1' : '#1E293B';
    const link = g.append("g")
      .attr("stroke", linkColor)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.weight) * 3);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        if (d.type === 'startup') setSelectedNode(d);
      });

    // Node circles/shapes
    node.append("circle")
      .attr("r", d => d.type === 'startup' ? 12 : d.type === 'mistake' ? 8 : 6)
      .attr("fill", d => {
        if (d.type === 'startup') return "#8B5CF6";
        if (d.type === 'mistake') return "#F97316";
        return "#EF4444";
      })
      .attr("stroke", theme === 'blue' ? "#FFFFFF" : "#0A0F1A")
      .attr("stroke-width", 2);

    // Labels
    const labelColor = theme === 'blue' ? '#1E293B' : '#94A3B8';
    node.append("text")
      .text(d => d.name)
      .attr("x", 16)
      .attr("y", 4)
      .attr("fill", labelColor)
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("font-family", "Plus Jakarta Sans")
      .style("pointer-events", "none")
      .style("text-shadow", theme === 'blue' ? "0 0 4px rgba(255,255,255,0.8)" : "0 0 4px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-bg">
      {/* Sidebar UI */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-surface/80 backdrop-blur-md border border-border p-6 rounded-card max-w-xs">
          <h1 className="text-2xl font-display font-bold mb-2">Failure Knowledge Graph</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Visualizing connections between <span className="text-accent-2 font-bold">Startups</span>, 
            the <span className="text-accent font-bold">Mistakes</span> they made, and the final 
            <span className="text-red font-bold"> Outcome</span>.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="p-3 bg-surface-2 border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button className="p-3 bg-surface-2 border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="p-3 bg-surface-2 border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Selected Node Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-6 right-6 bottom-6 w-80 bg-surface/90 backdrop-blur-xl border border-border rounded-card p-8 shadow-2xl z-20 flex flex-col"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              Close
            </button>
            
            <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center text-2xl font-bold text-accent mb-6 border border-border">
              {selectedNode.name.charAt(0)}
            </div>
            
            <h2 className="text-2xl font-display font-bold mb-2 text-text-primary">{selectedNode.name}</h2>
            <div className="bg-red/10 text-red border border-red/20 px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase w-fit mb-6">
              {selectedNode.status}
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Building2 className="w-4 h-4 text-accent" />
                {selectedNode.industry}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-accent" />
                India
              </div>
            </div>

            <a 
              href={`/startup/${selectedNode.slug}`}
              className="mt-auto bg-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center transition-all flex items-center justify-center gap-2"
            >
              View Full Postmortem
              <Skull className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <div className="font-data text-accent text-sm tracking-widest uppercase">Initializing Force Layout...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;