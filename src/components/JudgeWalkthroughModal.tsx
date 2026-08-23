import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface JudgeWalkthroughModalProps {
  onClose: () => void;
  onLoadFloodDemo: () => void;
}

export const JudgeWalkthroughModal: React.FC<JudgeWalkthroughModalProps> = ({
  onClose,
  onLoadFloodDemo,
}) => {
  const steps = [
    {
      time: '0:00 - 0:30',
      title: '1. Incident Scenario Ingestion',
      desc: 'Show the Left Panel. Click "LOAD FLOOD DEMO" to ingest a critical disaster scenario with 5,000 affected civilians, 6 rescue teams, and submerged bridges.',
    },
    {
      time: '0:30 - 1:00',
      title: '2. Multi-Agent Collaborative Pipeline',
      desc: 'Click "RUN ANALYSIS". Show how the 6 specialized AI agents (Coordinator → Risk/Resource/Route in parallel → Planning → Decision) collaborate sequentially and stream live telemetry logs.',
    },
    {
      time: '1:00 - 1:30',
      title: '3. Interactive GIS Map & Risk Vectors',
      desc: 'Point out the Situation Map highlighting critical inundated zones, blocked bridge bottlenecks, open evacuation corridors, and shelter status.',
    },
    {
      time: '1:30 - 2:00',
      title: '4. Explainability ("Why?" Inspector) & Human Approval',
      desc: 'Scroll down to the Recommended Response Plan. Click "Why?" on Priority 1 to prove transparent multi-agent reasoning, then show the mandatory Human Responder Approval gate.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#151B26] border border-slate-700/80 rounded max-w-2xl w-full p-4 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-[#0A0E14] border border-slate-700 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-2.5 mb-3 border-b border-slate-700/60 pb-2.5">
          <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#0A0E14] text-amber-300 border border-amber-500/40 uppercase">
              Demo Script
            </span>
            <h2 className="text-xs font-black uppercase text-white tracking-wider mt-0.5">
              2-Minute Judge Walkthrough Guide
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Roadmap to showcase AGENT HUB's multi-agent decision architecture.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded bg-[#0A0E14] border border-slate-700/60 flex items-start gap-2.5"
            >
              <div className="px-1.5 py-0.5 rounded bg-[#151B26] border border-slate-700 font-mono text-[10px] text-blue-400 font-bold shrink-0">
                {step.time}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white mb-0.5">
                  {step.title}
                </h3>
                <p className="text-[10.5px] text-slate-300 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Core Differentiation Callout */}
        <div className="mt-3 p-2.5 rounded bg-[#0A0E14] border border-blue-500/40 text-xs text-slate-200 space-y-1">
          <span className="font-bold text-blue-300 flex items-center gap-1.5 text-[10.5px] uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Key Pitch Talking Point:
          </span>
          <p className="text-slate-300 text-[10.5px] leading-snug">
            "Agent Hub is <strong>not a generic single chatbot</strong>. It is a specialized multi-agent consensus system where autonomous agents handle risk modeling, asset allocation, and route optimization in parallel, arbitrating an explainable, human-approved tactical plan."
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
          <button
            onClick={() => {
              onLoadFloodDemo();
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase transition shadow-md shadow-blue-900/30"
          >
            <Sparkles className="w-3 h-3" />
            <span>Load Demo & Start</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase transition border border-slate-700"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
