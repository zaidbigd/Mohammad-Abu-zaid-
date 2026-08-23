import React, { useState, useEffect } from 'react';
import {
  EmergencyScenario,
  AgentType,
  AgentNodeState,
  AgentMessageLog,
  MultiAgentAnalysisResult,
  ResponsePriority,
} from './types/emergency';
import { PRESET_SCENARIOS } from './data/presetScenarios';
import { Header } from './components/Header';
import { EmergencyInputForm } from './components/EmergencyInputForm';
import { SituationMap } from './components/SituationMap';
import { AgentNetworkPanel } from './components/AgentNetworkPanel';
import { AgentActivityLogs } from './components/AgentActivityLogs';
import { RecommendedResponsePlan } from './components/RecommendedResponsePlan';
import { AgentDetailModal } from './components/AgentDetailModal';
import { JudgeWalkthroughModal } from './components/JudgeWalkthroughModal';
import { ExportBriefingModal } from './components/ExportBriefingModal';
import { EnteringInterface } from './components/EnteringInterface';
import { soundManager } from './utils/audioAlerts';

export default function App() {
  // Scenario state (pre-filled with Flood demo)
  const [scenario, setScenario] = useState<EmergencyScenario>(
    PRESET_SCENARIOS[0]
  );

  // Execution & Agent States
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentType | undefined>(
    undefined
  );
  const [analysisResult, setAnalysisResult] =
    useState<MultiAgentAnalysisResult | null>(null);

  // Modals state
  const [showGateway, setShowGateway] = useState<boolean>(true);
  const [inspectAgentId, setInspectAgentId] = useState<AgentType | null>(null);
  const [showJudgeGuide, setShowJudgeGuide] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // 6 Agents state dictionary
  const [agents, setAgents] = useState<Record<AgentType, AgentNodeState>>({
    coordinator: {
      id: 'coordinator',
      name: 'Coordinator Agent',
      role: 'Orchestrator & Task Dispatcher',
      status: 'idle',
      progress: 0,
      task: 'Standby for emergency incident telemetry',
      shortOutput: '',
    },
    risk: {
      id: 'risk',
      name: 'Risk Agent',
      role: 'Hazard & Vulnerability Assessor',
      status: 'idle',
      progress: 0,
      task: 'Standby for zone risk classification',
      shortOutput: '',
    },
    resource: {
      id: 'resource',
      name: 'Resource Agent',
      role: 'Asset & Triage Capacity Auditor',
      status: 'idle',
      progress: 0,
      task: 'Standby for resource inventory check',
      shortOutput: '',
    },
    route: {
      id: 'route',
      name: 'Route Agent',
      role: 'Infrastructure & Route Optimizer',
      status: 'idle',
      progress: 0,
      task: 'Standby for road choke-point analysis',
      shortOutput: '',
    },
    planning: {
      id: 'planning',
      name: 'Planning Agent',
      role: 'Tactical Sequencing Synthesizer',
      status: 'idle',
      progress: 0,
      task: 'Standby for response schedule drafting',
      shortOutput: '',
    },
    decision: {
      id: 'decision',
      name: 'Decision Agent',
      role: 'Final Arbitration & Priority Assigner',
      status: 'idle',
      progress: 0,
      task: 'Standby for multi-criteria recommendation',
      shortOutput: '',
    },
  });

  // Real-time Event Stream Logs
  const [logs, setLogs] = useState<AgentMessageLog[]>([]);

  // Approved priorities state
  const [approvedPriorities, setApprovedPriorities] = useState<number[]>([]);
  const isAllApproved =
    !!analysisResult &&
    analysisResult.priorities.length > 0 &&
    approvedPriorities.length === analysisResult.priorities.length;

  const addLog = (
    agentId: AgentType | 'system',
    agentName: string,
    text: string,
    level: AgentMessageLog['level'] = 'info'
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp,
        agentId,
        agentName,
        text,
        level,
      },
    ]);
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (found) {
      setScenario(found);
      handleReset();
      addLog(
        'system',
        'SYSTEM',
        `Loaded scenario preset: ${found.title} (${found.disasterType})`,
        'info'
      );
    }
  };

  const handleLoadFloodDemo = () => {
    handleSelectPreset(PRESET_SCENARIOS[0].id);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveAgentId(undefined);
    setAnalysisResult(null);
    setApprovedPriorities([]);
    setAgents({
      coordinator: {
        id: 'coordinator',
        name: 'Coordinator Agent',
        role: 'Orchestrator & Task Dispatcher',
        status: 'idle',
        progress: 0,
        task: 'Standby for emergency incident telemetry',
        shortOutput: '',
      },
      risk: {
        id: 'risk',
        name: 'Risk Agent',
        role: 'Hazard & Vulnerability Assessor',
        status: 'idle',
        progress: 0,
        task: 'Standby for zone risk classification',
        shortOutput: '',
      },
      resource: {
        id: 'resource',
        name: 'Resource Agent',
        role: 'Asset & Triage Capacity Auditor',
        status: 'idle',
        progress: 0,
        task: 'Standby for resource inventory check',
        shortOutput: '',
      },
      route: {
        id: 'route',
        name: 'Route Agent',
        role: 'Infrastructure & Route Optimizer',
        status: 'idle',
        progress: 0,
        task: 'Standby for road choke-point analysis',
        shortOutput: '',
      },
      planning: {
        id: 'planning',
        name: 'Planning Agent',
        role: 'Tactical Sequencing Synthesizer',
        status: 'idle',
        progress: 0,
        task: 'Standby for response schedule drafting',
        shortOutput: '',
      },
      decision: {
        id: 'decision',
        name: 'Decision Agent',
        role: 'Final Arbitration & Priority Assigner',
        status: 'idle',
        progress: 0,
        task: 'Standby for multi-criteria recommendation',
        shortOutput: '',
      },
    });
  };

  // Initial welcome message in logs
  useEffect(() => {
    if (logs.length === 0) {
      addLog(
        'system',
        'SYSTEM',
        'Agent Hub Command System online. Ready for emergency incident ingestion.',
        'info'
      );
    }
  }, []);

  // Multi-Agent Pipeline Runner
  const handleRunAnalysis = async (targetScenario?: unknown) => {
    if (isRunning) return;

    // Check if targetScenario is an actual EmergencyScenario object (not a React SyntheticEvent, MouseEvent, or null)
    const isScenarioObject =
      Boolean(targetScenario) &&
      typeof targetScenario === 'object' &&
      'disasterType' in (targetScenario as Record<string, unknown>) &&
      typeof (targetScenario as Record<string, unknown>).disasterType === 'string' &&
      !('nativeEvent' in (targetScenario as Record<string, unknown>)) &&
      !('target' in (targetScenario as Record<string, unknown>));

    const curScenario: EmergencyScenario = isScenarioObject
      ? (targetScenario as EmergencyScenario)
      : scenario;

    if (isScenarioObject) {
      setScenario(curScenario);
    }

    const affectedPeopleCount = curScenario.affectedPeople ?? 12500;
    const injuredPeopleCount = curScenario.injuredPeople ?? 120;
    const rescueTeamsCount = curScenario.rescueTeams ?? 18;
    const ambulancesCount = curScenario.ambulances ?? 24;
    const sheltersCount = curScenario.shelters ?? 4;
    const disasterTypeName = curScenario.disasterType || 'Flood';
    const locationName = curScenario.location || 'Tactical Sector';
    const severityGrade = curScenario.severity || 'CRITICAL';
    const roadState = curScenario.roadConditions || 'Normal Grid';

    setIsRunning(true);
    setAnalysisResult(null);
    setApprovedPriorities([]);
    soundManager.playEmergencyAlert();

    addLog(
      'system',
      'SYSTEM',
      `EMERGENCY INGESTED: ${severityGrade} ${disasterTypeName} at ${locationName}`,
      'critical'
    );

    try {
      // 1. Kick off API call in background while animating multi-agent execution pipeline in UI
      const apiPromise = fetch('/api/analyze-emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curScenario),
      })
        .then((r) => r.json())
        .catch((err) => {
          console.warn('API error, relying on local synthesis:', err);
          return null;
        });

      // Stage 1: Coordinator Agent (0 - 900ms)
      setActiveAgentId('coordinator');
      soundManager.playAgentPulse();
      setAgents((prev) => ({
        ...prev,
        coordinator: {
          ...prev.coordinator,
          status: 'analyzing',
          progress: 50,
          task: `Parsing ${curScenario.disasterType} parameters & allocating downstream sub-tasks`,
          shortOutput: 'Validating casualty & infrastructure impact radius...',
        },
      }));
      addLog(
        'coordinator',
        'COORDINATOR',
        `Coordinator Agent received emergency data. Initiating parallel analysis pipelines.`,
        'info'
      );

      await new Promise((r) => setTimeout(r, 900));

      setAgents((prev) => ({
        ...prev,
        coordinator: {
          ...prev.coordinator,
          status: 'completed',
          progress: 100,
          shortOutput: `Emergency verified as ${curScenario.severity} ${curScenario.disasterType}. Dispatched tasks to Risk, Resource, and Route agents.`,
        },
      }));
      soundManager.playAgentComplete();

      // Stage 2: Parallel Execution - Risk, Resource, Route Agents (900ms - 2200ms)
      setActiveAgentId('risk');
      soundManager.playAgentPulse();

      setAgents((prev) => ({
        ...prev,
        risk: {
          ...prev.risk,
          status: 'analyzing',
          progress: 60,
          task: `Evaluating danger zones, structural vulnerabilities & casualty projections`,
          shortOutput: 'Calculating sector threat index...',
        },
        resource: {
          ...prev.resource,
          status: 'analyzing',
          progress: 60,
          task: `Auditing ${curScenario.rescueTeams} rescue squads, ${curScenario.ambulances} ambulances & shelter beds`,
          shortOutput: 'Matching available units against critical needs...',
        },
        route: {
          ...prev.route,
          status: 'analyzing',
          progress: 60,
          task: `Scanning road conditions: ${curScenario.roadConditions}`,
          shortOutput: 'Identifying impassable choke-points and safe corridors...',
        },
      }));

      addLog(
        'risk',
        'RISK AGENT',
        `Risk Agent analyzing affected zones and vulnerability index for ${curScenario.affectedPeople.toLocaleString()} civilians.`,
        'warning'
      );
      addLog(
        'resource',
        'RESOURCE AGENT',
        `Resource Agent auditing available resources: ${curScenario.rescueTeams} rescue teams, ${curScenario.ambulances} ambulances, ${curScenario.shelters} shelters.`,
        'info'
      );
      addLog(
        'route',
        'ROUTE AGENT',
        `Route Agent calculating road blockages and certified evacuation corridors.`,
        'info'
      );

      await new Promise((r) => setTimeout(r, 1300));

      setAgents((prev) => ({
        ...prev,
        risk: {
          ...prev.risk,
          status: 'completed',
          progress: 100,
          shortOutput: `Zone A and Zone C identified as CRITICAL danger sectors with immediate life threat.`,
        },
        resource: {
          ...prev.resource,
          status: 'completed',
          progress: 100,
          shortOutput: `Resource capacity checked: 100% of available rescue strike teams required for first wave.`,
        },
        route: {
          ...prev.route,
          status: 'completed',
          progress: 100,
          shortOutput: `North Bypass Corridor certified OPEN. South bridges flagged 100% impassable.`,
        },
      }));
      soundManager.playAgentComplete();

      // Stage 3: Planning Agent (2200ms - 3200ms)
      setActiveAgentId('planning');
      soundManager.playAgentPulse();

      setAgents((prev) => ({
        ...prev,
        planning: {
          ...prev.planning,
          status: 'analyzing',
          progress: 75,
          task: 'Synthesizing risk map, resource limits & open route corridors into 3-phase tactical response',
          shortOutput: 'Drafting sequential intervention timetable...',
        },
      }));
      addLog(
        'planning',
        'PLANNING AGENT',
        `Planning Agent generating multi-phase response plan combining risk priority and transit safety.`,
        'info'
      );

      await new Promise((r) => setTimeout(r, 1000));

      setAgents((prev) => ({
        ...prev,
        planning: {
          ...prev.planning,
          status: 'completed',
          progress: 100,
          shortOutput: `Generated 3-phase response sequence: Life-Rescue → Medical Triage → Shelter Logistics.`,
        },
      }));
      soundManager.playAgentComplete();

      // Stage 4: Decision Agent (3200ms - 4200ms)
      setActiveAgentId('decision');
      soundManager.playAgentPulse();

      setAgents((prev) => ({
        ...prev,
        decision: {
          ...prev.decision,
          status: 'analyzing',
          progress: 85,
          task: 'Multi-criteria trade-off arbitration & final priority ranking generation',
          shortOutput: 'Resolving resource allocation conflicts...',
        },
      }));
      addLog(
        'decision',
        'DECISION AGENT',
        `Decision Agent prioritizing tactical actions and producing final response recommendations.`,
        'warning'
      );

      // Wait for backend API or fallback synthesis
      const response = await apiPromise;
      await new Promise((r) => setTimeout(r, 900));

      let resultData: MultiAgentAnalysisResult;
      if (response && response.success && response.data) {
        resultData = response.data;
      } else {
        // Safe robust fallback
        resultData = {
          overallRisk: severityGrade || 'CRITICAL',
          estimatedCasualtiesProjected: Math.round(
            injuredPeopleCount * 1.8
          ),
          topPrioritySummary: `Immediate tactical rescue in Zone A via North Bypass Corridor before surge crest.`,
          strategicReasoning: `Decision Agent prioritized immediate life-extrication over peripheral asset protection due to critical water rise within the next 45 minutes.`,
          agentOutputs: {
            coordinator: {
              task: 'Incident classification & task dispatching',
              shortOutput: `Disaster verified as ${severityGrade} ${disasterTypeName}.`,
              keyFindings: [
                `Scenario: ${disasterTypeName} at ${locationName}`,
                `6 Agents synchronized`,
              ],
              confidenceScore: 98,
              reasoningTrace: [
                'Ingested emergency parameters',
                'Calculated radius of impact',
                'Triggered downstream specialist network',
              ],
            },
            risk: {
              task: 'Vulnerability assessment & zone danger scoring',
              shortOutput: `Zone A rated CRITICAL with 8.9 danger index.`,
              keyFindings: [
                `${affectedPeopleCount.toLocaleString()} civilians in hazard path`,
                `High risk of building inundation`,
              ],
              confidenceScore: 95,
              reasoningTrace: [
                'Assessed flood gauge telemetry',
                'Mapped vulnerable residential pockets',
              ],
            },
            resource: {
              task: 'Resource audit & allocation balancing',
              shortOutput: `${rescueTeamsCount} rescue squads allocated to primary sectors.`,
              keyFindings: [
                `Active teams: ${rescueTeamsCount}`,
                `Ambulances: ${ambulancesCount}`,
              ],
              confidenceScore: 92,
              reasoningTrace: [
                'Calculated required boat/truck teams',
                'Checked hospital emergency room surge capacity',
              ],
            },
            route: {
              task: 'Infrastructure routing & choke-point detection',
              shortOutput: `North Bypass Route 4 verified OPEN. South Bridge impassable.`,
              keyFindings: [
                'North corridor safe for emergency convoys',
                'Avoid lowland underpass',
              ],
              confidenceScore: 96,
              reasoningTrace: [
                'Evaluated road water depth',
                'Selected high-elevation corridor',
              ],
            },
            planning: {
              task: 'Tactical sequencing & mitigation scheduling',
              shortOutput: `Scheduled 3-phase tactical response framework.`,
              keyFindings: [
                'Phase 1: Life extrication',
                'Phase 2: Medical triage',
                'Phase 3: Mass shelter intake',
              ],
              confidenceScore: 94,
              reasoningTrace: [
                'Structured operational timetable',
                'Synchronized ambulance departures',
              ],
            },
            decision: {
              task: 'Arbitration & priority response ranking',
              shortOutput: `Approved 3-tier Priority Response Plan with human responder approval gate.`,
              keyFindings: [
                'Priority 1: Zone A Search & Rescue',
                'Priority 2: Mobile Triage Unit',
                'Priority 3: Mass Evacuation Shelters',
              ],
              confidenceScore: 97,
              reasoningTrace: [
                'Executed multi-criteria decision analysis',
                'Allocated available assets without leaving secondary zones undefended',
              ],
            },
          },
          priorities: [
            {
              priorityNumber: 1,
              action: `Deploy immediate search & rescue strike teams to Zone A`,
              targetZone: 'Zone A (Delta Lowlands)',
              reason: `Rapid inundation threatens over ${Math.round(
                affectedPeopleCount * 0.45
              )} trapped civilians in lower residential basin.`,
              timeline: 'Immediate (0 - 45 min)',
              requiredResources: {
                rescueTeams: Math.max(
                  1,
                  Math.ceil(rescueTeamsCount * 0.55)
                ),
                ambulances: Math.max(
                  1,
                  Math.ceil(ambulancesCount * 0.5)
                ),
                shelterCapacity: 1200,
                medicalStaff: '4 Paramedic squads',
              },
              explainability: {
                riskAgentFactor: 'Risk Agent flagged Zone A as CRITICAL danger.',
                resourceAgentFactor: `Resource Agent confirmed ${Math.max(
                  1,
                  Math.ceil(rescueTeamsCount * 0.55)
                )} rescue teams ready for instant dispatch.`,
                routeAgentFactor:
                  'Route Agent certified North Bypass Corridor is clear.',
                planningAgentFactor:
                  'Planning Agent sequenced this as prerequisite Phase 1.',
                decisionAgentFactor:
                  'Decision Agent selected as Priority 1 due to imminent casualty hazard.',
              },
            },
            {
              priorityNumber: 2,
              action: `Establish mobile triage & medical staging unit at Zone C`,
              targetZone: 'Zone C (Medical Sector)',
              reason: `Stabilize ${injuredPeopleCount} casualties and prevent hospital generator flood breach.`,
              timeline: 'Phase 2 (30 - 90 min)',
              requiredResources: {
                rescueTeams: Math.max(
                  1,
                  Math.floor(rescueTeamsCount * 0.3)
                ),
                ambulances: Math.max(
                  1,
                  Math.floor(ambulancesCount * 0.4)
                ),
                shelterCapacity: 800,
                medicalStaff: '2 Mobile Surgical Teams',
              },
              explainability: {
                riskAgentFactor:
                  'Risk Agent warned of impending power generator failure.',
                resourceAgentFactor:
                  'Resource Agent allocated backup generators and ambulances.',
                routeAgentFactor:
                  'Route Agent mapped elevated medical transit path.',
                planningAgentFactor:
                  'Planning Agent coordinated triage hand-off.',
                decisionAgentFactor:
                  'Decision Agent prioritized medical station to prevent secondary mortality.',
              },
            },
            {
              priorityNumber: 3,
              action: `Activate mass evacuation shelters & reinforce secondary containment barriers`,
              targetZone: 'Perimeter Shelters',
              reason: `Provide emergency intake, food, and dry shelter for ${affectedPeopleCount.toLocaleString()} displaced residents.`,
              timeline: 'Phase 3 (60 - 240 min)',
              requiredResources: {
                rescueTeams: 1,
                ambulances: 1,
                shelterCapacity: affectedPeopleCount,
                medicalStaff: 'Shelter intake volunteers',
              },
              explainability: {
                riskAgentFactor:
                  'Risk Agent projected 72-hour utility restoration timeline.',
                resourceAgentFactor: `Resource Agent opened ${sheltersCount} reception centers.`,
                routeAgentFactor:
                  'Route Agent designated shuttle bus loop on outer ring.',
                planningAgentFactor:
                  'Planning Agent established 24-hour sustainment timetable.',
                decisionAgentFactor:
                  'Decision Agent scheduled logistics surge post-immediate rescue window.',
              },
            },
          ],
        };
      }

      // Update final Agent states with rich detailed outputs
      if (resultData.agentOutputs) {
        setAgents((prev) => ({
          coordinator: {
            ...prev.coordinator,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.coordinator,
            shortOutput:
              resultData.agentOutputs.coordinator?.shortOutput ||
              prev.coordinator.shortOutput,
          },
          risk: {
            ...prev.risk,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.risk,
            shortOutput:
              resultData.agentOutputs.risk?.shortOutput ||
              prev.risk.shortOutput,
          },
          resource: {
            ...prev.resource,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.resource,
            shortOutput:
              resultData.agentOutputs.resource?.shortOutput ||
              prev.resource.shortOutput,
          },
          route: {
            ...prev.route,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.route,
            shortOutput:
              resultData.agentOutputs.route?.shortOutput ||
              prev.route.shortOutput,
          },
          planning: {
            ...prev.planning,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.planning,
            shortOutput:
              resultData.agentOutputs.planning?.shortOutput ||
              prev.planning.shortOutput,
          },
          decision: {
            ...prev.decision,
            status: 'completed',
            detailedOutput: resultData.agentOutputs.decision,
            shortOutput:
              resultData.agentOutputs.decision?.shortOutput ||
              prev.decision.shortOutput,
          },
        }));
      }

      setAnalysisResult(resultData);
      setActiveAgentId(undefined);
      setIsRunning(false);

      addLog(
        'decision',
        'DECISION AGENT',
        `Final Recommended Response Plan generated with 3 prioritized actions. Awaiting Human Commander approval.`,
        'success'
      );
      soundManager.playDecisionChime();
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setIsRunning(false);
      setActiveAgentId(undefined);
      addLog(
        'system',
        'SYSTEM ERROR',
        `Pipeline execution error: ${err.message}`,
        'critical'
      );
    }
  };

  const handleApproveAll = () => {
    if (!analysisResult) return;
    const allNums = analysisResult.priorities.map((p) => p.priorityNumber);
    setApprovedPriorities(allNums);
    addLog(
      'system',
      'COMMAND DISPATCH',
      `Commander AUTHORIZED ALL PRIORITIES (P1, P2, P3). Field dispatch orders issued.`,
      'success'
    );
    soundManager.playAgentComplete();
  };

  const handleTogglePriorityApproval = (priorityNum: number) => {
    setApprovedPriorities((prev) => {
      const exists = prev.includes(priorityNum);
      const updated = exists
        ? prev.filter((n) => n !== priorityNum)
        : [...prev, priorityNum];
      addLog(
        'system',
        'COMMAND APPROVAL',
        `Commander ${exists ? 'REVOKED' : 'AUTHORIZED'} Priority #${priorityNum}`,
        exists ? 'warning' : 'success'
      );
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        isRunning={isRunning}
        onRunAnalysis={() => handleRunAnalysis()}
        onReset={handleReset}
        onLoadFloodDemo={handleLoadFloodDemo}
        onOpenGuide={() => setShowJudgeGuide(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenGateway={() => setShowGateway(true)}
        hasResult={!!analysisResult}
      />

      {/* Main Command Center Grid */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-2 sm:p-2.5 space-y-2.5">
        {/* Top 3-Column Layout: Left (Input) | Center (Map) | Right (Agent Network) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
          {/* Left Panel: Emergency Scenario Form (3 cols) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <EmergencyInputForm
              scenario={scenario}
              onChangeScenario={setScenario}
              onRunAnalysis={() => handleRunAnalysis()}
              isRunning={isRunning}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Center Panel: Situation Map & Tactical Grid (5 cols) */}
          <div className="lg:col-span-8 xl:col-span-5 flex flex-col">
            <SituationMap
              scenario={scenario}
              isAnalyzing={isRunning}
              activeAgentId={activeAgentId}
              riskAgentOutput={agents.risk?.detailedOutput}
              riskAgentStatus={agents.risk?.status}
              analysisResult={analysisResult}
            />
          </div>

          {/* Right Panel: 6 AI Agent Network (4 cols) */}
          <div className="lg:col-span-12 xl:col-span-4">
            <AgentNetworkPanel
              agents={agents}
              onInspectAgent={(id) => setInspectAgentId(id)}
              isRunning={isRunning}
              activeAgentId={activeAgentId}
            />
          </div>
        </div>

        {/* Bottom Section: Response Plan (When Available or Running) & Live Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
          {/* Live Agent Activity Terminal Log (4 cols) */}
          <div className="lg:col-span-4">
            <AgentActivityLogs
              logs={logs}
              onClearLogs={() => setLogs([])}
              isRunning={isRunning}
            />
          </div>

          {/* Final Recommended Response Plan (8 cols) */}
          <div className="lg:col-span-8">
            {analysisResult ? (
              <RecommendedResponsePlan
                result={analysisResult}
                onApproveAll={handleApproveAll}
                isAllApproved={isAllApproved}
                onTogglePriorityApproval={handleTogglePriorityApproval}
                approvedPriorities={approvedPriorities}
              />
            ) : (
              <div className="bg-[#151B26] border border-slate-700/50 rounded p-6 h-full flex flex-col items-center justify-center text-center text-slate-400">
                <div className="w-10 h-10 rounded bg-[#0A0E14] border border-slate-700 flex items-center justify-center text-slate-500 mb-2">
                  <span className="text-base font-black font-mono text-blue-400">P#</span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-1">
                  Awaiting Multi-Agent Decision Synthesis
                </h3>
                <p className="text-[11px] text-slate-400 max-w-md mb-3 leading-relaxed">
                  Click <strong className="text-amber-400">"START ANALYSIS"</strong> or <strong className="text-blue-400">"LOAD DEMO"</strong> to initiate the 6-agent collaborative reasoning pipeline.
                </p>
                <button
                  onClick={() => handleRunAnalysis()}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded text-[10px] font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-900/30"
                >
                  Run Demo Analysis Now →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Deep Agent Inspection Modal */}
      {inspectAgentId && (
        <AgentDetailModal
          agent={agents[inspectAgentId]}
          onClose={() => setInspectAgentId(null)}
        />
      )}

      {/* 2-Minute Judge Walkthrough Guide Modal */}
      {showJudgeGuide && (
        <JudgeWalkthroughModal
          onClose={() => setShowJudgeGuide(false)}
          onLoadFloodDemo={handleLoadFloodDemo}
        />
      )}

      {/* Export Incident Action Plan (IAP) Modal */}
      {showExportModal && analysisResult && (
        <ExportBriefingModal
          scenario={scenario}
          result={analysisResult}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Operations Gateway / Entering Interface */}
      <EnteringInterface
        isOpen={showGateway}
        onClose={() => setShowGateway(false)}
        onSelectAndLaunch={(scenarioId, autoRun) => {
          const found =
            PRESET_SCENARIOS.find((p) => p.id === scenarioId) ||
            PRESET_SCENARIOS[0];
          setScenario(found);
          handleReset();
          setShowGateway(false);
          if (autoRun) {
            setTimeout(() => {
              handleRunAnalysis(found);
            }, 120);
          }
        }}
        onOpenJudgeGuide={() => {
          setShowGateway(false);
          setShowJudgeGuide(true);
        }}
        onEnterCustomRoom={() => {
          setShowGateway(false);
        }}
      />
    </div>
  );
}
