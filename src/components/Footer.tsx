import React from 'react';
import {
  ShieldAlert,
  Radio,
  Github,
  Globe,
  FileSpreadsheet,
  Layers,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { ActiveView } from './Navbar';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onOpenGateway: () => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenGateway,
  onOpenGuide,
}) => {
  return (
    <footer className="bg-[#090D14] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tight shadow-md shadow-blue-500/20">
                CM
              </div>
              <span className="text-base font-black tracking-wider text-white uppercase">
                CrisisMatrix AI
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-[#0A0E14] text-cyan-400 border border-cyan-500/30">
                v2.4.0
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation autonomous multi-agent decision support platform for emergency management, disaster response coordination, and geospatial risk modeling.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 6 Cognitive Agents Online & Calibrated</span>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="space-y-3">
            <div className="text-white font-bold font-mono uppercase text-xs tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Overview & Hero
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 text-cyan-300"
                >
                  <span>Command Dashboard</span>
                  <span className="text-[9px] px-1 py-0.2 bg-blue-900/50 rounded text-blue-300 font-mono">
                    LIVE
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Core Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-blue-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact & Dispatch
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Tools & Utilities */}
          <div className="space-y-3">
            <div className="text-white font-bold font-mono uppercase text-xs tracking-wider">
              Tactical Utilities
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGateway}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Mission Launch Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3 text-amber-400" />
                  <span>2-Min Demo Walkthrough</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  D3.js Iso-Risk Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Incident Action Plan (IAP)
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div className="space-y-3">
            <div className="text-white font-bold font-mono uppercase text-xs tracking-wider">
              Standards & Integrity
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>NIMS / ICS-201 Standard</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Zero PII Telemetry Ingestion</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>Deterministic Fallback Logic</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Gemini 2.5 Multi-Agent Mesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} CrisisMatrix AI. Engineered for Emergency Decision Support.
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            <span>Simulation & Operational Planning Platform. For live emergencies, always follow local official directives.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
