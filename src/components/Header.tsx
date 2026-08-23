import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Layers,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';

interface HeaderProps {
  isRunning: boolean;
  onRunAnalysis: () => void;
  onReset: () => void;
  onLoadFloodDemo: () => void;
  onOpenGuide: () => void;
  onOpenExport: () => void;
  onOpenGateway: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  onRunAnalysis,
  onReset,
  onLoadFloodDemo,
  onOpenGuide,
  onOpenExport,
  onOpenGateway,
  hasResult,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="border-b border-slate-700/50 bg-[#151B26] px-4 py-2 sticky top-0 z-40 shrink-0">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xs tracking-tight shadow-lg shadow-blue-500/20 shrink-0">
            AH
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tighter leading-none text-white uppercase flex items-center gap-2">
                Agent Hub
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-widest bg-[#0A0E14] text-slate-400 border border-slate-700">
                  v2.4
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight flex items-center gap-1.5 mt-0.5">
              Multi-Agent Disaster Decision Hub
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="hidden sm:inline-flex text-[9.5px] text-amber-400 font-mono items-center gap-1">
                SIMULATION / DEMO DATA
              </span>
            </p>
          </div>
        </div>

        {/* Center Live Status & Telemetry */}
        <div className="hidden lg:flex items-center gap-3 bg-[#0A0E14] border border-slate-700/60 px-3 py-1 rounded">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">
              SYSTEM OPERATIONAL
            </span>
          </div>
          <div className="h-3 w-px bg-slate-800"></div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>UTC {timeString || '00:00:00'}</span>
          </div>
          <div className="h-3 w-px bg-slate-800"></div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>6 AI AGENTS ONLINE</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-end">
          {/* Mission Launch Portal / Entering Interface */}
          <button
            id="btn-open-gateway"
            onClick={onOpenGateway}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition uppercase shadow-sm"
            title="Open Mission Launch Gateway & Scenario Selector"
          >
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Launch Portal</span>
          </button>

          {/* Load Flood Demo Quick Button */}
          <button
            id="btn-load-flood-demo"
            onClick={onLoadFloodDemo}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition uppercase disabled:opacity-50"
            title="Load the standard severe flood demo scenario"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Flood Demo</span>
          </button>

          {/* 2-Min Demo Walkthrough Guide */}
          <button
            id="btn-open-judge-guide"
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition uppercase"
            title="Open 2-minute hackathon judge demo checklist"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>Guide</span>
          </button>

          {/* Export Briefing button if result available */}
          {hasResult && (
            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition uppercase"
              title="Export Incident Action Plan (IAP)"
            >
              <FileSpreadsheet className="w-3 h-3 text-indigo-400" />
              <span>Export IAP</span>
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleSound}
            className="p-1 rounded bg-[#0A0E14] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            )}
          </button>

          {/* Reset Simulation */}
          <button
            id="btn-reset-simulation"
            onClick={onReset}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 transition uppercase disabled:opacity-50"
            title="Reset active scenario and agent network"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>

          {/* Primary Run Analysis Button */}
          <button
            id="btn-header-run-analysis"
            onClick={onRunAnalysis}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase transition shadow-md ${
              isRunning
                ? 'bg-amber-600 text-white cursor-wait animate-pulse border border-amber-400/50'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {isRunning ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin text-amber-200" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white text-white" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
