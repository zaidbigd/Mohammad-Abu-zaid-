import React from 'react';
import {
  HelpCircle,
  ShieldAlert,
  Boxes,
  Compass,
  CalendarCheck2,
  CheckCircle2,
  Cpu,
  ArrowRight,
  X,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { ResponsePriority } from '../types/emergency';

interface ExplainabilityModalProps {
  priority: ResponsePriority;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  priority,
  onClose,
}) => {
  const agentContributions = [
    {
      agent: 'Coordinator Agent',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      tag: 'INCIDENT SCOPE',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
      description: `Ingested field situational parameters and initiated real-time specialist task allocation for Priority ${priority.priorityNumber}.`,
    },
    {
      agent: 'Risk Agent',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      tag: 'HAZARD ASSESSMENT',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      description: priority.explainability.riskAgentFactor,
    },
    {
      agent: 'Resource Agent',
      icon: <Boxes className="w-4 h-4 text-amber-400" />,
      tag: 'ASSET AVAILABILITY',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      description: priority.explainability.resourceAgentFactor,
    },
    {
      agent: 'Route Agent',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      tag: 'ROUTE NAVIGATION',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      description: priority.explainability.routeAgentFactor,
    },
    {
      agent: 'Planning Agent',
      icon: <CalendarCheck2 className="w-4 h-4 text-indigo-400" />,
      tag: 'TACTICAL SEQUENCING',
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
      description: priority.explainability.planningAgentFactor,
    },
    {
      agent: 'Decision Agent',
      icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
      tag: 'FINAL ARBITRATION',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      description: priority.explainability.decisionAgentFactor,
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

        {/* Modal Header */}
        <div className="flex items-start gap-2.5 mb-3 border-b border-slate-700/60 pb-2.5">
          <div className="p-1.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#0A0E14] text-blue-400 border border-blue-500/40 uppercase">
                Explainability Matrix
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Priority #{priority.priorityNumber}
              </span>
            </div>
            <h2 className="text-xs font-black uppercase text-white tracking-wider mt-0.5">
              Why was this action chosen?
            </h2>
            <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
              {priority.action}
            </p>
          </div>
        </div>

        {/* Multi-Agent Contribution Flow */}
        <div className="space-y-2">
          <p className="text-[10.5px] text-slate-400">
            The Decision Agent synthesized signals from all specialized agents to arbitrate this recommendation:
          </p>

          <div className="space-y-1.5">
            {agentContributions.map((contrib, i) => (
              <div
                key={i}
                className={`p-2 rounded border flex items-start gap-2 ${contrib.color}`}
              >
                <div className="p-1.5 rounded bg-[#0A0E14] border border-slate-700 shrink-0">
                  {contrib.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide">
                      {contrib.agent}
                    </span>
                    <span className="text-[8.5px] font-mono px-1 py-0.2 rounded bg-[#0A0E14] text-slate-300 border border-slate-700 font-bold">
                      {contrib.tag}
                    </span>
                  </div>
                  <p className="text-[10.5px] leading-snug text-slate-200">
                    {contrib.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
          <div className="text-[9.5px] text-slate-500 font-mono">
            Audit Trail: TRACE-P{priority.priorityNumber}-VERIFIED
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase transition shadow-md shadow-blue-900/30"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
