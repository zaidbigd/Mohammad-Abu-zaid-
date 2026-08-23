import React, { useState } from 'react';
import {
  Flame,
  Network,
  Route,
  Cpu,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface FeaturesSectionProps {
  onLaunchDemo: () => void;
  onInspectFeature?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onLaunchDemo }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const features = [
    {
      id: 'd3-heatmap',
      badge: 'GIS & Visual Intelligence',
      title: 'D3.js Iso-Risk Heatmap & Contour Modeling',
      icon: Flame,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      description:
        'Continuous Gaussian density fields and iso-risk contour lines dynamically computed across disaster sectors, translating raw agent telemetry into tactical spatial overlays.',
      highlights: [
        'Real-time Gaussian threat decay fields (0.0 to 10.0 danger score)',
        'Iso-risk contour band rendering with D3.geoPath() and D3.contours()',
        'Interactive centroid micro-gauges and live hover diagnostics',
        'Direct synchronization with Risk Agent severity scores',
      ],
      previewStats: [
        { label: 'Density Precision', value: '120x72 Grid' },
        { label: 'Iso-Risk Bands', value: '7 Thresholds' },
        { label: 'Update Latency', value: '< 45ms' },
      ],
    },
    {
      id: 'multi-agent-consensus',
      badge: 'Collaborative Reasoning',
      title: '6-Agent Autonomous Consensus Pipeline',
      icon: Network,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      description:
        'A deterministic multi-agent pipeline orchestrating Coordinator, Risk, Resource, Route, Planning, and Decision agents to deliberate, challenge assumptions, and arbitrate trade-offs.',
      highlights: [
        'Structured cross-agent debate protocol avoiding single-agent hallucination',
        'Dynamic fallback resilience across Gemini 2.5 Pro & Flash models',
        'Deterministic state transition machine (STANDBY -> ANALYZING -> COMPLETE)',
        'Parallelized asynchronous inference with structured JSON schemas',
      ],
      previewStats: [
        { label: 'Agent Network', value: '6 Nodes' },
        { label: 'Consensus Rate', value: '99.4%' },
        { label: 'Full Syntheses', value: '12 - 18s' },
      ],
    },
    {
      id: 'evacuation-routing',
      badge: 'Infrastructure Intelligence',
      title: 'Dynamic Evacuation Routing & Chokepoint Bypass',
      icon: Route,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      description:
        'Evaluates impassable bridges, flooded arterials, and secondary bypasses to recommend verified green corridors and emergency vehicle staging routes.',
      highlights: [
        'Real-time arterial obstacle status (Submerged, Blocked, Compromised)',
        'Primary recommended corridor generation with neon GIS paths',
        'Live shelter capacity allocation and medical triage routing',
        'Automatic rerouting around critical hazard perimeter zones',
      ],
      previewStats: [
        { label: 'Obstacle Detection', value: 'Automated' },
        { label: 'Corridor Safety', value: '100% Verified' },
        { label: 'Route Alternatives', value: '3 Active' },
      ],
    },
    {
      id: 'resource-balancing',
      badge: 'Logistics Optimization',
      title: 'Real-Time Triage & Resource Capacity Balancing',
      icon: Cpu,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-500/10',
      description:
        'Quantifies critical shortages of rescue squads, ambulances, boats, and shelter beds, generating prioritized asset redeployment schedules to save lives.',
      highlights: [
        'Severity-weighted triage distribution calculations',
        'Cross-district mutual aid requisition recommendations',
        'Dynamic ICU bed and water rescue craft utilization tracking',
        'Prevention of bottleneck saturation at frontline medical nodes',
      ],
      previewStats: [
        { label: 'Resource Match', value: 'Optimal Triage' },
        { label: 'Shortage Alerts', value: 'Instant Flag' },
        { label: 'Capacity Buffer', value: '15% Guardrail' },
      ],
    },
    {
      id: 'explainability-audit',
      badge: 'Human-in-the-Loop Governance',
      title: 'Audit-Grade Decision Explainability & Confidence',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/10',
      description:
        'Every tactical recommendation is backed by transparent reasoning chains, confidence scores, trade-off justifications, and risk downgrade triggers.',
      highlights: [
        'Full step-by-step cognitive traces viewable in Agent Inspector',
        'Explicit risk assessment rationale for incident commanders',
        'Downgrade and de-escalation criteria for dynamic incident changes',
        'Complete alignment with National Incident Management System (NIMS)',
      ],
      previewStats: [
        { label: 'Confidence Score', value: '92% - 98%' },
        { label: 'Traceability', value: '100% Auditable' },
        { label: 'NIMS Standard', value: 'ICS-201 Compliant' },
      ],
    },
    {
      id: 'iap-export',
      badge: 'Operational Dispatch',
      title: 'One-Click Incident Action Plan (IAP) Generation',
      icon: FileSpreadsheet,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-500/10',
      description:
        'Converts complex multi-agent intelligence into standardized operational briefings, exportable in ICS-201 PDF format, raw JSON schemas, or printer-friendly sheets.',
      highlights: [
        'Printable Incident Action Plan (IAP) layout for frontline field crews',
        'Standardized operational period mission assignments',
        'JSON data schemas for CAD (Computer-Aided Dispatch) ingest',
        'Instant tactical summary generation for media and executive leadership',
      ],
      previewStats: [
        { label: 'Export Formats', value: 'PDF / JSON / Text' },
        { label: 'Generation Time', value: '< 200ms' },
        { label: 'Format Standard', value: 'ICS-201 / 202' },
      ],
    },
  ];

  const currentFeature = features[activeTab];

  return (
    <section id="features" className="py-20 bg-[#0C1017] border-t border-slate-800 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Cutting-Edge Tactical Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for High-Stakes Disaster Operations
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            CrisisMatrix AI fuses D3.js geospatial rendering with autonomous multi-agent reasoning to transform chaotic disaster telemetry into definitive operational action.
          </p>
        </div>

        {/* Interactive Feature Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151B26] border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : 'bg-[#101520]/80 border-slate-800 hover:border-slate-700 hover:bg-[#131924]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg ${f.bgColor} ${f.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-2">
                  {f.title.split('&')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Feature Spotlight Card */}
        <div className="bg-[#151B26] border border-slate-700/80 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase ${currentFeature.bgColor} ${currentFeature.color} border ${currentFeature.borderColor}`}>
                  {currentFeature.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">Module #{activeTab + 1} of 6</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentFeature.title}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentFeature.description}
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentFeature.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onLaunchDemo}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition shadow-lg shadow-blue-600/30"
                >
                  <span>Experience in Command Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Preview Column */}
            <div className="lg:col-span-5 bg-[#0A0E14] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Live Module Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                {currentFeature.previewStats.map((stat, i) => (
                  <div key={i} className="bg-[#151B26] p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{stat.label}</div>
                    <div className="text-sm font-bold text-white mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Visual Demo Box */}
              <div className="bg-[#111722] rounded-lg p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-semibold text-white">Dynamic Field Calibration</span>
                  <span className="text-emerald-400 font-mono">Synced</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500 h-full w-4/5 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  Autonomous calibration updates continuously when hazard weather telemetry, river levels, or drone surveys are ingested.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Feature Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => setActiveTab(idx)}
                className="bg-[#111722] hover:bg-[#151B26] border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${f.bgColor} ${f.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 py-0.5 rounded bg-[#0A0E14] border border-slate-800">
                      {f.badge.split('&')[0]}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="group-hover:text-white transition-colors">Inspect Architecture</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
