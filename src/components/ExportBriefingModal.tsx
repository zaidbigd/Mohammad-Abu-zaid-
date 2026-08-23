import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  Printer,
  Download,
  Shield,
} from 'lucide-react';
import {
  EmergencyScenario,
  MultiAgentAnalysisResult,
} from '../types/emergency';

interface ExportBriefingModalProps {
  scenario: EmergencyScenario;
  result: MultiAgentAnalysisResult;
  onClose: () => void;
}

export const ExportBriefingModal: React.FC<ExportBriefingModalProps> = ({
  scenario,
  result,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const generateReportText = () => {
    return `=====================================================
INCIDENT ACTION PLAN (IAP) - AGENT HUB DECISION SUPPORT
Generated: ${new Date().toISOString()}
Status: HUMAN COMMANDER REVIEW REQUIRED
=====================================================

1. INCIDENT SITUATION
- Incident Type: ${scenario.disasterType}
- Location: ${scenario.location}
- Severity Grade: ${scenario.severity} (Calculated Overall Risk: ${
      result.overallRisk
    })
- Affected Population: ${scenario.affectedPeople.toLocaleString()}
- Injured Casualties: ${scenario.injuredPeople.toLocaleString()}
- Road Status: ${scenario.roadConditions}

2. RESOURCE ASSETS INVENTORIED
- Rescue Strike Teams: ${scenario.rescueTeams}
- Medical Transport Ambulances: ${scenario.ambulances}
- Verified Shelters: ${scenario.shelters}

3. PRIMARY STRATEGIC DIRECTIVE
"${result.topPrioritySummary}"
Strategic Reasoning: ${result.strategicReasoning}

4. ORDERED TACTICAL RESPONSE PRIORITIES
${result.priorities
  .map(
    (p) => `
[PRIORITY ${p.priorityNumber}] ${p.action}
- Target Sector: ${p.targetZone}
- Execution Window: ${p.timeline}
- Operational Rationale: ${p.reason}
- Required Assets: ${p.requiredResources.rescueTeams} Rescue Squads | ${p.requiredResources.ambulances} Ambulances | ${p.requiredResources.shelterCapacity} Shelter Beds
- Contributing Agent Logic:
  * Risk Agent: ${p.explainability.riskAgentFactor}
  * Resource Agent: ${p.explainability.resourceAgentFactor}
  * Route Agent: ${p.explainability.routeAgentFactor}
  * Planning Agent: ${p.explainability.planningAgentFactor}
  * Decision Agent: ${p.explainability.decisionAgentFactor}
`
  )
  .join('\n')}

=====================================================
DISCLAIMER: Agent Hub is an AI-assisted decision-support prototype. 
Simulated response plan requires human commander authorization prior to tactical dispatch.
=====================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateReportText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `IAP_AgentHub_${scenario.disasterType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#151B26] border border-slate-700/80 rounded max-w-2xl w-full p-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-[#0A0E14] border border-slate-700 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-2.5 mb-3 border-b border-slate-700/60 pb-2.5">
          <div className="p-2 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#0A0E14] text-blue-400 border border-blue-500/40 uppercase">
              Incident Action Plan
            </span>
            <h2 className="text-xs font-black uppercase text-white tracking-wider mt-0.5">
              Export Operational Briefing
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Standardized format for command staff hand-off & tactical logs.
            </p>
          </div>
        </div>

        {/* Text Container */}
        <div className="flex-1 overflow-y-auto bg-[#0A0E14] p-3 rounded border border-slate-700/60 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text custom-scrollbar">
          {generateReportText()}
        </div>

        {/* Actions */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase transition border border-slate-700"
          >
            <Download className="w-3 h-3" />
            <span>Download .TXT</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase transition shadow-md shadow-blue-900/30"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Briefing</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold uppercase border border-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
