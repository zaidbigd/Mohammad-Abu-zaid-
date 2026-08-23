export type DisasterType = 'Flood' | 'Earthquake' | 'Fire' | 'Cyclone' | 'Chemical' | 'Other';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AgentType = 'coordinator' | 'risk' | 'resource' | 'route' | 'planning' | 'decision';

export type AgentStatus = 'idle' | 'waiting' | 'analyzing' | 'completed' | 'error';

export interface MapZone {
  id: string;
  name: string;
  code: string;
  riskLevel: SeverityLevel | 'SAFE';
  population: number;
  hazards: string[];
  status: string;
  color: string;
  polygon: string; // SVG path or polygon points
  centroid: { x: number; y: number };
}

export interface MapFacility {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'fire_station' | 'staging_area';
  x: number;
  y: number;
  capacity: number;
  currentUsage: number;
  status: 'operational' | 'congested' | 'compromised' | 'standby';
  description: string;
}

export interface RoadObstacle {
  id: string;
  name: string;
  from: [number, number];
  to: [number, number];
  status: 'blocked' | 'hazard' | 'clear';
  reason: string;
}

export interface RescueRoute {
  id: string;
  name: string;
  points: Array<[number, number]>;
  status: 'primary_recommended' | 'secondary' | 'compromised';
  etaMinutes: number;
}

export interface EmergencyScenario {
  id: string;
  title: string;
  disasterType: DisasterType;
  location: string;
  severity: SeverityLevel;
  affectedPeople: number;
  injuredPeople: number;
  rescueTeams: number;
  ambulances: number;
  shelters: number;
  roadConditions: string;
  additionalInfo: string;
  zones: MapZone[];
  facilities: MapFacility[];
  roadObstacles: RoadObstacle[];
  rescueRoutes: RescueRoute[];
}

export interface AgentDetailedOutput {
  task: string;
  shortOutput: string;
  keyFindings: string[];
  confidenceScore: number;
  reasoningTrace: string[];
  metrics?: Record<string, string | number>;
  riskGrade?: string;
  highRiskZones?: string[];
  resourceStatus?: string;
  allocatedTeams?: number;
  allocatedAmbulances?: number;
  clearedCorridors?: string[];
  blockedHazards?: string[];
  phases?: string[];
  tradeOffRationale?: string;
}

export interface AgentNodeState {
  id: AgentType;
  name: string;
  role: string;
  status: AgentStatus;
  progress: number; // 0 - 100
  task: string;
  shortOutput: string;
  detailedOutput?: AgentDetailedOutput;
}

export interface AgentMessageLog {
  id: string;
  timestamp: string;
  agentId: AgentType | 'system';
  agentName: string;
  text: string;
  level: 'info' | 'warning' | 'critical' | 'success';
}

export interface PriorityExplainability {
  riskAgentFactor: string;
  resourceAgentFactor: string;
  routeAgentFactor: string;
  planningAgentFactor: string;
  decisionAgentFactor: string;
}

export interface ResponsePriority {
  priorityNumber: number;
  action: string;
  targetZone: string;
  reason: string;
  timeline: string;
  requiredResources: {
    rescueTeams: number;
    ambulances: number;
    shelterCapacity: number;
    medicalStaff?: string;
    specialEquipment?: string[];
  };
  explainability: PriorityExplainability;
  approved?: boolean;
}

export interface MultiAgentAnalysisResult {
  overallRisk: SeverityLevel;
  estimatedCasualtiesProjected: number;
  topPrioritySummary: string;
  strategicReasoning: string;
  agentOutputs: Record<AgentType, AgentDetailedOutput>;
  priorities: ResponsePriority[];
  isSimulatedFallback?: boolean;
  generatedAt?: string;
}
