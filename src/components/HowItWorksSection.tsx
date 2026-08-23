import React, { useState } from 'react';
import {
  Layers,
  Radio,
  Cpu,
  Flame,
  FileCheck,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  GitBranch,
  Bot,
  Zap,
  Terminal,
} from 'lucide-react';

interface HowItWorksSectionProps {
  onLaunchDashboard: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onLaunchDashboard }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const phases = [
    {
      id: 'phase-1',
      step: '01',
      title: 'Multimodal Incident Ingestion',
      badge: 'Step 1: Telemetry Intake',
      icon: Radio,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      summary:
        'Raw telemetry from 911 dispatch calls, river depth sensors, seismic monitors, satellite imagery, and drone feeds are structured into GIS sector coordinates.',
      agentRole: 'Coordinator Agent ingest & normalizer',
      codeSnippet: `// Coordinator parses emergency payload
const incident = {
  type: "Flash Flood",
  affectedPeople: 5000,
  criticalStructures: ["Hospital Sector C", "Delta Substation"],
  roadImpassable: ["West Bypass Bridge", "Highway 12"]
};`,
      outputs: [
        'Structured GIS hazard polygons & coordinates',
        'Hospital, shelter, and staging area telemetry',
        'Critical infrastructure threat tags',
      ],
    },
    {
      id: 'phase-2',
      step: '02',
      title: 'Autonomous Multi-Agent Consensus',
      badge: 'Step 2: Cross-Agent Reasoning',
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      summary:
        'Five specialized cognitive agents (Risk, Resource, Route, Planning, Decision) evaluate the crisis concurrently. They cross-examine constraints, identify hidden vulnerabilities, and challenge tactical trade-offs.',
      agentRole: 'Collaborative Gemini 2.5 Multi-Agent Engine',
      codeSnippet: `// Agent collaborative consensus loop
await Promise.all([
  RiskAgent.evaluateIsoHazards(incident),
  ResourceAgent.auditTriageShortage(incident),
  RouteAgent.computeSafeCorridors(incident)
]);
const unifiedPlan = await DecisionAgent.synthesize();`,
      outputs: [
        'Risk Agent: Quantified Sector Danger Index (0-10)',
        'Resource Agent: Rescue squad & ICU bed triage gaps',
        'Route Agent: Blocked choke-points & green bypasses',
      ],
    },
    {
      id: 'phase-3',
      step: '03',
      title: 'D3.js Geospatial Heatmap & Route Solving',
      badge: 'Step 3: Tactical GIS Rendering',
      icon: Flame,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      summary:
        'Calculates real-time 2D Gaussian density fields and iso-risk contour bands. Visualizes high-threat epicenters with animated micro-gauges and draws primary evacuation corridors with glowing directional pulses.',
      agentRole: 'D3.js Spatial Engine + GIS Vector Layer',
      codeSnippet: `// D3 Density & Contour Generation
const contours = d3.contours()
  .size([120, 72])
  .thresholds([1.2, 2.5, 4.0, 5.5, 7.0, 8.5, 9.4])(gridValues);
const geoPath = d3.geoPath();`,
      outputs: [
        'Iso-Risk contour lines mapping severe flood surge',
        'Interactive centroid danger scores (0.0 to 10.0)',
        'Animated neon green primary rescue corridors',
      ],
    },
    {
      id: 'phase-4',
      step: '04',
      title: 'Actionable IAP Dispatch & Audit-Grade Traceability',
      badge: 'Step 4: Operational Execution',
      icon: FileCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      summary:
        'Synthesizes the complete consensus into a prioritized 3-stage Incident Action Plan (Immediate Life Safety, Stabilization, Recovery) with complete explainability and ICS-201 export capability.',
      agentRole: 'Decision Agent + IAP Formatter',
      codeSnippet: `// Synthesized Incident Action Plan
return {
  status: "CRITICAL",
  immediateActions: ["Airlift ICU patients", "Deploy Flood Booms"],
  confidenceScore: 96.4,
  explainability: "Prioritized Zone C due to medical power failure"
};`,
      outputs: [
        'ICS-201 compliant Incident Action Plan (PDF/JSON)',
        'Human-in-the-loop explainability & confidence metric',
        'Direct Computer-Aided Dispatch (CAD) payloads',
      ],
    },
  ];

  const current = phases[selectedPhase];

  return (
    <section id="how-it-works" className="py-20 bg-[#0E131C] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            Decision Intelligence Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CrisisMatrix AI Operates in Under 15 Seconds
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            From raw chaos to synchronized emergency response. Follow the deterministic four-phase pipeline that powers our autonomous decision system.
          </p>
        </div>

        {/* 4 Interactive Process Steps Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            const isSelected = selectedPhase === idx;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(idx)}
                className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151B26] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : 'bg-[#111722]/80 border-slate-800 hover:border-slate-700 hover:bg-[#131924]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-2xl font-black text-slate-500 font-mono">
                    {phase.step}
                  </span>
                  <div className={`p-2 rounded-lg ${phase.bgColor} ${phase.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    {phase.badge.split(':')[0]}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {phase.title}
                  </h4>
                </div>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Interactive Step Spotlight */}
        <div className="bg-[#151B26] border border-slate-700 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase ${current.bgColor} ${current.color} border ${current.borderColor}`}>
                  {current.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Engine: {current.agentRole}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {current.title}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {current.summary}
              </p>

              {/* Key Deliverables */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Phase Outputs & Guarantees:
                </div>
                {current.outputs.map((out, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{out}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onLaunchDashboard}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition shadow-md shadow-blue-600/30"
                >
                  <span>Launch Live Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPhase((prev) => (prev + 1) % phases.length)}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition"
                >
                  Next Step ({selectedPhase === 3 ? '1' : selectedPhase + 2})
                </button>
              </div>
            </div>

            {/* Right Interactive Code / Trace Box */}
            <div className="lg:col-span-5 bg-[#0A0E14] border border-slate-800 rounded-xl p-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Execution Trace snippet
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  PASS
                </span>
              </div>

              <pre className="p-3 bg-[#111722] rounded-lg text-[11px] text-cyan-300 overflow-x-auto leading-relaxed border border-slate-800/80">
                <code>{current.codeSnippet}</code>
              </pre>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Latency: ~2.4s</span>
                <span>Deterministic Fallback: Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
