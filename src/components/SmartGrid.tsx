import React, { useState } from "react";
import { Zap, AlertTriangle, BatteryCharging, Activity, Settings, RefreshCw } from "lucide-react";

export default function SmartGrid() {
  const [gridPayload, setGridPayload] = useState(4800); // MW
  const [theftFilter, setTheftFilter] = useState(45); // %
  const [solarCoupling, setSolarCoupling] = useState(25); // %
  const [batteryStandby, setBatteryStandby] = useState(60); // %

  // Derived Telemetry Values
  const totalCapacity = 5200; // Base generation MW
  const solarCapacity = Math.round(900 * (solarCoupling / 100));
  const compositeCapacity = totalCapacity + solarCapacity;
  const compositeLoadFactor = Math.min(100, Math.round((gridPayload / compositeCapacity) * 100));
  
  const outageLikelihood = Math.max(0, Math.min(100, Math.round(
    (compositeLoadFactor > 85 ? (compositeLoadFactor - 85) * 4 : 0) + 
    (100 - batteryStandby) * 0.2 + 
    (100 - theftFilter) * 0.45
  )));

  const initialDists = [
    { name: "Ikeja Industrial Ring", code: "SUB-IKJ-01", demand: 1450, capacity: 1500, state: "Active Load" },
    { name: "Lekki Residential Phase-1", code: "SUB-LKK-02", demand: 1100, capacity: 1200, state: "Active Load" },
    { name: "Ibadan Distribution Feed-B", code: "SUB-IBD-03", demand: 850, capacity: 800, state: "LIMIT LIMIT OVERRIDE" },
    { name: "Kaduna Smelters Core", code: "SUB-KAD-01", demand: 900, capacity: 950, state: "Active Load" },
    { name: "Kano Commercial Grid Node", code: "SUB-KAN-02", demand: 500, capacity: 750, state: "Optimal Flow" },
  ];

  const [distributors, setDistributors] = useState(initialDists);
  const [balancing, setBalancing] = useState(false);

  const solarBatteryBalance = () => {
    setBalancing(true);
    setTimeout(() => {
      setSolarCoupling(65);
      setBatteryStandby(90);
      setGridPayload(prev => Math.max(3500, prev - 450));
      setDistributors(prev =>
        prev.map(d => d.state === "LIMIT LIMIT OVERRIDE" ? { ...d, state: "SOLAR BUFFER DOCKED", demand: 760 } : d)
      );
      setBalancing(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Settings className="h-4 w-4 mr-1 text-emerald-400" />
            GRID LOAD CONTROL BOARD
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Total Grid Load Level:</span>
                <span className="text-emerald-400 font-bold">{gridPayload} MW</span>
              </div>
              <input
                type="range"
                min="2000"
                max="6500"
                value={gridPayload}
                onChange={(e) => setGridPayload(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Off-Peak (2GW)</span>
                <span>Max Generation Cap</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Smart Theft Filtering:</span>
                <span className="text-emerald-400 font-bold">{theftFilter}% Silt</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={theftFilter}
                onChange={(e) => setTheftFilter(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Solar Coupled Interfacing:</span>
                <span className="text-emerald-400 font-bold">{solarCoupling}% Active</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={solarCoupling}
                onChange={(e) => setSolarCoupling(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Battery Backplane Capacity:</span>
                <span className="text-emerald-400 font-bold">{batteryStandby}% Standby</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={batteryStandby}
                onChange={(e) => setBatteryStandby(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Telemetry output */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Activity className="h-4 w-4 mr-1 text-emerald-400" />
            STATIONS RISK PREDICTIONS
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500">CAPACITY INDEX</span>
              <span className={`text-2xl font-mono font-bold ${compositeLoadFactor > 85 ? "text-rose-500" : "text-emerald-400"}`}>
                {compositeLoadFactor}%
              </span>
              <span className="text-[9px] font-mono text-slate-400">Max limit is 100%</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500">COLLAPSE RISK</span>
              <span className={`text-2xl font-mono font-bold ${outageLikelihood > 45 ? "text-rose-500" : "text-emerald-400"}`}>
                {outageLikelihood}%
              </span>
              <span className="text-[9px] font-mono text-slate-400">Real-time composite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid mapping & details */}
      <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
                <BatteryCharging className="h-4 w-4 mr-1 text-emerald-400" />
                TRANSMISSION SUBSTATIONS FEEDBACK MATRIX
              </h3>
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                NATIONAL GRID SIMULATOR
              </span>
            </div>

            {/* Simulated Grid Nodes UI */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {distributors.map((d, index) => {
                const isLimit = d.state === "LIMIT LIMIT OVERRIDE" || d.demand > d.capacity;
                return (
                  <div key={index} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-emerald-500/20 transition relative overflow-hidden">
                    {isLimit && <div className="absolute top-0 right-0 bg-rose-500 w-1 h-full animate-pulse" />}
                    <span className="text-[10px] font-mono text-slate-400 font-bold block truncate">{d.name}</span>
                    <span className="text-[9px] font-mono text-slate-600 block mb-2">{d.code}</span>
                    
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-500">Demand:</span>
                        <span className="text-slate-300 font-semibold">{d.demand}MW</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-500">Cap:</span>
                        <span className="text-slate-300">{d.capacity}MW</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded text-center truncate ${
                      isLimit 
                        ? "bg-rose-950/50 text-rose-400 border border-rose-500/10" 
                        : d.state.includes("SOLAR")
                          ? "bg-amber-950/50 text-amber-400 border border-amber-500/10"
                          : "bg-emerald-950/50 text-emerald-400 border border-emerald-500/10"
                    }`}>
                      {d.state}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-emerald-400 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Grid Stabilization AI Loop Active</p>
                <p className="text-[10px] text-slate-500 font-mono">Dynamic Volt-VAR controller coupling solar farm grids to balance state frequencies.</p>
              </div>
            </div>

            <button
              onClick={solarBatteryBalance}
              disabled={balancing || (solarCoupling === 65 && batteryStandby === 90)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs w-full md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${balancing ? "animate-spin" : ""}`} />
              <span>{balancing ? "BALANCING FREQUENCY..." : "ENGAGE VOLT-WAR OPTIMIZER"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
