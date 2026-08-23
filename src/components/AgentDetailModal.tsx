import React, { useState } from 'react';
import {
  X,
  Cpu,
  ShieldAlert,
  Boxes,
  Compass,
  CalendarCheck2,
  CheckCircle2,
  CheckCircle,
  Activity,
  Code2,
  ListTree,
  Sparkles,
} from 'lucide-react';
import { AgentNodeState, AgentType } from '../types/emergency';

interface AgentDetailModalProps {
  agent: AgentNodeState;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'reasoning' | 'json'>('reasoning');

  const getAgentIcon = (id: AgentType) => {
    switch (id) {
      case 'coordinator':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'risk':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'resource':
        return <Boxes className="w-5 h-5 text-amber-400" />;
      case 'route':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'planning':
        return <CalendarCheck2 className="w-5 h-5 text-indigo-400" />;
      case 'decision':
        return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
    }
  };

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
          <div className="p-2 rounded bg-[#0A0E14] border border-slate-700">
            {getAgentIcon(agent.id)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black uppercase text-white tracking-wider">
                {agent.name}
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-[#0A0E14] text-blue-400 border border-blue-500/40">
                {agent.status}
              </span>
              {agent.detailedOutput?.confidenceScore && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#0A0E14] text-green-400 border border-green-500/40 font-bold">
                  Confidence: {agent.detailedOutput.confidenceScore}%
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">{agent.role}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 border-b border-slate-700/60 pb-2 mb-2.5">
          <button
            onClick={() => setActiveTab('reasoning')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
              activeTab === 'reasoning'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-[#0A0E14] border border-slate-700'
            }`}
          >
            <ListTree className="w-3 h-3" />
            <span>Reasoning Trace & Findings</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
              activeTab === 'json'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-[#0A0E14] border border-slate-700'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Raw Agent JSON</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'reasoning' ? (
          <div className="space-y-2.5 text-xs">
            {/* Active Task */}
            <div className="bg-[#0A0E14] p-2.5 rounded border border-slate-700/60">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block mb-0.5">
                Assigned Objective / Scope:
              </span>
              <p className="text-slate-200 text-xs font-semibold leading-snug">{agent.task}</p>
            </div>

            {/* Key Findings */}
            {agent.detailedOutput?.keyFindings && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  Key Extracted Findings:
                </span>
                <div className="space-y-1">
                  {agent.detailedOutput.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0A0E14] p-2 rounded border border-slate-700/60 text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-blue-400 font-bold font-mono text-[10px]">
                        0{idx + 1}.
                      </span>
                      <span className="text-[10.5px] leading-snug">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning Trace Steps */}
            {agent.detailedOutput?.reasoningTrace && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-purple-400" />
                  Chain of Reasoning Steps:
                </span>
                <div className="bg-[#0A0E14] p-2.5 rounded border border-slate-700/60 space-y-1.5">
                  {agent.detailedOutput.reasoningTrace.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                      <span className="w-3.5 h-3.5 rounded bg-[#151B26] border border-slate-700 flex items-center justify-center font-mono text-[9px] text-purple-300 shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <p className="leading-snug text-[10.5px]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#0A0E14] p-2.5 rounded border border-slate-700/60 font-mono text-[10.5px] text-cyan-300 overflow-x-auto max-h-72 custom-scrollbar">
            <pre>{JSON.stringify(agent.detailedOutput || agent, null, 2)}</pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[9.5px] font-mono">Agent Engine: Gemini 3.7 Flash</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase text-[10px] transition border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
