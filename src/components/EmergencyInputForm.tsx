import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Users,
  HeartPulse,
  Truck,
  Shield,
  Home,
  Navigation,
  FileText,
  Play,
  Sparkles,
  Zap,
  Flame,
  Waves,
  Activity,
  Wind,
} from 'lucide-react';
import {
  DisasterType,
  EmergencyScenario,
  SeverityLevel,
} from '../types/emergency';
import { PRESET_SCENARIOS } from '../data/presetScenarios';

interface EmergencyInputFormProps {
  scenario: EmergencyScenario;
  onChangeScenario: (scenario: EmergencyScenario) => void;
  onRunAnalysis: () => void;
  isRunning: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const EmergencyInputForm: React.FC<EmergencyInputFormProps> = ({
  scenario,
  onChangeScenario,
  onRunAnalysis,
  isRunning,
  onSelectPreset,
}) => {
  const handleChange = <K extends keyof EmergencyScenario>(
    field: K,
    value: EmergencyScenario[K]
  ) => {
    onChangeScenario({
      ...scenario,
      [field]: value,
    });
  };

  const disasterTypes: Array<{
    type: DisasterType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { type: 'Flood', label: 'Flood', icon: <Waves className="w-3.5 h-3.5" /> },
    {
      type: 'Earthquake',
      label: 'Earthquake',
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    { type: 'Fire', label: 'Wildfire', icon: <Flame className="w-3.5 h-3.5" /> },
    {
      type: 'Cyclone',
      label: 'Cyclone',
      icon: <Wind className="w-3.5 h-3.5" />,
    },
    {
      type: 'Other',
      label: 'Other',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
  ];

  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="bg-[#151B26] border border-slate-700/50 rounded p-3 flex flex-col gap-2.5 text-slate-200">
      {/* Panel Title & Quick Preset Bar */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Zap className="w-3 h-3" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase text-white tracking-wider leading-none">
              Scenario Parameters
            </h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Live Field Inputs & Resources
            </p>
          </div>
        </div>
      </div>

      {/* Preset Scenario Selector Chips */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-blue-400" />
          Scenario Presets
        </label>
        <div className="grid grid-cols-2 gap-1">
          {PRESET_SCENARIOS.map((p) => {
            const isSelected = scenario.id === p.id;
            return (
              <button
                key={p.id}
                id={`btn-preset-${p.id}`}
                onClick={() => onSelectPreset(p.id)}
                disabled={isRunning}
                className={`px-2 py-1 rounded text-[11px] font-semibold text-left transition flex items-center justify-between border ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                    : 'bg-[#0A0E14] border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span className="truncate">{p.disasterType} Demo</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-2">
        {/* Disaster Type */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Disaster Type
          </label>
          <div className="grid grid-cols-5 gap-1">
            {disasterTypes.map((item) => (
              <button
                key={item.type}
                id={`btn-type-${item.type}`}
                type="button"
                onClick={() => handleChange('disasterType', item.type)}
                className={`px-1.5 py-1 rounded text-[10px] font-semibold border flex items-center justify-center gap-1 transition ${
                  scenario.disasterType === item.type
                    ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                    : 'bg-[#0A0E14] border-slate-700 hover:border-slate-600 text-slate-400'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-400" />
              Incident Location
            </label>
            <input
              id="input-location"
              type="text"
              value={scenario.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Riverside Metro & Delta Basin"
              className="w-full bg-[#0A0E14] border border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-[11px] text-white placeholder-slate-600 outline-none transition"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-red-400" />
              Severity Classification
            </label>
            <div className="grid grid-cols-4 gap-1">
              {severities.map((sev) => {
                const isSelected = scenario.severity === sev;
                const colorMap = {
                  CRITICAL: isSelected
                    ? 'bg-red-500/30 border-red-500 text-red-300 font-bold'
                    : 'bg-[#0A0E14] border-slate-700 text-slate-400',
                  HIGH: isSelected
                    ? 'bg-amber-500/30 border-amber-500 text-amber-300 font-bold'
                    : 'bg-[#0A0E14] border-slate-700 text-slate-400',
                  MEDIUM: isSelected
                    ? 'bg-yellow-500/30 border-yellow-500 text-yellow-300 font-bold'
                    : 'bg-[#0A0E14] border-slate-700 text-slate-400',
                  LOW: isSelected
                    ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#0A0E14] border-slate-700 text-slate-400',
                };
                return (
                  <button
                    key={sev}
                    id={`btn-sev-${sev}`}
                    type="button"
                    onClick={() => handleChange('severity', sev)}
                    className={`py-1 rounded text-[9.5px] font-mono border text-center transition ${colorMap[sev]}`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Casualty & Impact Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-[#0A0E14] p-2 rounded border border-slate-700/60">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                Affected
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {scenario.affectedPeople.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-affected-people"
              type="range"
              min="200"
              max="25000"
              step="100"
              value={scenario.affectedPeople}
              onChange={(e) =>
                handleChange('affectedPeople', Number(e.target.value))
              }
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-rose-400" />
                Injured
              </span>
              <span className="font-mono text-rose-300 font-bold">
                {scenario.injuredPeople.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-injured-people"
              type="range"
              min="0"
              max="1000"
              step="5"
              value={scenario.injuredPeople}
              onChange={(e) =>
                handleChange('injuredPeople', Number(e.target.value))
              }
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* Available Resources (3 columns) */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Available Response Resources
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {/* Rescue Teams */}
            <div className="bg-[#0A0E14] border border-slate-700 p-1.5 rounded">
              <div className="text-[9.5px] text-slate-400 flex items-center gap-1 mb-0.5">
                <Shield className="w-2.5 h-2.5 text-blue-400" />
                Rescue
              </div>
              <div className="flex items-center justify-between">
                <input
                  id="input-rescue-teams"
                  type="number"
                  min="1"
                  max="30"
                  value={scenario.rescueTeams}
                  onChange={(e) =>
                    handleChange('rescueTeams', Math.max(1, Number(e.target.value)))
                  }
                  className="w-10 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500 uppercase">Squads</span>
              </div>
            </div>

            {/* Ambulances */}
            <div className="bg-[#0A0E14] border border-slate-700 p-1.5 rounded">
              <div className="text-[9.5px] text-slate-400 flex items-center gap-1 mb-0.5">
                <Truck className="w-2.5 h-2.5 text-rose-400" />
                Ambulances
              </div>
              <div className="flex items-center justify-between">
                <input
                  id="input-ambulances"
                  type="number"
                  min="1"
                  max="30"
                  value={scenario.ambulances}
                  onChange={(e) =>
                    handleChange('ambulances', Math.max(1, Number(e.target.value)))
                  }
                  className="w-10 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500 uppercase">Units</span>
              </div>
            </div>

            {/* Shelters */}
            <div className="bg-[#0A0E14] border border-slate-700 p-1.5 rounded">
              <div className="text-[9.5px] text-slate-400 flex items-center gap-1 mb-0.5">
                <Home className="w-2.5 h-2.5 text-emerald-400" />
                Shelters
              </div>
              <div className="flex items-center justify-between">
                <input
                  id="input-shelters"
                  type="number"
                  min="1"
                  max="15"
                  value={scenario.shelters}
                  onChange={(e) =>
                    handleChange('shelters', Math.max(1, Number(e.target.value)))
                  }
                  className="w-10 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500 uppercase">Sites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Road Conditions */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-amber-400" />
            Road / Infrastructure State
          </label>
          <input
            id="input-road-conditions"
            type="text"
            value={scenario.roadConditions}
            onChange={(e) => handleChange('roadConditions', e.target.value)}
            placeholder="e.g. 2 Bridges Submerged; North Open"
            className="w-full bg-[#0A0E14] border border-slate-700 focus:border-amber-500 rounded px-2 py-1 text-[11px] text-white placeholder-slate-600 outline-none transition"
          />
        </div>

        {/* Additional Situation Info */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-indigo-400" />
            Additional Situation Intel
          </label>
          <textarea
            id="input-additional-info"
            rows={2}
            value={scenario.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            placeholder="Additional notes on hazards or utility failures..."
            className="w-full bg-[#0A0E14] border border-slate-700 focus:border-indigo-500 rounded px-2 py-1 text-[11px] text-white placeholder-slate-600 outline-none resize-none transition"
          />
        </div>
      </div>

      {/* Main Start Emergency Analysis Button */}
      <button
        id="btn-start-emergency-analysis"
        onClick={onRunAnalysis}
        disabled={isRunning}
        className={`w-full py-2 px-3 rounded font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] ${
          isRunning
            ? 'bg-amber-600 text-white cursor-wait animate-pulse border border-amber-400'
            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
        }`}
      >
        {isRunning ? (
          <>
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Processing Pipeline...</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Analysis</span>
          </>
        )}
      </button>
    </div>
  );
};
