import React, { useMemo } from 'react';
import * as d3 from 'd3';
import {
  AgentDetailedOutput,
  AgentStatus,
  EmergencyScenario,
  MapZone,
} from '../types/emergency';

interface D3RiskHeatmapProps {
  scenario: EmergencyScenario;
  riskAgentOutput?: AgentDetailedOutput;
  riskAgentStatus?: AgentStatus;
  isAnalyzing: boolean;
  activeAgentId?: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  opacity?: number;
  showContourLines?: boolean;
  showIsoLabels?: boolean;
  visualizationMode?: 'contours' | 'density' | 'both';
  onHoverHotspot?: (info: { zoneName: string; dangerIndex: number; x: number; y: number } | null) => void;
}

export interface ZoneDangerInfo {
  zone: MapZone;
  dangerIndex: number; // 0.0 - 10.0
  threatTier: 'EXTREME' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE';
  color: string;
  contributingFactors: string[];
}

export const D3RiskHeatmap: React.FC<D3RiskHeatmapProps> = ({
  scenario,
  riskAgentOutput,
  riskAgentStatus,
  isAnalyzing,
  activeAgentId,
  viewBoxWidth = 600,
  viewBoxHeight = 360,
  opacity = 0.75,
  showContourLines = true,
  showIsoLabels = true,
  visualizationMode = 'both',
  onHoverHotspot,
}) => {
  const zones = scenario?.zones || [];

  // 1. Calculate dynamically calibrated Danger Indices for each zone based on Risk Agent & Scenario
  const zoneThreatData = useMemo<ZoneDangerInfo[]>(() => {
    return zones.map((zone) => {
      // Base danger score
      let baseScore = 1.0;
      if (zone.riskLevel === 'CRITICAL') baseScore = 8.8;
      else if (zone.riskLevel === 'HIGH') baseScore = 6.8;
      else if (zone.riskLevel === 'MEDIUM') baseScore = 4.6;
      else if (zone.riskLevel === 'LOW') baseScore = 2.4;
      else if (zone.riskLevel === 'SAFE') baseScore = 0.6;

      const factors: string[] = [`Base Zone Hazard: ${zone.riskLevel}`];

      // Population density factor
      if (zone.population > 5000) {
        baseScore += 0.5;
        factors.push(`High Density Population (${zone.population.toLocaleString()})`);
      }

      // Risk Agent findings integration
      if (riskAgentOutput) {
        const isMentionedHighRisk =
          riskAgentOutput.highRiskZones?.some((hz) =>
            hz.toLowerCase().includes(zone.name.toLowerCase()) ||
            hz.toLowerCase().includes(zone.code.toLowerCase())
          ) ||
          riskAgentOutput.keyFindings?.some((kf) =>
            kf.toLowerCase().includes(zone.name.toLowerCase()) ||
            kf.toLowerCase().includes(zone.code.toLowerCase())
          );

        if (isMentionedHighRisk) {
          baseScore = Math.min(10.0, baseScore + 1.2);
          factors.push('Risk Agent: Prioritized Threat Hotspot');
        }

        if (riskAgentOutput.riskGrade === 'CRITICAL' && zone.riskLevel === 'CRITICAL') {
          baseScore = Math.min(10.0, baseScore + 0.5);
          factors.push('Risk Agent: Critical Systemic Alert');
        }
      }

      // Clamped score
      const dangerIndex = Number(Math.min(10.0, Math.max(0.1, baseScore)).toFixed(1));

      let threatTier: ZoneDangerInfo['threatTier'] = 'SAFE';
      if (dangerIndex >= 9.0) threatTier = 'EXTREME';
      else if (dangerIndex >= 7.5) threatTier = 'CRITICAL';
      else if (dangerIndex >= 5.5) threatTier = 'HIGH';
      else if (dangerIndex >= 3.5) threatTier = 'MODERATE';
      else if (dangerIndex >= 1.5) threatTier = 'LOW';

      // D3 Color interpolation for threat tier
      const color = d3.interpolateInferno((dangerIndex / 10) * 0.9 + 0.1);

      return {
        zone,
        dangerIndex,
        threatTier,
        color,
        contributingFactors: factors,
      };
    });
  }, [zones, riskAgentOutput]);

  // 2. D3 2D Density Grid & Iso-Risk Contour Generation
  const { contourPaths, gridWidth, gridHeight } = useMemo(() => {
    const gw = 120;
    const gh = 72;
    const gridValues: number[] = new Array(gw * gh).fill(0);

    const scaleX = viewBoxWidth / gw;
    const scaleY = viewBoxHeight / gh;

    // Populate risk intensity field via weighted Gaussian decay around zone centroids
    for (let gy = 0; gy < gh; gy++) {
      const mapY = (gy + 0.5) * scaleY;
      for (let gx = 0; gx < gw; gx++) {
        const mapX = (gx + 0.5) * scaleX;
        let cumulativeRisk = 0;

        for (const threat of zoneThreatData) {
          const cx = threat.zone.centroid.x;
          const cy = threat.zone.centroid.y;
          const dx = mapX - cx;
          const dy = mapY - cy;
          const distSq = dx * dx + dy * dy;

          // Sigma influence radius based on zone severity
          const sigma = threat.dangerIndex >= 7.5 ? 65 : 50;
          const sigmaSq2 = 2 * sigma * sigma;

          const influence = threat.dangerIndex * Math.exp(-distSq / sigmaSq2);
          cumulativeRisk += influence;
        }

        // Clamp field values to 0 - 10 range
        gridValues[gy * gw + gx] = Math.min(10.0, cumulativeRisk);
      }
    }

    // Generate D3 Iso-Risk Contours
    const thresholds = [1.2, 2.5, 4.0, 5.5, 7.0, 8.5, 9.4];
    const contourGenerator = d3.contours().size([gw, gh]).thresholds(thresholds);
    const rawContours = contourGenerator(gridValues);

    const geoPath = d3.geoPath();

    // D3 Color scale for contour bands
    // Map value 0 -> 10 to a vivid tactical thermal palette (Cyan -> Green -> Amber -> Orange -> Red -> Crimson)
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 1.5, 3.5, 5.5, 7.5, 9.0, 10.0])
      .range([
        'rgba(16, 185, 129, 0.05)',
        'rgba(6, 182, 212, 0.22)',
        'rgba(245, 158, 11, 0.38)',
        'rgba(249, 115, 22, 0.55)',
        'rgba(239, 68, 68, 0.72)',
        'rgba(190, 24, 93, 0.88)',
        'rgba(147, 51, 234, 0.95)',
      ]);

    const strokeColorScale = d3
      .scaleLinear<string>()
      .domain([0, 2.5, 5.5, 7.5, 9.0, 10.0])
      .range([
        'rgba(16, 185, 129, 0.3)',
        'rgba(6, 182, 212, 0.6)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(249, 115, 22, 0.95)',
        'rgba(239, 68, 68, 1.0)',
        'rgba(217, 70, 239, 1.0)',
      ]);

    const paths = rawContours.map((c) => {
      const d = geoPath(c);
      const val = c.value;
      return {
        d,
        value: val,
        fill: colorScale(val),
        stroke: strokeColorScale(val),
        label: `ISO ${val.toFixed(1)}`,
      };
    });

    return {
      contourPaths: paths,
      gridWidth: gw,
      gridHeight: gh,
    };
  }, [zoneThreatData, viewBoxWidth, viewBoxHeight]);

  const scaleX = viewBoxWidth / gridWidth;
  const scaleY = viewBoxHeight / gridHeight;

  const isRiskScanning = isAnalyzing && (activeAgentId === 'risk' || riskAgentStatus === 'analyzing');

  return (
    <g className="d3-risk-heatmap-layer transition-opacity duration-300 pointer-events-auto" opacity={opacity}>
      <defs>
        {/* Dynamic D3 radial gradients for thermal density centroids */}
        {zoneThreatData.map((zt) => {
          const isCritical = zt.dangerIndex >= 7.5;
          return (
            <radialGradient
              key={`heat-rad-${zt.zone.id}`}
              id={`heat-rad-${zt.zone.id}`}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop
                offset="0%"
                stopColor={isCritical ? '#ef4444' : zt.dangerIndex >= 5.0 ? '#f97316' : '#06b6d4'}
                stopOpacity={isCritical ? '0.85' : '0.65'}
              />
              <stop
                offset="40%"
                stopColor={isCritical ? '#dc2626' : zt.dangerIndex >= 5.0 ? '#eab308' : '#10b981'}
                stopOpacity="0.45"
              />
              <stop offset="85%" stopColor="#0f172a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          );
        })}

        {/* Heatmap blur filter */}
        <filter id="d3-heat-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Mode 1 & Both: D3 Contour Polygons (Scaled to SVG ViewBox) */}
      {(visualizationMode === 'contours' || visualizationMode === 'both') && (
        <g
          transform={`scale(${scaleX}, ${scaleY})`}
          filter="url(#d3-heat-blur)"
          className="d3-contours-group"
        >
          {contourPaths.map((cp, idx) => {
            if (!cp.d) return null;
            return (
              <path
                key={`contour-${idx}`}
                d={cp.d}
                fill={cp.fill}
                stroke={showContourLines ? cp.stroke : 'none'}
                strokeWidth={showContourLines ? (cp.value >= 7.0 ? '0.9' : '0.5') : '0'}
                strokeDasharray={cp.value < 4.0 ? '2,2' : undefined}
                className="transition-all duration-300"
              />
            );
          })}
        </g>
      )}

      {/* Mode 2 & Both: Thermal Radial Density Glow Fields */}
      {(visualizationMode === 'density' || visualizationMode === 'both') && (
        <g className="d3-thermal-density-group pointer-events-none">
          {zoneThreatData.map((zt) => {
            const rad = Math.max(38, zt.dangerIndex * 8.5);
            return (
              <circle
                key={`rad-glow-${zt.zone.id}`}
                cx={zt.zone.centroid.x}
                cy={zt.zone.centroid.y}
                r={rad}
                fill={`url(#heat-rad-${zt.zone.id})`}
                className={isRiskScanning ? 'animate-pulse' : undefined}
              />
            );
          })}
        </g>
      )}

      {/* Dynamic D3 Danger Index Badges & Hotspot Interactivity */}
      <g className="d3-danger-index-nodes">
        {zoneThreatData.map((zt) => {
          const isExtreme = zt.dangerIndex >= 8.5;
          const isHigh = zt.dangerIndex >= 6.5;

          return (
            <g
              key={`hotspot-node-${zt.zone.id}`}
              transform={`translate(${zt.zone.centroid.x}, ${zt.zone.centroid.y})`}
              onMouseEnter={() =>
                onHoverHotspot &&
                onHoverHotspot({
                  zoneName: zt.zone.name,
                  dangerIndex: zt.dangerIndex,
                  x: zt.zone.centroid.x,
                  y: zt.zone.centroid.y,
                })
              }
              onMouseLeave={() => onHoverHotspot && onHoverHotspot(null)}
              className="cursor-pointer group"
            >
              {/* Pulsing ring for extreme / critical threat hot points */}
              {(isExtreme || isRiskScanning) && (
                <circle
                  cx="0"
                  cy="0"
                  r={isExtreme ? '20' : '14'}
                  fill="none"
                  stroke={isExtreme ? '#ef4444' : '#f59e0b'}
                  strokeWidth="1.5"
                  className="animate-ping opacity-60"
                />
              )}

              {/* Danger Score Circular Micro-Gauge */}
              <circle
                cx="0"
                cy="0"
                r="11"
                fill="#0A0E14"
                stroke={isExtreme ? '#ef4444' : isHigh ? '#f97316' : '#06b6d4'}
                strokeWidth={isExtreme ? '2' : '1.5'}
                className="group-hover:scale-110 transition-transform"
              />
              <text
                x="0"
                y="3.5"
                fill={isExtreme ? '#fca5a5' : isHigh ? '#fed7aa' : '#a5f3fc'}
                fontSize="8.5"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {zt.dangerIndex.toFixed(1)}
              </text>

              {/* Iso Risk Tag Floating Label */}
              {showIsoLabels && (
                <g transform="translate(0, -16)">
                  <rect
                    x="-24"
                    y="-8"
                    width="48"
                    height="13"
                    rx="3"
                    fill="#0A0E14"
                    stroke={isExtreme ? '#ef4444' : '#64748b'}
                    strokeWidth="0.75"
                    opacity="0.92"
                  />
                  <text
                    x="0"
                    y="1.5"
                    fill={isExtreme ? '#ef4444' : '#e2e8f0'}
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {zt.threatTier}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
};
