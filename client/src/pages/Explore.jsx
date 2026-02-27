import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import api from '../api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { HiMap, HiArrowRight, HiCurrencyDollar, HiTrendingUp, HiClock, HiX, HiAcademicCap } from 'react-icons/hi';

export default function Explore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/careers/explore')
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 401) return;
        toast.error('Failed to load career paths. Try assessing skills first.');
      })
      .finally(() => setLoading(false));
  }, []);

  const drawGraph = useCallback(() => {
    if (!data?.paths?.length || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(500, container.clientHeight);

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Zoom
    const g = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Build nodes and links
    const centerNode = {
      id: 'center',
      label: data.source_role || 'You',
      type: 'source',
      salary: 0,
      growth: 0,
      overlap: 100,
      demand: 'Current',
    };

    const targetNodes = data.paths.map((p, i) => ({
      id: `target-${i}`,
      pathData: p,
      label: p.target_role,
      type: 'target',
      salary: p.median_salary,
      growth: p.growth_rate,
      overlap: p.skill_overlap,
      feasibility: p.feasibility_score,
      demand: p.market_demand,
      radius: Math.max(30, Math.min(55, 25 + (p.growth_rate || 0) * 0.8)),
    }));

    const nodes = [centerNode, ...targetNodes];
    const links = targetNodes.map(n => ({ source: 'center', target: n.id }));

    // Color scale based on skill overlap
    const colorScale = d3.scaleLinear()
      .domain([0, 50, 100])
      .range(['#94a3b8', '#17A2B8', '#059669']);

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(180))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d.radius || 40) + 15));

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4');

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
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

    // Center node
    node.filter(d => d.type === 'source')
      .append('circle')
      .attr('r', 45)
      .attr('fill', '#1B4F72')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 8px rgba(27,79,114,0.3))');

    node.filter(d => d.type === 'source')
      .append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', '700');

    // Target nodes - circles
    node.filter(d => d.type === 'target')
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorScale(d.overlap))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.9)
      .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))')
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('r', d.radius + 5).attr('opacity', 1);
        const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#1B4F72">${esc(d.label)}</div>
            <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font-size:12px">
              <span style="color:#6b7280">Salary:</span><span style="font-weight:600">$${esc(String((d.salary/1000).toFixed(0)))}k/yr</span>
              <span style="color:#6b7280">Growth:</span><span style="font-weight:600;color:#059669">${esc(String(d.growth))}%</span>
              <span style="color:#6b7280">Skill Match:</span><span style="font-weight:600">${esc(String(d.overlap))}%</span>
              <span style="color:#6b7280">Demand:</span><span style="font-weight:600">${esc(d.demand)}</span>
              <span style="color:#6b7280">Feasibility:</span><span style="font-weight:600">${esc(String(d.feasibility))}%</span>
            </div>
          `)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this).transition().duration(200).attr('r', d.radius).attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .on('click', (event, d) => {
        setSelectedPath(d.pathData);
        tooltip.style('opacity', 0);
      });

    // Target node labels
    node.filter(d => d.type === 'target')
      .append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.radius + 18)
      .attr('fill', '#d1d5db')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // Overlap % inside circle
    node.filter(d => d.type === 'target')
      .append('text')
      .text(d => `${d.overlap}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '13px')
      .attr('font-weight', '700');

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [data]);

  useEffect(() => {
    drawGraph();
    const handleResize = () => drawGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  const handleStartPath = async (path) => {
    setGenerating(true);
    try {
      await api.post('/api/roadmap/generate', { career_path_id: path.id });
      toast.success('Roadmap generated!');
      navigate(`/roadmap/${path.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <Spinner size="lg" text="Loading career paths..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <HiMap className="w-8 h-8 text-teal-500" />
          Career Path Explorer
        </h1>
        <p className="text-gray-400 mt-2">
          Click any career node to see details. Node size = market demand. Color intensity = skill overlap.
        </p>
      </div>

      {!data?.paths?.length ? (
        <div className="card text-center py-16">
          <HiMap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Career Paths Yet</h3>
          <p className="text-gray-400 mb-6">Complete your skill assessment first to see matched career paths.</p>
          <button onClick={() => navigate('/assess')} className="btn-primary">
            Start Skill Assessment
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Graph */}
          <div className="flex-1" ref={containerRef}>
            {/* Legend */}
            <div className="card !p-3 mb-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Legend:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1B4F72] inline-block" /> Current Role
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ background: 'linear-gradient(135deg, #94a3b8, #059669)' }} /> Skill Overlap (low → high)
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="16"><circle cx="6" cy="8" r="4" fill="#17A2B8" opacity="0.5" /><circle cx="12" cy="8" r="6" fill="#17A2B8" opacity="0.5" /></svg>
                  Node Size = Market Demand
                </span>
                <span>Drag nodes | Scroll to zoom | Click for details</span>
              </div>
            </div>

            <div className="card !p-0 overflow-hidden" style={{ height: '550px' }}>
              <svg ref={svgRef} className="w-full h-full" />
            </div>
          </div>

          {/* Detail Panel */}
          {selectedPath && (
            <div className="lg:w-96 animate-fade-in">
              <div className="card sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-extrabold text-white">{selectedPath.target_role}</h2>
                  <button
                    onClick={() => setSelectedPath(null)}
                    className="p-1 hover:bg-white/10 rounded-lg"
                  >
                    <HiX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <HiCurrencyDollar className="w-4 h-4" /> Median Salary
                    </div>
                    <p className="text-lg font-extrabold text-white">
                      ${(selectedPath.median_salary / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <HiTrendingUp className="w-4 h-4" /> Growth Rate
                    </div>
                    <p className="text-lg font-extrabold text-emerald-600">{selectedPath.growth_rate}%</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <HiClock className="w-4 h-4" /> Transition
                    </div>
                    <p className="text-lg font-extrabold text-white">{selectedPath.transition_time_months} mo</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <HiAcademicCap className="w-4 h-4" /> Feasibility
                    </div>
                    <p className={`text-lg font-extrabold ${
                      selectedPath.feasibility_score >= 75 ? 'text-emerald-600' :
                      selectedPath.feasibility_score >= 50 ? 'text-amber-600' : 'text-red-500'
                    }`}>
                      {selectedPath.feasibility_score}%
                    </p>
                  </div>
                </div>

                {/* Skill Overlap Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-300">Skill Overlap</span>
                    <span className="text-sm font-bold text-white">{selectedPath.skill_overlap}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-navy-800 to-teal-500 transition-all duration-700"
                      style={{ width: `${selectedPath.skill_overlap}%` }}
                    />
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Skills to Acquire</h3>
                  <div className="space-y-2">
                    {(selectedPath.skill_gaps || []).map((gap, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                        <span className="text-gray-400">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Demand */}
                <div className="mb-6 bg-white/5 rounded-xl p-3">
                  <span className="text-xs text-gray-400">Market Demand</span>
                  <p className={`text-sm font-bold ${
                    selectedPath.market_demand === 'Very High' ? 'text-emerald-600' :
                    selectedPath.market_demand === 'High' ? 'text-blue-600' :
                    'text-amber-600'
                  }`}>
                    {selectedPath.market_demand}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleStartPath(selectedPath)}
                  disabled={generating}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="spinner !w-5 !h-5 !border-white/30 !border-t-white" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      <HiAcademicCap className="w-5 h-5" />
                      Start This Path
                      <HiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tooltip */}
      <div ref={tooltipRef} className="d3-tooltip" style={{ opacity: 0, position: 'fixed' }} />
    </div>
  );
}
