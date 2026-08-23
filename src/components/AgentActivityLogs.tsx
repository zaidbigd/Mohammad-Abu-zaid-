import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Filter,
  Trash2,
  Copy,
  Check,
  Radio,
  ArrowDownCircle,
} from 'lucide-react';
import { AgentMessageLog, AgentType } from '../types/emergency';

interface AgentActivityLogsProps {
  logs: AgentMessageLog[];
  onClearLogs: () => void;
  isRunning: boolean;
}

export const AgentActivityLogs: React.FC<AgentActivityLogsProps> = ({
  logs,
  onClearLogs,
  isRunning,
}) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filterAgent === 'all') return true;
    return log.agentId === filterAgent;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.agentName.toUpperCase()}]: ${l.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = (level: AgentMessageLog['level']) => {
    switch (level) {
      case 'critical':
        return 'text-red-400 bg-red-950/60 border-red-800/60';
      case 'warning':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'success':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'info':
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
    }
  };

  return (
    <div className="bg-[#151B26] border border-slate-700/50 rounded p-3 flex flex-col gap-2 text-slate-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Terminal className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black uppercase text-white tracking-wider leading-none">
                Telemetry Log
              </h2>
              {isRunning && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-green-400 bg-[#0A0E14] px-1 py-0.2 rounded border border-green-500/40 animate-pulse font-bold">
                  <span className="w-1 h-1 rounded-full bg-green-400"></span>
                  STREAMING
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Synchronous Multi-Agent Event Bus
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Agent Filter */}
          <div className="flex items-center gap-1 bg-[#0A0E14] px-1.5 py-0.5 rounded border border-slate-700 text-xs">
            <Filter className="w-2.5 h-2.5 text-slate-400" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-transparent text-slate-300 text-[10px] outline-none cursor-pointer uppercase font-bold"
            >
              <option value="all">All Agents</option>
              <option value="coordinator">Coordinator</option>
              <option value="risk">Risk Agent</option>
              <option value="resource">Resource Agent</option>
              <option value="route">Route Agent</option>
              <option value="planning">Planning Agent</option>
              <option value="decision">Decision Agent</option>
              <option value="system">System Bus</option>
            </select>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyLogs}
            className="p-1 rounded bg-[#0A0E14] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition text-xs flex items-center gap-1"
            title="Copy Logs to Clipboard"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClearLogs}
            className="p-1 rounded bg-[#0A0E14] hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 transition text-xs"
            title="Clear Activity Terminal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div
        ref={scrollRef}
        className="bg-[#0A0E14] rounded border border-slate-700/60 p-2.5 h-48 overflow-y-auto font-mono text-xs space-y-1 select-text custom-scrollbar shadow-inner"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs">
            <Radio className="w-5 h-5 mb-1 opacity-40 animate-pulse" />
            <span>Agent activity bus standby. Click "RUN ANALYSIS" to start.</span>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-1.5 py-0.5 hover:bg-slate-900/60 px-1 rounded transition text-[10.5px] leading-relaxed"
            >
              <span className="text-blue-400 select-none shrink-0 font-mono text-[10px]">
                [{log.timestamp}]
              </span>
              <span
                className={`px-1 py-0.2 rounded text-[9px] uppercase font-bold border shrink-0 ${getBadgeColor(
                  log.level
                )}`}
              >
                {log.agentName}
              </span>
              <span className="text-slate-300 break-words flex-1">
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Auto-scroll toggle status */}
      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span>Log Buffer: {filteredLogs.length} events</span>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`flex items-center gap-1 hover:text-slate-300 transition ${
            autoScroll ? 'text-green-400' : 'text-slate-500'
          }`}
        >
          <ArrowDownCircle className="w-2.5 h-2.5" />
          Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};
