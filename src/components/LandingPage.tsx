import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  FileSpreadsheet,
  Cpu,
  Radio,
  Clock,
  AlertTriangle,
  Waves,
  Building2,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { EmergencyScenario } from '../types/emergency';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ContactSection } from './ContactSection';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectScenarioAndLaunch: (scenario: EmergencyScenario) => void;
  onOpenGuide: () => void;
  onOpenGateway: () => void;
  currentScenario: EmergencyScenario;
  isRunning: boolean;
  hasResult: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onSelectScenarioAndLaunch,
  onOpenGuide,
  onOpenGateway,
  currentScenario,
  isRunning,
  hasResult,
}) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);

  const scenarioIcons = [Waves, Building2, Flame, AlertTriangle];

  const handleScenarioSelect = (idx: number) => {
    setSelectedPresetIdx(idx);
    const scen = PRESET_SCENARIOS[idx] || PRESET_SCENARIOS[0];
    onSelectScenarioAndLaunch(scen);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Background ambient tactical glows & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>NIMS-COMPLIANT MULTI-AGENT CRISIS MATRIX</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Autonomous Multi-Agent{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Disaster Intelligence
                </span>{' '}
                & Decision Support
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Synchronizes six collaborative AI agents and real-time D3.js geospatial risk heatmaps to evaluate hazard perimeters, clear evacuation corridors, balance triage shortages, and generate actionable Incident Action Plans in seconds.
              </p>

              {/* Live Metric Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
                <div className="bg-[#151B26]/80 p-3 rounded-xl border border-slate-800 backdrop-blur text-left">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">AI Consensus</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400">6 Agents</div>
                </div>
                <div className="bg-[#151B26]/80 p-3 rounded-xl border border-slate-800 backdrop-blur text-left">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">GIS Heatmap</div>
                  <div className="text-lg sm:text-xl font-black text-cyan-400">D3.js Iso</div>
                </div>
                <div className="bg-[#151B26]/80 p-3 rounded-xl border border-slate-800 backdrop-blur text-left">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Synthesis Speed</div>
                  <div className="text-lg sm:text-xl font-black text-amber-400">&lt; 15s</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={onLaunchDashboard}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 group"
                >
                  <Play className="w-4 h-4 fill-white text-white group-hover:translate-x-0.5 transition-transform" />
                  <span>Launch Live Command Center</span>
                </button>

                <button
                  onClick={() => {
                    const scen = PRESET_SCENARIOS[0];
                    onSelectScenarioAndLaunch(scen);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Run Flash Flood Demo</span>
                </button>

                <button
                  onClick={onOpenGuide}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm uppercase transition flex items-center justify-center gap-2"
                >
                  <span>2-Min Guide</span>
                </button>
              </div>
            </div>

            {/* Right Hero Interactive Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#151B26] border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      ACTIVE CRISIS TELEMETRY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    REAL-TIME
                  </span>
                </div>

                {/* Scenario Snapshot */}
                <div className="bg-[#0A0E14] rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Current Scenario
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {currentScenario.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {currentScenario.location}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold">
                      {currentScenario.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-[#111722] rounded border border-slate-800">
                      <div className="text-[9px] text-slate-500 font-mono">Affected</div>
                      <div className="font-bold text-white font-mono">{currentScenario.affectedPeople.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-[#111722] rounded border border-slate-800">
                      <div className="text-[9px] text-slate-500 font-mono">Injured</div>
                      <div className="font-bold text-amber-400 font-mono">{currentScenario.injuredPeople}</div>
                    </div>
                    <div className="p-2 bg-[#111722] rounded border border-slate-800">
                      <div className="text-[9px] text-slate-500 font-mono">Rescue Units</div>
                      <div className="font-bold text-cyan-400 font-mono">{currentScenario.rescueTeams} Squads</div>
                    </div>
                  </div>
                </div>

                {/* 6 Agent Network Mini-Radar */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-slate-400">Agent Network Mesh</span>
                    <span className="text-emerald-400">6/6 Ready</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: 'Coordinator', role: 'Dispatch', color: 'text-blue-400' },
                      { name: 'Risk Agent', role: 'D3 Iso Matrix', color: 'text-amber-400' },
                      { name: 'Resource', role: 'Triage Balancer', color: 'text-purple-400' },
                      { name: 'Route Agent', role: 'Evac Solver', color: 'text-emerald-400' },
                      { name: 'Planning', role: '3-Stage IAP', color: 'text-cyan-400' },
                      { name: 'Decision', role: 'Arbitration', color: 'text-indigo-400' },
                    ].map((ag, i) => (
                      <div
                        key={i}
                        className="bg-[#0A0E14] p-2 rounded border border-slate-800 text-[10px]"
                      >
                        <div className={`font-bold ${ag.color}`}>{ag.name}</div>
                        <div className="text-[8.5px] text-slate-400 truncate">{ag.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Dashboard Action */}
                <button
                  onClick={onLaunchDashboard}
                  className="w-full mt-4 py-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold uppercase transition flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Tactical GIS & Agents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRESET DISASTER SCENARIOS QUICK-SELECTOR SHOWCASE */}
      <section className="py-16 bg-[#111722] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
                Mission Presets
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Simulate Multi-Domain Disaster Scenarios
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Choose any preset disaster below to automatically populate the tactical GIS grid, calibrate risk contours, and trigger multi-agent consensus.
              </p>
            </div>
            <button
              onClick={onOpenGateway}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase border border-slate-700 transition flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Scenario Catalog</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_SCENARIOS.map((scen, idx) => {
              const Icon = scenarioIcons[idx % scenarioIcons.length];
              const isSelected = selectedPresetIdx === idx;

              return (
                <div
                  key={scen.id}
                  className={`bg-[#151B26] rounded-xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/30">
                        {scen.severity}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {scen.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {scen.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#0A0E14] p-2.5 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-500">Pop:</span>
                        <div className="text-white font-bold">{scen.affectedPeople.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Squads:</span>
                        <div className="text-cyan-400 font-bold">{scen.rescueTeams} Teams</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleScenarioSelect(idx)}
                    className={`mt-4 w-full py-2 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <span>Load & Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <FeaturesSection onLaunchDemo={onLaunchDashboard} />

      {/* 4. HOW IT WORKS SECTION */}
      <HowItWorksSection onLaunchDashboard={onLaunchDashboard} />

      {/* 5. CONTACT & DISPATCH INTEGRATION SECTION */}
      <ContactSection />
    </div>
  );
};
