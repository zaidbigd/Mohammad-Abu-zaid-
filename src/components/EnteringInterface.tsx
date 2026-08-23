import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  Sparkles,
  Layers,
  Radio,
  BookOpen,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  Users,
  Compass,
  Cpu,
  Flame,
  Waves,
  Landmark,
  Wind,
  Shield,
  FileCheck2,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { soundManager } from '../utils/audioAlerts';

interface EnteringInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndLaunch: (scenarioId: string, autoRun: boolean) => void;
  onOpenJudgeGuide: () => void;
  onEnterCustomRoom: () => void;
}

export const EnteringInterface: React.FC<EnteringInterfaceProps> = ({
  isOpen,
  onClose,
  onSelectAndLaunch,
  onOpenJudgeGuide,
  onEnterCustomRoom,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('flood-demo-1');

  if (!isOpen) return null;

  const handleLaunch = (scenarioId: string, autoRun: boolean) => {
    soundManager.playAgentComplete();
    onSelectAndLaunch(scenarioId, autoRun);
    onClose();
  };

  const handleEnterManual = () => {
    soundManager.playAgentPulse();
    onEnterCustomRoom();
    onClose();
  };

  const handleOpenJudge = () => {
    soundManager.playAgentPulse();
    onOpenJudgeGuide();
    onClose();
  };

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'earthquake':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'cyclone':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  const getDisasterBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return 'text-blue-300 border-blue-500/40 bg-blue-950/40';
      case 'earthquake':
        return 'text-amber-300 border-amber-500/40 bg-amber-950/40';
      case 'fire':
        return 'text-rose-300 border-rose-500/40 bg-rose-950/40';
      case 'cyclone':
        return 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40';
      default:
        return 'text-purple-300 border-purple-500/40 bg-purple-950/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E14]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto custom-scrollbar">
      <div className="bg-[#151B26] border border-slate-700/80 rounded-xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Status Telemetry Bar */}
        <div className="bg-[#0A0E14] px-4 py-2 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-green-400 tracking-wider uppercase">
                DEFENSE PROTOCOL: LEVEL 1 ACTIVE
              </span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-slate-800"></div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span>GEMINI 3.7 FLASH REASONING CORE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400">
              6 AUTONOMOUS AGENTS STANDBY
            </span>
            <button
              onClick={onClose}
              className="text-[10px] font-mono font-bold text-slate-400 hover:text-white uppercase px-2 py-0.5 rounded bg-[#151B26] border border-slate-700 transition hover:border-slate-600"
            >
              Skip To Terminal [ESC]
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-[#151B26] to-[#0D121B]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-widest bg-blue-600/20 text-blue-400 border border-blue-500/40 uppercase">
                  OPERATIONAL COMMAND GATEWAY
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  v2.4 RELEASE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-black shrink-0">
                  AH
                </div>
                AGENT HUB: EMERGENCY CONSENSUS SYSTEM
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl mt-1 leading-relaxed">
                Autonomous multi-agent orchestration for high-stakes crisis response. 
                Specialized AI agents collaboratively model hazard zones, allocate critical resources, compute safe transit routes, and arbitrate human-approved tactical response plans.
              </p>
            </div>

            {/* Quick Actions / Enter Room */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                id="btn-gateway-quick-launch"
                onClick={() => handleLaunch(selectedScenarioId, true)}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Live Simulation</span>
              </button>
              <button
                onClick={handleEnterManual}
                className="px-4 py-2 rounded bg-[#0A0E14] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Enter Command Console</span>
              </button>
            </div>
          </div>

          {/* 6 Specialized Agent Architecture Badges */}
          <div className="mt-4 pt-3.5 border-t border-slate-700/40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Layers className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">1. Coordinator</div>
                <div className="text-[8.5px] text-slate-400 truncate">Task Distribution</div>
              </div>
            </div>

            <div className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">2. Risk Agent</div>
                <div className="text-[8.5px] text-slate-400 truncate">Hazard Modeling</div>
              </div>
            </div>

            <div className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Users className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">3. Resource Agent</div>
                <div className="text-[8.5px] text-slate-400 truncate">Triage & Asset Audit</div>
              </div>
            </div>

            <div className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Compass className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">4. Route Agent</div>
                <div className="text-[8.5px] text-slate-400 truncate">Chokepoints & Corridors</div>
              </div>
            </div>

            <div className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Activity className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">5. Planning Agent</div>
                <div className="text-[8.5px] text-slate-400 truncate">Phase Sequencing</div>
              </div>
            </div>

            <div className="bg-[#0A0E14] p-2 rounded border border-red-500/40 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase text-white truncate">6. Decision Agent</div>
                <div className="text-[8.5px] text-red-400 font-bold truncate">Arbitration & Rank</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Select Preset Scenarios & Feature Highlights */}
        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Preset Disaster Scenarios (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span>
                <h2 className="text-xs font-black uppercase text-white tracking-wider">
                  Select Disaster Scenario Mission
                </h2>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400">
                4 PRE-CONFIGURED INCIDENTS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SCENARIOS.map((scen) => {
                const isSelected = selectedScenarioId === scen.id;
                return (
                  <div
                    key={scen.id}
                    onClick={() => setSelectedScenarioId(scen.id)}
                    className={`p-3 rounded border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0A0E14] border-blue-500 shadow-md shadow-blue-950/40 ring-1 ring-blue-500/50'
                        : 'bg-[#0A0E14]/70 border-slate-700/60 hover:border-slate-600 hover:bg-[#0A0E14]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold uppercase border flex items-center gap-1 ${getDisasterBadgeColor(
                            scen.disasterType
                          )}`}
                        >
                          {getDisasterIcon(scen.disasterType)}
                          {scen.disasterType}
                        </span>
                        <span className="text-[9px] font-mono font-black text-rose-400 bg-rose-950/40 px-1 py-0.2 rounded border border-rose-800/40">
                          {scen.severity}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white leading-snug mb-1">
                        {scen.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {scen.location} • {scen.additionalInfo}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                      <span>👥 {scen.affectedPeople.toLocaleString()} pop</span>
                      <span>🚑 {scen.rescueTeams} teams</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunch(scen.id, true);
                        }}
                        className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 font-bold uppercase transition"
                      >
                        Launch →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guide & System Safeguards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm"></span>
                <h2 className="text-xs font-black uppercase text-white tracking-wider">
                  Platform Core Pillars
                </h2>
              </div>
              <span className="text-[9.5px] font-mono text-amber-400">
                AUDITABLE & GOVERNED
              </span>
            </div>

            <div className="bg-[#0A0E14] p-3 rounded border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400 shrink-0 mt-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase">
                    1. Explainable "Why?" Matrix
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Inspect the exact contribution and findings of every individual agent behind every prioritized action.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded bg-green-600/20 border border-green-500/40 text-green-400 shrink-0 mt-0.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase">
                    2. Human Commander In The Loop
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Zero autonomous action execution without human responder review, priority-by-priority sign-off, or veto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded bg-purple-600/20 border border-purple-500/40 text-purple-400 shrink-0 mt-0.5">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase">
                    3. Synchronous Event Telemetry Bus
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Real-time stream logging captures inter-agent communication, token payloads, and tactical trade-offs.
                  </p>
                </div>
              </div>
            </div>

            {/* Judge 2-Minute Demo Card */}
            <div className="p-3 rounded bg-amber-950/20 border border-amber-500/40 flex items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  HACKATHON DEMO WALKTHROUGH
                </span>
                <h4 className="text-xs font-bold text-white">
                  2-Minute Judge Presentation Script
                </h4>
                <p className="text-[10px] text-slate-400">
                  Step-by-step evaluation guide & talking points.
                </p>
              </div>
              <button
                onClick={handleOpenJudge}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wide transition shrink-0 shadow-md"
              >
                Open Guide →
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-[#0A0E14] px-4 py-2.5 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span>READY TO DISPATCH</span>
            <span>•</span>
            <span>PRESS ENTER OR SELECT A MISSION TO BEGIN</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleEnterManual}
              className="px-3 py-1.5 rounded text-[10px] font-bold uppercase bg-[#151B26] hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            >
              Manual Input Mode
            </button>
            <button
              onClick={() => handleLaunch(selectedScenarioId, true)}
              className="px-4 py-1.5 rounded text-[10px] font-black uppercase bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-900/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Enter & Run Selected Scenario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
