import React, { useState } from "react";
import { Route, Play, Zap, HelpCircle, Gauge, Activity, AlertCircle } from "lucide-react";

interface JncNode {
  name: string;
  congestion: number; // 0-100%
  signalDuration: number; // seconds
  speedLimit: number; // kmh
  lastIncident: string;
}

export default function TrafficGrid() {
  const [commuteLoad, setCommuteLoad] = useState(70); // %
  const [singalPriority, setSingalPriority] = useState(45); // seconds
  const [greenWave, setGreenWave] = useState(false);

  // Constants & Computed State
  const initialRoads: JncNode[] = [
    { name: "Oshodi Expressway Interchange", congestion: 88, signalDuration: 60, speedLimit: 50, lastIncident: "Broken danfo blockages" },
    { name: "Third Mainland Bridge Span-A", congestion: 95, signalDuration: 120, speedLimit: 80, lastIncident: "None" },
    { name: "Lekki-Epe Expressway toll", congestion: 75, signalDuration: 45, speedLimit: 60, lastIncident: "None" },
    { name: "Apapa Wharf Logistic Port Gate", congestion: 92, signalDuration: 180, speedLimit: 40, lastIncident: "Container tipover" },
    { name: "Ikorodu Arterial Junction", congestion: 55, signalDuration: 30, speedLimit: 70, lastIncident: "None" }
  ];

  // Green Wave dynamic transformation
  const currentAvgSpeed = Math.round(greenWave 
    ? Math.max(15, 65 - (commuteLoad * 0.4)) 
    : Math.max(5, 45 - (commuteLoad * 0.5))
  );

  const totalIdleLiters = Math.round((commuteLoad * 1.8) * (greenWave ? 0.6 : 1.2));

  const toggleGreenWaveOpt = () => {
    setGreenWave(!greenWave);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Gauge className="h-4 w-4 mr-1 text-emerald-400" />
            URBAN LOAD GAUGES
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Peak Commuter Capacity:</span>
                <span className="text-emerald-400 font-bold">{commuteLoad}% density</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={commuteLoad}
                onChange={(e) => setCommuteLoad(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Off-Peak Flow</span>
                <span>Complete Gridlock</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Signal Intercept Priority:</span>
                <span className="text-emerald-400 font-bold">{singalPriority}s spacing</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                value={singalPriority}
                onChange={(e) => setSingalPriority(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Telemetry data summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg font-mono">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Activity className="h-4 w-4 mr-1 text-emerald-400 animate-pulse" />
            LAGOS TRANS-CONGESTION MATRICES
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-500 font-medium">FLOW METROPOLIS SPEED:</span>
              <span className="text-emerald-300 font-bold">{currentAvgSpeed} KM/H</span>
            </div>
            
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-500 font-medium">IDLING CO2 WASTES:</span>
              <span className="text-rose-400 font-bold">{totalIdleLiters}L Fuel/Min</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-[10px] leading-relaxed text-slate-400">
              <p className="font-bold text-amber-500 uppercase tracking-wide mb-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Lagos Congestion Cost
              </p>
              Lagos loses $4B annually to transit delays. Optimizing lane integration via automated Green wave corridors reduces gridlock by up to 35% on average.
            </div>
          </div>
        </div>
      </div>

      {/* Corridor matching node graph */}
      <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
                <Route className="h-4 w-4 mr-1 text-emerald-400" />
                LAGOS HIGHWAY NODE FLOW GRID
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                AI SMART TRAFFIC ROUTER
              </span>
            </div>

            {/* Simulated Lagos Junction lists */}
            <div className="space-y-3">
              {initialRoads.map((road, idx) => {
                const effectiveCongest = Math.min(100, Math.round(greenWave ? road.congestion * 0.62 : road.congestion * (commuteLoad / 70)));
                const isHeavy = effectiveCongest > 80;
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-2 h-2 rounded-full ${isHeavy ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
                      <div>
                        <span className="text-slate-200 block font-sans font-medium">{road.name}</span>
                        <span className="text-[10px] text-slate-500">{road.lastIncident !== "None" ? `⚠ ${road.lastIncident}` : "Secure Flow Corridor"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center md:text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Congestion INDEX</span>
                        <span className={`font-bold ${isHeavy ? "text-rose-400" : "text-emerald-400"}`}>{effectiveCongest}%</span>
                      </div>
                      <div className="text-center md:text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Signal spacing</span>
                        <span className="text-slate-300 font-medium">{Math.round(road.signalDuration * (singalPriority / 45))}s</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex justify-between items-center space-x-3">
              <Zap className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Green Wave Synchronization Controller</p>
                <p className="text-[10px] text-slate-500 font-mono">Optimizes phase offset timers down highway corridors to enable continuous progression.</p>
              </div>
            </div>

            <button
              onClick={toggleGreenWaveOpt}
              className={`font-mono text-xs w-full md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
                greenWave 
                  ? "bg-amber-600 hover:bg-amber-500 text-slate-950" 
                  : "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
              }`}
            >
              <Play className="h-4 w-4" />
              <span>{greenWave ? "DISENGAGE GREEN WAVE" : "ENGAGE GREEN WAVE CYCLE"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
