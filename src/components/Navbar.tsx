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
  Menu,
  X,
  LayoutDashboard,
  Home,
  Zap,
  HelpCircle,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';

export type ActiveView = 'landing' | 'dashboard' | 'features' | 'how-it-works' | 'contact';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isRunning: boolean;
  onRunAnalysis: () => void;
  onReset: () => void;
  onLoadFloodDemo: () => void;
  onOpenGuide: () => void;
  onOpenExport: () => void;
  onOpenGateway: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const navLinks: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'features', label: 'Core Features', icon: Zap },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
    { id: 'contact', label: 'Emergency Contact', icon: Mail },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);

    // If navigating to an anchor section on the landing page
    if (view === 'features' || view === 'how-it-works' || view === 'contact') {
      const element = document.getElementById(view);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="border-b border-slate-700/60 bg-[#111722]/95 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tight shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              CM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider leading-none text-white uppercase group-hover:text-blue-400 transition-colors">
                  CrisisMatrix
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-widest bg-[#0A0E14] text-cyan-400 border border-cyan-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 hidden sm:block">
                Autonomous Multi-Agent Crisis Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0A0E14]/80 p-1 rounded-lg border border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.id === 'dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* Mission Portal Quick Trigger */}
          <button
            id="btn-nav-gateway"
            onClick={onOpenGateway}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition uppercase"
            title="Open Mission Launch Gateway"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portal</span>
          </button>

          {/* Load Flood Demo */}
          <button
            id="btn-nav-flood-demo"
            onClick={() => {
              onLoadFloodDemo();
              setActiveView('dashboard');
            }}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition uppercase disabled:opacity-50"
            title="Load the standard severe flood demo scenario"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flood Demo</span>
          </button>

          {/* Guide Checklist */}
          <button
            id="btn-nav-guide"
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition uppercase"
            title="Open 2-minute demo walkthrough"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Guide</span>
          </button>

          {/* Export Action Plan if available */}
          {hasResult && (
            <button
              id="btn-nav-export"
              onClick={onOpenExport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition uppercase"
              title="Export Incident Action Plan (IAP)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export IAP</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="btn-nav-sound"
            onClick={handleToggleSound}
            className="p-1.5 rounded bg-[#0A0E14] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-blue-400" />
            )}
          </button>

          {/* Primary Action Button */}
          {activeView === 'dashboard' ? (
            <button
              id="btn-nav-run-analysis"
              onClick={onRunAnalysis}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase transition shadow-md ${
                isRunning
                  ? 'bg-amber-600 text-white cursor-wait animate-pulse border border-amber-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin text-amber-200" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Launch Dashboard</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {activeView !== 'dashboard' && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 text-white rounded uppercase shadow"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded bg-[#0A0E14] text-slate-300 hover:text-white border border-slate-700"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0E131C] px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>UTC {timeString}</span>
              </span>
              <button
                onClick={handleToggleSound}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
                <span>{isMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onLoadFloodDemo();
                  handleNavClick('dashboard');
                }}
                className="py-1.5 px-2 bg-slate-800 text-cyan-300 rounded text-xs font-bold border border-slate-700 uppercase"
              >
                Load Flood Demo
              </button>
              <button
                onClick={() => {
                  onOpenGuide();
                  setIsMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 bg-slate-800 text-amber-300 rounded text-xs font-bold border border-slate-700 uppercase"
              >
                2-Min Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
