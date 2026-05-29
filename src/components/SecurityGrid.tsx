import React, { useState } from "react";
import { Shield, Eye, ShieldAlert, Cpu, Route, Users, Zap, AlertOctagon } from "lucide-react";

export default function SecurityGrid() {
  const [patrolDensity, setPatrolDensity] = useState(60); // %
  const [suspicionCoeff, setSuspicionCoeff] = useState(45); // %
  const [droneBattery, setDroneBattery] = useState(88); // %

  const calculatedHotspotsCount = Math.round((suspicionCoeff * 0.15) + 2);
  const dispatchResponseSeconds = Math.max(10, Math.round(300 - (patrolDensity * 3)));

  const initialNodes = [
    { id: "SEC-41", sector: "Sambisa Border Zone delta-9", lat: "11.1432", Lng: "13.4412", threat: "Critical", status: "Active Tracking", reportCount: 18 },
    { id: "SEC-12", sector: "Kaduna South Transit Ring Road", lat: "10.4215", Lng: "7.4523", threat: "High", status: "Drone Patrolled", reportCount: 12 },
    { id: "SEC-34", sector: "Niger Delta Pipeline Cluster G-3", lat: "5.5902", Lng: "6.2201", threat: "Moderate", status: "Secure", reportCount: 4 },
    { id: "SEC-08", sector: "Kano Outer Border Grid Line", lat: "12.0112", Lng: "8.6543", threat: "Low", status: "Secure", reportCount: 2 },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [activeFeeds, setActiveFeeds] = useState<string[]>([
    "[09:14:02] SENTINEL-04: Ground heat signature anomaly identified near Kaduna transit hub.",
    "[11:42:15] SENTINEL-02: Pipeline corridor cluster G-3 thermographic sweep clear - No intrusions."
  ]);

  const dispatchDefenseVector = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, status: "DISPATCHING RAPID INTERCEPT", reportCount: n.reportCount + 1 };
        }
        return n;
      })
    );
    
    const node = nodes.find(n => n.id === id);
    setActiveFeeds((prev) => [
      `[${new Date().toLocaleTimeString()}] COMMAND DISPATCH: Rapid security intercept authorized for sector ${node?.sector || id} - Ground units mobilized.`,
      ...prev
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Simulation variables column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Cpu className="h-4 w-4 mr-1 text-emerald-400" />
            BORDER & SECTOR REGIME
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Drone Patrol Density:</span>
                <span className="text-emerald-400 font-bold">{patrolDensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={patrolDensity}
                onChange={(e) => setPatrolDensity(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Response delta is {dispatchResponseSeconds} seconds.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Suspicious Activity Coefficient:</span>
                <span className="text-emerald-400 font-bold">{suspicionCoeff}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={suspicionCoeff}
                onChange={(e) => setSuspicionCoeff(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Sentinel Battery Reserve:</span>
                <span className={`font-bold ${droneBattery < 30 ? "text-rose-400" : "text-emerald-400"}`}>
                  {droneBattery}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={droneBattery}
                onChange={(e) => setDroneBattery(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Tactical Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Shield className="h-4 w-4 mr-1 text-emerald-400" />
            TACTICAL DEfENSE SUMMARY
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-500">ACTIVE HOTSPOTS:</span>
              <span className="text-rose-400 font-bold">{calculatedHotspotsCount} SECTORS</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-500">AVG DISPATCH LAPSE:</span>
              <span className="text-emerald-400 font-bold">{dispatchResponseSeconds}s</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-500">AIRBORNE SENSORS ONLINE:</span>
              <span className="text-slate-300">12 SENTINEL NETWORKS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SURVEILLANCE GROUND COVERAGE:</span>
              <span className="text-emerald-400">{(patrolDensity * 0.95).toFixed(0)}% Area Sweep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Tactical Feed & Coordinate Matrix */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
              <Route className="h-4 w-4 mr-1 text-emerald-400" />
              SENTINEL PATROL FEEDS & GEOLOCATION NODES
            </h3>
            <span className="text-[10px] font-mono text-rose-500 flex items-center">
              <Eye className="h-3 w-3 mr-1 animate-pulse" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            {/* Sector radar simulation */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-3 border border-slate-850 bg-slate-940 rounded-lg">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Live Radar Scan</span>
              <div className="relative w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-950/5 overflow-hidden flex items-center justify-center">
                {/* Sweep simulation */}
                <span className="absolute inset-0 bg-conic-gradient from-emerald-500/10 via-transparent to-transparent animate-spin duration-3000" />
                <div className="absolute w-28 h-28 rounded-full border border-emerald-500/10" />
                <div className="absolute w-16 h-16 rounded-full border border-emerald-500/10" />
                <circle cx="64" cy="64" r="3" fill="#ef4444" className="animate-ping" />
                <circle cx="85" cy="40" r="2" fill="#22c55e" />
                <circle cx="35" cy="85" r="2" fill="#22c55e" />
                <circle cx="64" cy="64" r="2" fill="#ef4444" />
              </div>
              <span className="text-[9px] font-mono text-emerald-400/80 mt-3 uppercase tracking-wider">Sambisa Sector Sync</span>
            </div>

            {/* Video telemetry stream list */}
            <div className="flex-1 w-full space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">TELEMETRY DECRYPT STEAM</span>
              <div className="bg-slate-960 border border-slate-850 p-3 rounded-lg space-y-2 text-[10px] font-mono text-slate-300 max-h-[120px] overflow-y-auto">
                {activeFeeds.map((feed, i) => (
                  <p key={i} className="leading-tight text-slate-400">
                    <span className="text-emerald-400">⚡</span> {feed}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Table of active nodes */}
          <div className="mt-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 pb-2">
                    <th className="pb-2 font-medium">NODE COORDINATE</th>
                    <th className="pb-2 font-medium">SECTOR FOCUS</th>
                    <th className="pb-2 font-medium text-center">THREAT INDEX</th>
                    <th className="pb-2 font-medium text-right">SYSTEM PROFILE</th>
                    <th className="pb-2 font-medium text-right">TACTICAL MITIGATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {nodes.map((n, idx) => {
                    const isCritical = n.threat === "Critical" || n.threat === "High";
                    return (
                      <tr key={idx} className="hover:bg-slate-850/40">
                        <td className="py-2.5 font-medium flex items-center space-x-1">
                          <AlertOctagon className={`h-3.5 w-3.5 ${isCritical ? "text-rose-500 animate-pulse" : "text-emerald-500"}`} />
                          <span>{n.id}</span>
                        </td>
                        <td className="py-2.5 text-slate-400 text-xs font-sans">{n.sector}</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            isCritical ? "bg-rose-950/40 text-rose-400" : "bg-emerald-950/40 text-emerald-400"
                          }`}>
                            {n.threat}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-400">{n.status}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => dispatchDefenseVector(n.id)}
                            className="bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-emerald-500 transition"
                          >
                            DISPATCH TASK SWEEP
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
