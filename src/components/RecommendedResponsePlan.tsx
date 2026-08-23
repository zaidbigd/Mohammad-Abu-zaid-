import React, { useState } from 'react';
import {
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  Truck,
  Home,
  HeartPulse,
  Send,
  FileCheck2,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Layers,
} from 'lucide-react';
import {
  MultiAgentAnalysisResult,
  ResponsePriority,
} from '../types/emergency';
import { ExplainabilityModal } from './ExplainabilityModal';

interface RecommendedResponsePlanProps {
  result: MultiAgentAnalysisResult;
  onApproveAll: () => void;
  isAllApproved: boolean;
  onTogglePriorityApproval: (priorityNumber: number) => void;
  approvedPriorities: number[];
}

export const RecommendedResponsePlan: React.FC<RecommendedResponsePlanProps> = ({
  result,
  onApproveAll,
  isAllApproved,
  onTogglePriorityApproval,
  approvedPriorities,
}) => {
  const [selectedExplainPriority, setSelectedExplainPriority] =
    useState<ResponsePriority | null>(null);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500 text-white font-bold animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]';
      case 'HIGH':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'MEDIUM':
        return 'bg-yellow-500 text-slate-950 font-bold';
      default:
        return 'bg-emerald-500 text-white font-bold';
    }
  };

  return (
    <div className="bg-[#151B26] border border-slate-700/50 rounded p-3 flex flex-col gap-2.5 shadow-md text-slate-200">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 border-b border-slate-700/50 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-mono tracking-wider bg-[#0A0E14] text-blue-400 border border-blue-500/40 font-bold">
              Decision Synthesis
            </span>
            <span
              className={`px-2 py-0.2 rounded text-[9.5px] font-mono tracking-wider ${getRiskBadge(
                result.overallRisk
              )}`}
            >
              OVERALL RISK: {result.overallRisk}
            </span>
          </div>
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 leading-none">
            Recommended Response Plan
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Multi-Criteria Tactical Prioritization & Strategic Resource Schedule
          </p>
        </div>

        {/* Commander Approval Control */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
          <button
            id="btn-approve-all-plan"
            onClick={onApproveAll}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition flex items-center gap-1.5 shadow-md ${
              isAllApproved
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {isAllApproved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Authorized</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Approve & Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strategic Objective & Casualty Mitigation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#0A0E14] p-2.5 rounded border border-slate-700/60">
        <div className="md:col-span-2">
          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-0.5">
            Top Priority Objective:
          </span>
          <p className="text-xs font-bold text-amber-300 leading-snug">
            {result.topPrioritySummary}
          </p>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
            <span className="text-blue-400 font-semibold">Strategic Rationale: </span>
            {result.strategicReasoning}
          </p>
        </div>

        <div className="bg-[#151B26] p-2 rounded border border-slate-700/60 flex flex-col justify-center">
          <div className="text-[9px] text-slate-400 uppercase font-mono font-bold mb-0.5">
            Projected Casualty Risk Mitigated
          </div>
          <div className="text-lg font-black text-rose-400 font-mono flex items-baseline gap-1">
            {result.estimatedCasualtiesProjected.toLocaleString()}
            <span className="text-[10px] text-slate-400 font-normal">
              at-risk persons
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Response Priorities Cards */}
      <div className="space-y-2">
        {result.priorities.map((priority) => {
          const isApproved = approvedPriorities.includes(
            priority.priorityNumber
          );

          return (
            <div
              key={priority.priorityNumber}
              id={`priority-card-${priority.priorityNumber}`}
              className={`p-2.5 rounded border transition-all ${
                isApproved
                  ? 'bg-[#0A0E14] border-green-500/60 shadow-md shadow-green-950/20'
                  : 'bg-[#0A0E14] border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Card Top: Rank Badge, Title, Timeline, and 'Why?' Explainability Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-black text-[11px] shrink-0 ${
                      priority.priorityNumber === 1
                        ? 'bg-red-500 text-white shadow-sm'
                        : priority.priorityNumber === 2
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    P{priority.priorityNumber}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      {priority.action}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Target: {priority.targetZone}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Clock className="w-2.5 h-2.5" />
                        {priority.timeline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explainability "Why?" and Approve Toggle */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* The CRITICAL EXPLAINABILITY "Why?" Button */}
                  <button
                    id={`btn-why-priority-${priority.priorityNumber}`}
                    onClick={() => setSelectedExplainPriority(priority)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition flex items-center gap-1 uppercase"
                    title="Explain which agent outputs contributed to this decision"
                  >
                    <HelpCircle className="w-3 h-3 text-blue-400" />
                    <span>Why?</span>
                  </button>

                  {/* Individual Approval Toggle */}
                  <button
                    onClick={() =>
                      onTogglePriorityApproval(priority.priorityNumber)
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 border uppercase ${
                      isApproved
                        ? 'bg-green-950/60 text-green-300 border-green-500'
                        : 'bg-[#151B26] text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>{isApproved ? 'Authorized' : 'Authorize'}</span>
                  </button>
                </div>
              </div>

              {/* Priority Justification Reason */}
              <div className="text-[10.5px] text-slate-300 mb-2 bg-[#151B26] p-2 rounded border border-slate-700/50">
                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-0.5">
                  Operational Reason:
                </span>
                <p className="leading-snug">{priority.reason}</p>
              </div>

              {/* Resources Required Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                <div className="bg-[#151B26] p-1.5 rounded border border-slate-700/50">
                  <div className="text-[9px] text-slate-400 flex items-center gap-1 mb-0.5 font-bold uppercase">
                    <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />
                    Rescue
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-[11px]">
                    {priority.requiredResources.rescueTeams} Teams
                  </span>
                </div>

                <div className="bg-[#151B26] p-1.5 rounded border border-slate-700/50">
                  <div className="text-[9px] text-slate-400 flex items-center gap-1 mb-0.5 font-bold uppercase">
                    <Truck className="w-2.5 h-2.5 text-rose-400" />
                    Ambulances
                  </div>
                  <span className="font-mono text-rose-300 font-bold text-[11px]">
                    {priority.requiredResources.ambulances} Units
                  </span>
                </div>

                <div className="bg-[#151B26] p-1.5 rounded border border-slate-700/50">
                  <div className="text-[9px] text-slate-400 flex items-center gap-1 mb-0.5 font-bold uppercase">
                    <Home className="w-2.5 h-2.5 text-emerald-400" />
                    Shelter Beds
                  </div>
                  <span className="font-mono text-emerald-300 font-bold text-[11px]">
                    {priority.requiredResources.shelterCapacity.toLocaleString()} Beds
                  </span>
                </div>

                <div className="bg-[#151B26] p-1.5 rounded border border-slate-700/50">
                  <div className="text-[9px] text-slate-400 flex items-center gap-1 mb-0.5 font-bold uppercase">
                    <HeartPulse className="w-2.5 h-2.5 text-amber-400" />
                    Medical Staff
                  </div>
                  <span className="text-[10px] text-amber-300 font-medium truncate block">
                    {priority.requiredResources.medicalStaff || 'Triage Unit'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Safety Notice / Human Approval Warning */}
      <div className="bg-amber-950/20 border border-amber-500/40 p-2.5 rounded flex items-start gap-2 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-amber-300 text-[10px]">
            Human Responder Approval Required
          </span>
          <p className="text-[10px] text-amber-200/80 leading-relaxed mt-0.5">
            Agent Hub is a decision-support system to assist emergency commanders. All AI-generated priority actions require human commander review and manual tactical validation before resource dispatch.
          </p>
        </div>
      </div>

      {/* Explainability Modal Trigger */}
      {selectedExplainPriority && (
        <ExplainabilityModal
          priority={selectedExplainPriority}
          onClose={() => setSelectedExplainPriority(null)}
        />
      )}
    </div>
  );
};
