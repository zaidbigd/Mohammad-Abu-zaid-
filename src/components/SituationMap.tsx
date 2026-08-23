import React, { useState } from 'react';
import {
  Map as MapIcon,
  Layers,
  Hospital,
  Home,
  Shield,
  AlertOctagon,
  Eye,
  Info,
  Maximize2,
  Navigation,
  Flame,
  Activity,
  Sliders,
} from 'lucide-react';
import {
  AgentDetailedOutput,
  AgentStatus,
  EmergencyScenario,
  MapFacility,
  MapZone,
  MultiAgentAnalysisResult,
} from '../types/emergency';
import { D3RiskHeatmap } from './D3RiskHeatmap';

interface SituationMapProps {
  scenario: EmergencyScenario;
  isAnalyzing: boolean;
  activeAgentId?: string;
  riskAgentOutput?: AgentDetailedOutput;
  riskAgentStatus?: AgentStatus;
  analysisResult?: MultiAgentAnalysisResult | null;
}

type LayerMode = 'all' | 'heatmap' | 'zones' | 'routes' | 'facilities';

export const SituationMap: React.FC<SituationMapProps> = ({
  scenario,
  isAnalyzing,
  activeAgentId,
  riskAgentOutput,
  riskAgentStatus,
  analysisResult,
}) => {
  const [activeLayer, setActiveLayer] = useState<LayerMode>('all');
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState<boolean>(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [heatmapMode, setHeatmapMode] = useState<'both' | 'contours' | 'density'>('both');
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [selectedFacility, setSelectedFacility] =
    useState<MapFacility | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<{
    zoneName: string;
    dangerIndex: number;
    x: number;
    y: number;
  } | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Fallback safe arrays
  const zones = scenario?.zones || [];
  const roadObstacles = scenario?.roadObstacles || [];
  const rescueRoutes = scenario?.rescueRoutes || [];
  const facilities = scenario?.facilities || [];

  // Effective risk output (from either direct prop or analysisResult)
  const activeRiskOutput = riskAgentOutput || analysisResult?.agentOutputs?.risk;

  // SVG dimensions for tactical grid
  const viewBoxWidth = 600;
  const viewBoxHeight = 360;

  // Should we render the D3 Heatmap?
  const shouldRenderHeatmap =
    activeLayer === 'heatmap' ||
    (showHeatmapOverlay && (activeLayer === 'all' || activeLayer === 'zones'));

  return (
    <div className="bg-[#151B26] border border-slate-700/50 rounded p-3 flex flex-col gap-2.5 h-full relative overflow-hidden">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <MapIcon className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase text-white tracking-wider leading-none">
                Tactical GIS Grid & D3 Heatmap
              </h2>
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#0A0E14] text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                D3.js Risk Matrix
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Sector Coordinates, Vulnerability Density & Evacuation Corridors
            </p>
          </div>
        </div>

        {/* Layer Filters & D3 Heatmap Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-0.5 bg-[#0A0E14] p-0.5 rounded border border-slate-700 text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition ${
                activeLayer === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition flex items-center gap-1 ${
                activeLayer === 'heatmap'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Flame className="w-2.5 h-2.5" />
              Heatmap
            </button>
            <button
              onClick={() => setActiveLayer('zones')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition ${
                activeLayer === 'zones'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Zones
            </button>
            <button
              onClick={() => setActiveLayer('routes')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition ${
                activeLayer === 'routes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Routes
            </button>
            <button
              onClick={() => setActiveLayer('facilities')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase transition ${
                activeLayer === 'facilities'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Facilities
            </button>
          </div>

          {/* D3 Heatmap Quick Settings Pill */}
          <div className="flex items-center gap-1 bg-[#0A0E14] px-1.5 py-0.5 rounded border border-slate-700/80 text-[10px]">
            <button
              onClick={() => setShowHeatmapOverlay((prev) => !prev)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition flex items-center gap-1 ${
                showHeatmapOverlay
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle D3 Risk Heatmap Layer Overlay"
            >
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              <span>D3 Heat: {showHeatmapOverlay ? 'ON' : 'OFF'}</span>
            </button>

            {showHeatmapOverlay && (
              <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                <button
                  onClick={() =>
                    setHeatmapOpacity((prev) =>
                      prev >= 0.9 ? 0.35 : prev >= 0.6 ? 0.9 : 0.65
                    )
                  }
                  className="text-[9px] font-mono text-slate-300 hover:text-white px-1 py-0.5 rounded bg-slate-900 border border-slate-800"
                  title="Cycle Heatmap Opacity"
                >
                  {Math.round(heatmapOpacity * 100)}%
                </button>
                <button
                  onClick={() =>
                    setHeatmapMode((prev) =>
                      prev === 'both'
                        ? 'contours'
                        : prev === 'contours'
                        ? 'density'
                        : 'both'
                    )
                  }
                  className="text-[9px] font-mono uppercase text-cyan-400 hover:text-cyan-300 px-1 py-0.5 rounded bg-slate-900 border border-slate-800"
                  title="Cycle Heatmap Mode: Contours / Density / Both"
                >
                  {heatmapMode}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Stage */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] bg-[#0A0E14] rounded border border-slate-700/60 overflow-hidden select-none">
        {/* Subtle Map Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        {/* Scanline Radar / Analysis Sweep Overlay when analyzing */}
        {isAnalyzing && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 animate-[scan_2.5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-2 right-2 bg-[#0A0E14]/90 text-blue-300 border border-blue-500/50 px-2 py-0.5 rounded text-[9.5px] font-mono flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              <span>AGENT SCAN: {activeAgentId?.toUpperCase() || 'SYNCHRONIZING'}</span>
            </div>
          </div>
        )}

        {/* SVG Tactical Rendering Canvas */}
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid pattern */}
            <pattern
              id="tactical-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(51, 65, 85, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Glowing filter for high risk zones */}
            <filter id="danger-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing filter for clear routes */}
            <filter id="route-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#tactical-grid)" />

          {/* D3.js RISK HEATMAP LAYER */}
          {shouldRenderHeatmap && (
            <D3RiskHeatmap
              scenario={scenario}
              riskAgentOutput={activeRiskOutput}
              riskAgentStatus={riskAgentStatus}
              isAnalyzing={isAnalyzing}
              activeAgentId={activeAgentId}
              viewBoxWidth={viewBoxWidth}
              viewBoxHeight={viewBoxHeight}
              opacity={heatmapOpacity}
              visualizationMode={heatmapMode}
              showContourLines={true}
              showIsoLabels={activeLayer === 'heatmap' || activeLayer === 'all'}
              onHoverHotspot={(hotspot) => setHoveredHotspot(hotspot)}
            />
          )}

          {/* 1. SECTOR ZONES (Rendered when layer is 'all' or 'zones') */}
          {(activeLayer === 'all' || activeLayer === 'zones') &&
            zones.map((zone) => {
              const isCritical = zone.riskLevel === 'CRITICAL';
              const isHigh = zone.riskLevel === 'HIGH';
              const isSelected = selectedZone?.id === zone.id;

              return (
                <g
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    setSelectedFacility(null);
                  }}
                  onMouseEnter={() => setIsHovering(zone.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Zone Polygon */}
                  <polygon
                    points={zone.polygon}
                    fill={
                      shouldRenderHeatmap
                        ? 'rgba(15, 23, 42, 0.15)' // Subtle fill when D3 heatmap is active to prevent over-saturation
                        : isCritical
                        ? 'rgba(239, 68, 68, 0.22)'
                        : isHigh
                        ? 'rgba(249, 115, 22, 0.18)'
                        : zone.riskLevel === 'MEDIUM'
                        ? 'rgba(245, 158, 11, 0.14)'
                        : 'rgba(16, 185, 129, 0.12)'
                    }
                    stroke={zone.color}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    strokeDasharray={zone.riskLevel === 'SAFE' ? '3,3' : undefined}
                    className="hover:opacity-80 transition"
                  />

                  {/* Pulsing indicator at zone centroid for critical zones (when heatmap is OFF) */}
                  {!shouldRenderHeatmap && isCritical && (
                    <circle
                      cx={zone.centroid.x}
                      cy={zone.centroid.y}
                      r="16"
                      fill="rgba(239, 68, 68, 0.35)"
                      className="animate-ping"
                    />
                  )}

                  {/* Zone Tag Label */}
                  <g
                    transform={`translate(${zone.centroid.x}, ${zone.centroid.y})`}
                  >
                    <rect
                      x="-44"
                      y="-11"
                      width="88"
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      stroke={zone.color}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="3"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {zone.code} • {zone.riskLevel}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* 2. ROAD OBSTACLES & BLOCKS (Rendered when layer is 'all' or 'routes') */}
          {(activeLayer === 'all' || activeLayer === 'routes') &&
            roadObstacles.map((obs) => {
              const isBlocked = obs.status === 'blocked';
              return (
                <g key={obs.id}>
                  {/* Obstacle line stripe */}
                  <line
                    x1={obs.from[0]}
                    y1={obs.from[1]}
                    x2={obs.to[0]}
                    y2={obs.to[1]}
                    stroke={isBlocked ? '#ef4444' : '#f59e0b'}
                    strokeWidth="4"
                    strokeDasharray="4,4"
                    opacity="0.85"
                  />
                  {/* Danger Cross Barricade Icon */}
                  <circle
                    cx={(obs.from[0] + obs.to[0]) / 2}
                    cy={(obs.from[1] + obs.to[1]) / 2}
                    r="8"
                    fill="#1e1b4b"
                    stroke={isBlocked ? '#ef4444' : '#f59e0b'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={(obs.from[0] + obs.to[0]) / 2}
                    y={(obs.from[1] + obs.to[1]) / 2 + 3}
                    fill={isBlocked ? '#ef4444' : '#f59e0b'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ✕
                  </text>
                </g>
              );
            })}

          {/* 3. RECOMMENDED RESCUE & EVAC ROUTES */}
          {(activeLayer === 'all' || activeLayer === 'routes') &&
            rescueRoutes.map((route) => {
              const pointsStr = route.points
                .map((pt) => `${pt[0]},${pt[1]}`)
                .join(' ');
              const isPrimary = route.status === 'primary_recommended';

              return (
                <g key={route.id}>
                  {/* Glowing background line */}
                  <polyline
                    points={pointsStr}
                    fill="none"
                    stroke={isPrimary ? '#10b981' : '#06b6d4'}
                    strokeWidth="3.5"
                    opacity="0.75"
                    filter="url(#route-glow)"
                  />
                  {/* Animated dashed corridor line */}
                  <polyline
                    points={pointsStr}
                    fill="none"
                    stroke={isPrimary ? '#34d399' : '#38bdf8'}
                    strokeWidth="2.2"
                    strokeDasharray="6,4"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                  {/* Route Label Marker at start */}
                  <circle
                    cx={route.points[0][0]}
                    cy={route.points[0][1]}
                    r="4"
                    fill="#34d399"
                  />
                </g>
              );
            })}

          {/* 4. KEY EMERGENCY FACILITIES (Hospitals, Shelters, Staging) */}
          {(activeLayer === 'all' || activeLayer === 'facilities') &&
            facilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              const isHospital = fac.type === 'hospital';
              const isShelter = fac.type === 'shelter';

              const iconBg = isHospital
                ? '#dc2626'
                : isShelter
                ? '#059669'
                : '#2563eb';

              return (
                <g
                  key={fac.id}
                  transform={`translate(${fac.x}, ${fac.y})`}
                  onClick={() => {
                    setSelectedFacility(fac);
                    setSelectedZone(null);
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? '14' : '11'}
                    fill="#0f172a"
                    stroke={iconBg}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <rect
                    x="-6"
                    y="-6"
                    width="12"
                    height="12"
                    rx="2"
                    fill={iconBg}
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isHospital ? 'H' : isShelter ? 'S' : 'R'}
                  </text>
                  <text
                    x="0"
                    y="18"
                    fill="#94a3b8"
                    fontSize="7.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {fac.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-800/90 p-2 rounded-lg text-[10px] text-slate-300 font-mono flex flex-col gap-1 backdrop-blur pointer-events-none z-10 shadow-lg">
          <div className="font-bold text-white text-[11px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>INCIDENT GIS OVERLAY</span>
            </div>
            {shouldRenderHeatmap && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-600/50">
                D3 HEATMAP ACTIVE
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9.5px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Critical Zone
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              High / Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-emerald-400"></span>
              Safe Rescue Route
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-400 font-bold">✕</span>
              Road Obstacle
            </span>
          </div>
        </div>

        {/* D3 Danger Index Thermal Color Scale Bar (Top Right) */}
        {shouldRenderHeatmap && (
          <div className="absolute top-2 right-2 bg-slate-950/90 border border-slate-800/90 p-2 rounded-lg text-[10px] text-slate-300 font-mono flex flex-col gap-1 backdrop-blur z-10 shadow-lg max-w-[210px]">
            <div className="flex items-center justify-between text-[10px] font-bold text-white">
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3 h-3" />
                D3 RISK DANGER INDEX
              </span>
              <span className="text-[9px] text-cyan-400">0.0 - 10.0</span>
            </div>

            {/* D3 Continuous Gradient Bar */}
            <div className="w-full h-2.5 rounded overflow-hidden bg-gradient-to-r from-emerald-500 via-amber-400 via-red-500 to-purple-600 border border-slate-700"></div>

            <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>0.0 Safe</span>
              <span>4.0 Med</span>
              <span>7.5 High</span>
              <span className="text-red-400 font-bold">10.0 Crit</span>
            </div>

            {activeRiskOutput && (
              <div className="mt-0.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[8.5px]">
                <span className="text-slate-400">Risk Agent Calibration:</span>
                <span className="text-emerald-400 font-bold">
                  {activeRiskOutput.confidenceScore ? `${activeRiskOutput.confidenceScore}% Conf` : 'Active'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hotspot Floating Tooltip when hovering over D3 Danger Index node */}
        {hoveredHotspot && (
          <div
            className="absolute bg-slate-950/95 border border-amber-500/80 p-2 rounded shadow-2xl backdrop-blur text-[10px] font-mono text-white pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${(hoveredHotspot.x / viewBoxWidth) * 100}%`,
              top: `${(hoveredHotspot.y / viewBoxHeight) * 100}%`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <AlertOctagon className="w-3 h-3" />
              <span>{hoveredHotspot.zoneName}</span>
            </div>
            <div className="mt-0.5 text-slate-300">
              Risk Danger Score:{' '}
              <strong className="text-red-400 font-bold">
                {hoveredHotspot.dangerIndex.toFixed(1)} / 10.0
              </strong>
            </div>
            <div className="text-[9px] text-cyan-300">
              Risk Agent Severity:{' '}
              {hoveredHotspot.dangerIndex >= 8.5
                ? 'CRITICAL / EXTREME'
                : hoveredHotspot.dangerIndex >= 6.5
                ? 'HIGH'
                : 'MODERATE'}
            </div>
          </div>
        )}

        {/* Selected Inspector Floating Card */}
        {(selectedZone || selectedFacility) && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/95 border border-cyan-500/50 p-3 rounded-lg shadow-2xl backdrop-blur flex items-start justify-between gap-3 text-xs z-30">
            {selectedZone && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      selectedZone.riskLevel === 'CRITICAL'
                        ? 'bg-red-500 text-white'
                        : selectedZone.riskLevel === 'HIGH'
                        ? 'bg-amber-500 text-black'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedZone.riskLevel}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedZone.name}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Pop: {typeof selectedZone?.population === 'number' ? selectedZone.population.toLocaleString() : (selectedZone?.population ?? 'N/A')}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] flex flex-wrap gap-1 mt-1">
                  {(selectedZone?.hazards || []).map((h, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300"
                    >
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedFacility && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      selectedFacility.status === 'operational'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-black'
                    }`}
                  >
                    {selectedFacility.status}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedFacility.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {selectedFacility.description}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>
                    Capacity: {selectedFacility.currentUsage} /{' '}
                    {selectedFacility.capacity}
                  </span>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedFacility.currentUsage /
                            selectedFacility.capacity) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedZone(null);
                setSelectedFacility(null);
              }}
              className="text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded text-[11px]"
            >
              ✕ Close
            </button>
          </div>
        )}
      </div>

      {/* Quick Situation Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
        <div className="bg-[#0A0E14] p-1.5 rounded border border-slate-700/60">
          <div className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">
            Hazard Zones
          </div>
          <div className="text-xs font-black text-red-400 font-mono">
            {zones.filter((z) => z.riskLevel !== 'SAFE').length} Sectors
          </div>
        </div>
        <div className="bg-[#0A0E14] p-1.5 rounded border border-slate-700/60">
          <div className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">
            Road Chokepoints
          </div>
          <div className="text-xs font-black text-amber-400 font-mono">
            {roadObstacles.filter((o) => o.status === 'blocked').length}{' '}
            Blocked
          </div>
        </div>
        <div className="bg-[#0A0E14] p-1.5 rounded border border-slate-700/60">
          <div className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">
            Evac Corridors
          </div>
          <div className="text-xs font-black text-emerald-400 font-mono">
            {
              rescueRoutes.filter(
                (r) => r.status === 'primary_recommended'
              ).length
            }{' '}
            Open
          </div>
        </div>
        <div className="bg-[#0A0E14] p-1.5 rounded border border-slate-700/60">
          <div className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">
            Active Shelters
          </div>
          <div className="text-xs font-black text-blue-400 font-mono">
            {facilities.filter((f) => f.type === 'shelter').length}{' '}
            Verified
          </div>
        </div>
      </div>
    </div>
  );
};

