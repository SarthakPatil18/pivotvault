import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Info, ZoomIn, ZoomOut, RotateCcw, Building2, MapPin, Skull, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const KnowledgeGraph = () => {
  const containerRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const zoomRef = React.useRef(null);
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

    svgRef.current = svg.node();

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));

    zoomRef.current = zoom;
    svg.call(zoom);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // Links with theme-aware colors
    const link = g.append("g")
      .attr("stroke", "var(--color-border)")
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

    // Node circles/shapes with theme-aware colors
    node.append("circle")
      .attr("r", d => d.type === 'startup' ? 12 : d.type === 'mistake' ? 8 : 6)
      .attr("fill", d => {
        if (d.type === 'startup') return "var(--color-accent)";
        if (d.type === 'mistake') return "var(--color-warning)";
        return "var(--color-danger)";
      })
      .attr("stroke", "var(--color-bg)")
      .attr("stroke-width", 2);

    // Labels with theme-aware colors
    node.append("text")
      .text(d => d.name)
      .attr("x", 16)
      .attr("y", 4)
      .attr("fill", "var(--color-text-primary)")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("font-family", "Plus Jakarta Sans")
      .style("pointer-events", "none")
      .style("text-shadow", theme === 'blue' ? "0 0 4px rgba(0,0,0,0.8)" : "0 0 4px rgba(255,255,255,0.8)");

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
  }, [data, theme]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.2);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-bg">
      {/* Sidebar UI */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="pv-card p-6 max-w-xs">
          <h1 className="text-xl font-display font-bold text-text-primary mb-2">Failure Knowledge Graph</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Visualizing connections between <span className="text-accent font-bold">Startups</span>, 
            the <span className="text-warning font-bold">Mistakes</span> they made, and their 
            <span className="text-danger font-bold"> Outcome</span>.
          </p>
        </div>

        <div className="pv-card p-2 flex gap-2">
          <button 
            onClick={handleZoomIn}
            className="pv-btn-icon"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="pv-btn-icon"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={handleResetZoom}
            className="pv-btn-icon"
            aria-label="Reset View"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Selected Node Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-6 right-6 bottom-6 w-80 pv-card p-6 z-20 flex flex-col"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="pv-btn-icon absolute top-4 right-4"
              aria-label="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-2xl font-display font-bold mb-6 border border-accent/20">
              {selectedNode.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-xl font-display font-bold text-text-primary mb-1">{selectedNode.name}</h2>
            {selectedNode.status && (
              <div className="bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit mb-6">
                {selectedNode.status}
              </div>
            )}

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Building2 className="w-4 h-4 text-accent shrink-0" />
                {selectedNode.industry}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                {selectedNode.country || 'India'}
              </div>
            </div>

            <a 
              href={`/startup/${selectedNode.slug}`}
              className="mt-auto pv-btn-primary flex items-center justify-center gap-2"
            >
              View Full Postmortem
              <Skull className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin" />
            <div className="text-sm font-data text-accent tracking-widest uppercase">Initializing Force Layout...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
