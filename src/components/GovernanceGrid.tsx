import React, { useState } from "react";
import { Scale, AlertTriangle, CheckCircle, Crosshair, HelpCircle, Eye, FileSpreadsheet } from "lucide-react";

interface AuditedProject {
  id: string;
  name: string;
  ministry: string;
  budgetBillions: number;
  paymentDisbursed: number; // Billions
  groundCompletionPercent: number; // Physical progress reported
  satelliteCompletionPercent: number; // Satellite visual progress
  corruptionRiskScore: number;
  anomalyFlags: string[];
}

export default function GovernanceGrid() {
  const [corruptionFilter, setCorruptionFilter] = useState(40); // %
  const [anomalyThreshold, setAnomalyThreshold] = useState(30); // %
  
  const initialProjects: AuditedProject[] = [
    {
      id: "PRJ-904",
      name: "Delta Coastal Transit Bridge Route Hub",
      ministry: "Ministry of Infrastructure & Transport",
      budgetBillions: 14.2,
      paymentDisbursed: 13.8,
      groundCompletionPercent: 95,
      satelliteCompletionPercent: 12, // Major deficit!
      corruptionRiskScore: 92,
      anomalyFlags: ["Disbursal Outpacing Structures", "Physical Satellite Deficit", "Shell Subcontracting Matches"],
    },
    {
      id: "PRJ-102",
      name: "Enugu Rural Health Outpost Complex",
      ministry: "Federal Ministry of Health",
      budgetBillions: 1.8,
      paymentDisbursed: 0.9,
      groundCompletionPercent: 45,
      satelliteCompletionPercent: 48,
      corruptionRiskScore: 12,
      anomalyFlags: [],
    },
    {
      id: "PRJ-551",
      name: "Kaduna Agro-Silo Storage Facilities",
      ministry: "Ministry of Agriculture & Water",
      budgetBillions: 6.5,
      paymentDisbursed: 5.2,
      groundCompletionPercent: 80,
      satelliteCompletionPercent: 78,
      corruptionRiskScore: 18,
      anomalyFlags: [],
    },
    {
      id: "PRJ-782",
      name: "Abuja Sewerage and Canal Siltation Treatment Complex",
      ministry: "Federal Capital Territory Authority",
      budgetBillions: 8.9,
      paymentDisbursed: 8.9,
      groundCompletionPercent: 100,
      satelliteCompletionPercent: 35, // Deficit!
      corruptionRiskScore: 84,
      anomalyFlags: ["Silt Filter Equipment Deficit", "Extreme Procurement Markups"],
    }
  ];

  const [projects, setProjects] = useState<AuditedProject[]>(initialProjects);

  // Filter projects by risk threshold
  const visibleProjects = projects.filter(p => p.corruptionRiskScore >= corruptionFilter);

  // Satellite Verification Action
  const triggerSatelliteRecalibration = () => {
    setProjects(prev =>
      prev.map(p => {
        if (p.corruptionRiskScore > 80) {
          // Adjust based on satellite correction
          return { ...p, satelliteCompletionPercent: Math.min(100, p.satelliteCompletionPercent + 15), corruptionRiskScore: Math.max(0, p.corruptionRiskScore - 10) };
        }
        return p;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Scale className="h-4 w-4 mr-1 text-emerald-400" />
            AUDITING RISK FILTERS
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Min Corruption Risk Profile:</span>
                <span className="text-emerald-400 font-bold">{corruptionFilter}% Risk</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={corruptionFilter}
                onChange={(e) => setCorruptionFilter(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400 font-semibold text-rose-400">Anomaly Divergence Alarm:</span>
                <span className="text-rose-400 font-bold">{anomalyThreshold}% divergence</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1.5 block leading-normal">
                Flags are triggered when ground progress reports exceed spatial satellite scans by {anomalyThreshold}%.
              </span>
            </div>
          </div>
        </div>

        {/* Anomaly ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Crosshair className="h-4 w-4 mr-1 text-rose-500 animate-pulse" />
            FLAGGED ANOMALIES RECORDED
          </h3>

          <div className="space-y-3">
            {projects.flatMap(p => p.anomalyFlags.map((flag, idx) => (
              <div key={`${p.id}-${idx}`} className="p-2.5 bg-rose-950/20 border border-rose-500/10 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                <div className="font-mono text-[10px]">
                  <span className="text-slate-300 block font-semibold">{p.id} - {flag}</span>
                  <span className="text-slate-500">{p.ministry.substring(0,25)}...</span>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* Main ledger database */}
      <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-400" />
                SOVEREIGN LEDGER & EARTH SPATIAL RECONCILIATION
              </h3>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1 text-emerald-400 animate-pulse" />
                SATELLITE AUDIT ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans mb-4 leading-relaxed">
              We leverage ESA Sentinel-2 and Planet Labs high-frequency visual apertures to compute the structural volume development indexes on major construction corridors. Cross-referenced directly against CBN treasury disbursals.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 pb-2">
                    <th className="pb-2 font-medium">PROJECT INDEX</th>
                    <th className="pb-2 font-medium">ESTIMATED CODES</th>
                    <th className="pb-2 font-medium text-center">PAYMENT DISBURSED</th>
                    <th className="pb-2 font-medium text-center">SPATIAL CONGRUENCE</th>
                    <th className="pb-2 font-medium text-right">RISK VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {visibleProjects.map((p, idx) => {
                    const progressGap = Math.abs(p.groundCompletionPercent - p.satelliteCompletionPercent);
                    const hasAnom = progressGap >= anomalyThreshold;
                    return (
                      <tr key={idx} className="hover:bg-slate-850/40">
                        <td className="py-2.5 font-medium flex items-center space-x-1.5 font-sans text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${hasAnom ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-500">{p.id}</td>
                        <td className="py-2.5 text-center text-emerald-400 font-semibold">${p.paymentDisbursed}B / ${p.budgetBillions}B</td>
                        <td className="py-2.5 text-center text-xs">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-300">Ground: {p.groundCompletionPercent}%</span>
                            <span className={`text-[10px] ${hasAnom ? "text-rose-400 animate-pulse font-bold" : "text-emerald-400"}`}>
                              Satellite: {p.satelliteCompletionPercent}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-bold text-xs">
                          <span className={`px-1.5 py-0.5 rounded ${
                            p.corruptionRiskScore > 75 
                              ? "bg-rose-950/40 text-rose-400 border border-rose-500/10" 
                              : "bg-emerald-950/40 text-emerald-400"
                          }`}>
                            {p.corruptionRiskScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Scale className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Anti-Corruption Smart Ledger Active</p>
                <p className="text-[10px] text-slate-500 font-mono">Disbursal audit routines reporting directly to EFCC and ICPC national databases.</p>
              </div>
            </div>

            <button
              onClick={triggerSatelliteRecalibration}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs w-full md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <CheckCircle className="h-4 w-4" />
              <span>COMMIT SATELLITE CORRECTION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
