import React, { useState, useEffect } from "react";
import { Droplet, AlertTriangle, ShieldCheck, MapPin, Radio, Activity, Compass } from "lucide-react";

export default function FloodGrid() {
  const [rainfall, setRainfall] = useState(65); // mm/hr
  const [drainageCapacity, setDrainageCapacity] = useState(70); // % efficiency
  const [lagoonLevel, setLagoonLevel] = useState(3.4); // meters

  // Derived state calculations
  const simulatedRiverLevel = Math.min(10, +(lagoonLevel + (rainfall * 0.05) - (drainageCapacity * 0.02)).toFixed(2));
  const flashFloodRisk = Math.min(100, Math.round((rainfall * 1.3) + (100 - drainageCapacity) * 0.5));
  
  const isDanger = simulatedRiverLevel > 5.5;
  const isExtreme = simulatedRiverLevel > 7.5;

  const vulnerableZones = [
    { zone: "Lokoja Confluence Delta", vulnerability: "Critical Depth", population: "140K", evacuationStatus: "Yellow Advisory" },
    { zone: "Anambra River Basin Area", vulnerability: "Low Silt-line", population: "220K", evacuationStatus: "Safe" },
    { zone: "Ikorodu Coastal Flats", vulnerability: "Sea Level Backflow", population: "310K", evacuationStatus: isDanger ? "Immediate Evacuation" : "Monitoring" },
    { zone: "Kaduna North Plains", vulnerability: "Upland Runoff", population: "85K", evacuationStatus: "Safe" },
  ];

  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);

  const dispatchWarning = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setActiveAlerts((prev) => [
        `[${new Date().toLocaleTimeString()}] EMERGENCY CELL BROADCAST: Critical Flood crest (${simulatedRiverLevel}m) approaching Niger Delta Basin. Move inland!`,
        ...prev,
      ]);
      setIsDispatching(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Left controls & gauges */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-800">
            <Droplet className="h-24 w-24 -mr-6 -mt-6 opacity-10" />
          </div>
          
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-emerald-400" />
            HYDROMETRIC CALIBRATION
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Precipitation Index:</span>
                <span className="text-emerald-400 font-bold">{rainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={rainfall}
                onChange={(e) => setRainfall(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Drizzle</span>
                <span>Torrential Outflow</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Canal Drainage Cleared:</span>
                <span className="text-emerald-400 font-bold">{drainageCapacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={drainageCapacity}
                onChange={(e) => setDrainageCapacity(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Clogged Pit-line</span>
                <span>Highflow Spreads</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Station Sea-Baseline:</span>
                <span className="text-emerald-400 font-bold">{lagoonLevel}m</span>
              </div>
              <input
                type="range"
                min="1"
                step="0.1"
                max="6"
                value={lagoonLevel}
                onChange={(e) => setLagoonLevel(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Telemetry output */}
        <div className="bg-slate-905 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Activity className="h-4 w-4 mr-1 text-emerald-400 animate-pulse" />
            LOKOJA CREST PREDICTIONS
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500">CONFLUENCE CREST</span>
              <span className={`text-2xl font-mono font-bold ${isExtreme ? "text-rose-500 animate-pulse" : isDanger ? "text-amber-500" : "text-emerald-400"}`}>
                {simulatedRiverLevel}m
              </span>
              <span className="text-[9px] font-mono text-slate-400">Critical warning: 5.50m</span>
            </div>

            <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500">SURGE RISK RATE</span>
              <span className={`text-2xl font-mono font-bold ${flashFloodRisk > 75 ? "text-rose-500" : flashFloodRisk > 45 ? "text-amber-500" : "text-emerald-400"}`}>
                {flashFloodRisk}%
              </span>
              <span className="text-[9px] font-mono text-slate-400">Calculated composite</span>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-lg border text-xs font-mono ${
            isExtreme 
              ? "bg-rose-950/20 text-rose-300 border-rose-500/20" 
              : isDanger 
                ? "bg-amber-950/20 text-amber-300 border-amber-500/20" 
                : "bg-emerald-950/20 text-emerald-300 border-emerald-500/20"
          }`}>
            <div className="flex items-start space-x-2">
              <AlertTriangle className={`h-4 w-4 shrink-0 ${isDanger ? "animate-bounce text-amber-500" : "text-emerald-400"}`} />
              <div>
                <p className="font-bold uppercase tracking-wider">
                  {isExtreme ? "Extreme Spill Impending" : isDanger ? "High Silt Warning Active" : "Operational Standard"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isExtreme 
                    ? "River level exceedance of 7.50m indicates immediate overflow potential of Shiroro spillways."
                    : isDanger 
                      ? "Sediment buffers exceeded. Slow flow rates coupled with backflow in Lekki creeks predicted."
                      : "Hydrological thresholds remain stable. All flow gates maintaining active discharge profiles."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geospatial Map Visualizer */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
              <Compass className="h-4 w-4 mr-1 text-emerald-400" />
              SOVEREIGN ELEVATION & HYDRAULIC SIMULATION
            </h3>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/10">
              HYDROLOGICAL FLOW GRAPH
            </span>
          </div>

          {/* Interactive Simulation Map Canvas / Vector layout */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl relative flex-1 min-h-[300px] flex items-center justify-center p-4 overflow-hidden">
            {/* Background Map Contours Simulated */}
            <svg viewBox="0 0 800 400" className="w-full h-full max-h-[350px]">
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="highRiskGrad">
                  <stop offset="30%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid map pattern */}
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Geographic elevation rings */}
              <path d="M 50,200 Q 150,120 300,180 T 600,100 T 750,220" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
              <path d="M 120,300 C 220,240 400,320 540,260 S 710,360 780,290" fill="none" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.15" />

              {/* River Network Stream */}
              <path
                d="M 0,160 Q 200,150 350,230 T 800,210"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth={simulatedRiverLevel * 3 + 2}
                className="transition-all duration-500"
              />
              <path
                d="M 330,225 Q 400,320 480,380"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth={simulatedRiverLevel * 1.8 + 1}
                className="transition-all duration-500"
              />

              {/* Active Flooded Regions - gowing Red when danger */}
              {isDanger && (
                <>
                  <circle cx="350" cy="230" r={simulatedRiverLevel * 12} fill="url(#highRiskGrad)" />
                  <circle cx="580" cy="220" r={simulatedRiverLevel * 10} fill="url(#highRiskGrad)" />
                  <circle cx="710" cy="210" r={simulatedRiverLevel * 8} fill="url(#highRiskGrad)" />
                </>
              )}

              {/* Station Indicators */}
              <g className="cursor-pointer group">
                <circle cx="350" cy="230" r="6" fill="#f59e0b" className="animate-ping" />
                <circle cx="350" cy="230" r="4" fill="#f59e0b" />
                <text x="360" y="225" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">Lokoja Gauge Hub</text>
              </g>

              <g className="cursor-pointer">
                <circle cx="580" cy="220" r="4" fill="#22c55e" />
                <text x="590" y="215" fill="#94a3b8" fontSize="9" fontFamily="monospace">Anambra Basin Gate</text>
              </g>

              <g className="cursor-pointer">
                <circle cx="710" cy="210" r="4" fill="#14b8a6" />
                <text x="720" y="205" fill="#94a3b8" fontSize="9" fontFamily="monospace">Delta Hydrometrics</text>
              </g>

              {/* Indicator Panel */}
              <text x="20" y="30" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">MODE: SATELLITE TERRAIN SCAN</text>
              <text x="20" y="45" fill="#475569" fontSize="9" fontFamily="monospace">
                Precipitation: {rainfall}mm/hr | Runoff Coefficient: 0.82
              </text>
            </svg>

            {/* Float visual alerts */}
            {isExtreme && (
              <div className="absolute top-4 right-4 bg-rose-950/90 text-rose-300 border border-rose-500 text-[10px] uppercase font-mono px-2 py-1 rounded-md animate-pulse">
                STATE ALERT: RED FLOOD SPILL OUTBURST
              </div>
            )}
          </div>

          {/* Bottom dispatch tray */}
          <div className="mt-5 flex flex-col md:flex-row items-center justify-between border-t border-slate-800 pt-4 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Emergency Dispatches Coordinated From Center</p>
                <p className="text-[10px] text-slate-500 font-mono">Integrated directly into Nigeria Civil Defense & NEMA emergency towers.</p>
              </div>
            </div>
            
            <button
              onClick={dispatchWarning}
              disabled={isDispatching}
              className={`font-mono text-xs w-full md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
                isDanger
                  ? "bg-rose-600 hover:bg-rose-500 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
              }`}
            >
              <Radio className={`h-4 w-4 ${isDispatching ? "animate-spin" : "animate-pulse"}`} />
              <span>{isDispatching ? "TRANSMITTING CELL SPILL..." : "DISPATCH REGIONAL WARN-BROADCAST"}</span>
            </button>
          </div>
        </div>

        {/* Community evacuation state */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
            VULNERABLE ZONE EXPOSURE LOG
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 pb-2">
                  <th className="pb-2 font-medium">SECTOR LOCATION</th>
                  <th className="pb-2 font-medium">HYDROLOGICAL COMPROMISE</th>
                  <th className="pb-2 font-medium text-right">POPULATION IMPACT</th>
                  <th className="pb-2 font-medium text-right">MIGRATION DISPOSITION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {vulnerableZones.map((vz, idx) => {
                  const dangerStatus = vz.evacuationStatus === "Immediate Evacuation" || isDanger && vz.zone.includes("Delta");
                  return (
                    <tr key={idx} className="hover:bg-slate-850/40">
                      <td className="py-2.5 flex items-center space-x-1.5 font-sans font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${dangerStatus ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
                        <span>{vz.zone}</span>
                      </td>
                      <td className="py-2.5 text-slate-400">{vz.vulnerability}</td>
                      <td className="py-2.5 text-right">{vz.population}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          dangerStatus 
                            ? "bg-rose-950/40 text-rose-400 border border-rose-500/10" 
                            : vz.evacuationStatus.includes("Yellow") 
                              ? "bg-amber-950/40 text-amber-400" 
                              : "bg-emerald-950/40 text-emerald-400"
                        }`}>
                          {dangerStatus ? "IMMEDIATE EVACUATE" : vz.evacuationStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {activeAlerts.length > 0 && (
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 max-h-[100px] overflow-y-auto">
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">ACTIVE TRANSMISSIONS:</span>
              {activeAlerts.map((alert, i) => (
                <p key={i} className="text-[10px] font-mono text-slate-400">{alert}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
