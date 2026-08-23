import React from 'react';
import {
  Network,
  Cpu,
  ShieldAlert,
  Boxes,
  Compass,
  CalendarCheck2,
  CheckCircle2,
  Loader2,
  Clock,
  ExternalLink,
  ChevronDown,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { AgentNodeState, AgentType } from '../types/emergency';

interface AgentNetworkPanelProps {
  agents: Record<AgentType, AgentNodeState>;
  onInspectAgent: (agentId: AgentType) => void;
  isRunning: boolean;
  activeAgentId?: AgentType;
}

export const AgentNetworkPanel: React.FC<AgentNetworkPanelProps> = ({
  agents,
  onInspectAgent,
  isRunning,
  activeAgentId,
}) => {
  const getAgentIcon = (id: AgentType) => {
    switch (id) {
      case 'coordinator':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'risk':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'resource':
        return <Boxes className="w-4 h-4 text-amber-400" />;
      case 'route':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'planning':
        return <CalendarCheck2 className="w-4 h-4 text-indigo-400" />;
      case 'decision':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const renderAgentCard = (agent: AgentNodeState, isHighlighted?: boolean) => {
    const isCurrentActive = activeAgentId === agent.id;
    const isAnalyzing = agent.status === 'analyzing';
    const isCompleted = agent.status === 'completed';

    const statusBadge = {
      idle: 'bg-slate-900 text-slate-500 border-slate-800',
      waiting: 'bg-slate-900/80 text-amber-400/80 border-amber-500/20',
      analyzing:
        'bg-amber-950/80 text-amber-300 border-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      completed:
        'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm',
      error: 'bg-red-950/70 text-red-300 border-red-500',
    }[agent.status];

    const isCoordinator = agent.id === 'coordinator';
    const isDecision = agent.id === 'decision';

    return (
      <div
        key={agent.id}
        id={`agent-card-${agent.id}`}
        onClick={() => onInspectAgent(agent.id)}
        className={`relative p-2 rounded border transition-all duration-200 cursor-pointer ${
          isCurrentActive || isAnalyzing
            ? 'bg-[#0A0E14] border-blue-400 shadow-md shadow-blue-900/30'
            : isDecision
            ? 'bg-red-950/20 border-red-600/80 hover:border-red-500 text-red-200'
            : isCoordinator && isCompleted
            ? 'bg-blue-950/30 border-blue-500/60 hover:border-blue-400'
            : isCompleted
            ? 'bg-[#0A0E14] border-slate-700 hover:border-slate-600'
            : 'bg-[#0A0E14]/60 border-slate-800 opacity-70'
        }`}
      >
        {/* Active Node Pulse Ring */}
        {isAnalyzing && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        )}

        {/* Card Header: Agent Name, Role & Status */}
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-[#151B26] border border-slate-700 shrink-0">
              {getAgentIcon(agent.id)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-black uppercase text-white tracking-wider leading-none">
                  {agent.name}
                </h3>
                {agent.detailedOutput?.confidenceScore && (
                  <span className="text-[9px] font-mono text-cyan-300 bg-[#151B26] px-1 py-0.2 rounded border border-slate-700">
                    {agent.detailedOutput.confidenceScore}%
                  </span>
                )}
              </div>
              <p className="text-[9.5px] text-slate-400 font-medium leading-none mt-0.5">{agent.role}</p>
            </div>
          </div>

          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1 ${statusBadge}`}
          >
            {isAnalyzing && <Loader2 className="w-2 h-2 animate-spin" />}
            {isCompleted && <CheckCircle2 className="w-2 h-2 text-emerald-400" />}
            {agent.status}
          </span>
        </div>

        {/* Task Description */}
        <div className="text-[10px] text-slate-300 bg-[#151B26] p-1.5 rounded border border-slate-700/60 mb-1.5">
          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-0.5">
            Active Task:
          </span>
          <p className="line-clamp-2 text-slate-200 leading-snug">{agent.task}</p>
        </div>

        {/* Short Output (If available) */}
        {agent.shortOutput ? (
          <div className="text-[10px] text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 p-1.5 rounded font-mono">
            <span className="text-[9px] text-emerald-400 uppercase block font-sans font-bold mb-0.5">
              Telemetry Output:
            </span>
            <p className="line-clamp-2 leading-snug">{agent.shortOutput}</p>
          </div>
        ) : isAnalyzing ? (
          <div className="w-full bg-[#151B26] rounded h-1 overflow-hidden">
            <div
              className="bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${agent.progress || 45}%` }}
            ></div>
          </div>
        ) : null}

        {/* Deep Inspect Footer prompt */}
        <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
          <span className="flex items-center gap-1 hover:text-blue-300">
            <ExternalLink className="w-2.5 h-2.5" />
            Inspect reasoning trace
          </span>
          <span className="font-mono text-slate-400 font-semibold">AGT-{agent.id.toUpperCase()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#151B26] border border-slate-700/50 rounded p-3 flex flex-col gap-2 text-slate-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Network className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black uppercase text-white tracking-wider leading-none">
                AI Agent Network
              </h2>
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#0A0E14] text-blue-400 border border-blue-500/30 font-bold uppercase">
                6 Nodes
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Hierarchical Task Delegation & Arbitration
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Agent Visual Node Architecture */}
      <div className="flex flex-col gap-1.5">
        {/* Tier 1: Coordinator Node */}
        <div>{renderAgentCard(agents.coordinator)}</div>

        {/* Animated Flow Connector */}
        <div className="flex items-center justify-center -my-0.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-blue-400 bg-[#0A0E14] px-1.5 py-0.5 rounded border border-slate-700">
            <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            <span>Task Distribution</span>
          </div>
        </div>

        {/* Tier 2: Parallel Specialist Agents (Risk, Resource, Route) */}
        <div className="grid grid-cols-1 gap-1.5">
          {renderAgentCard(agents.risk)}
          {renderAgentCard(agents.resource)}
          {renderAgentCard(agents.route)}
        </div>

        {/* Animated Flow Connector */}
        <div className="flex items-center justify-center -my-0.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-indigo-400 bg-[#0A0E14] px-1.5 py-0.5 rounded border border-slate-700">
            <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            <span>Synthesis & Plan Generation</span>
          </div>
        </div>

        {/* Tier 3: Planning Agent */}
        <div>{renderAgentCard(agents.planning)}</div>

        {/* Animated Flow Connector */}
        <div className="flex items-center justify-center -my-0.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-purple-400 bg-[#0A0E14] px-1.5 py-0.5 rounded border border-slate-700">
            <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            <span>Decision Arbitration</span>
          </div>
        </div>

        {/* Tier 4: Decision Agent */}
        <div>{renderAgentCard(agents.decision)}</div>
      </div>
    </div>
  );
};
