import React, { useState } from "react";
import { HeartPulse, Check, AlertTriangle, ShieldCheck, Database, Languages, HelpCircle } from "lucide-react";

interface Symptom {
  id: string;
  name: string;
  checked: boolean;
}

export default function HealthcareGrid() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: "s-1", name: "High Fever & Chills", checked: false },
    { id: "s-2", name: "Persistent dry Cough", checked: false },
    { id: "s-3", name: "Shortness of breath", checked: false },
    { id: "s-4", name: "Maternal high blood pressure (>140/90)", checked: false },
    { id: "s-5", name: "Severe joint pain & headache", checked: false },
  ]);

  const [maternalTrimester, setMaternalTrimester] = useState("Trimester-2");
  const [clinicsQueue, setClinicsQueue] = useState(4); // Simulated local offline cache
  const [selectedLanguage, setSelectedLanguage] = useState("Pidgin");
  
  // Translate Guidance
  const TRANS_DB: Record<string, string> = {
    English: "Take 1 yellow pill after swallowing food in the morning. If the fever stays high for 2 days, quickly take your baby to the hospital clinic.",
    Pidgin: "Make you take 1 yellow tablet after you chop food for morning. If the hot body no gree go after 2 days, sharp-sharp carry pikin go general hospital.",
    Hausa: "Sha kwayar rawaya guda daya bayan cin abinci da safe. Idan zazzabin bai sauka ba bayan kwana biyu, hanzarta kai jaririn zuwa asibiti.",
    Yoruba: "Mu egbogi feere kan leyin ti o ba jeun lowuro. Ti iba na ko ba lo leyin ojo meji, tete gbe omo na lo si asibiti ijoba.",
    Igbo: "Ṅụọ otu mkpụrụ ọgwụ odo a ma i rijie nri n'ụtụtụ. Ọ bụrụ na ahụ ọkụ ahụ agaghị mgbe ụbọchị abụọ gachara, buru nwa gaa ụlọ ọgwụ ozugbo."
  };

  // Perform Diagnostics Calculations
  const feverChecked = symptoms.find(s => s.id === "s-1")?.checked;
  const jointCheck = symptoms.find(s => s.id === "s-5")?.checked;
  const coughCheck = symptoms.find(s => s.id === "s-2")?.checked;
  const breathCheck = symptoms.find(s => s.id === "s-3")?.checked;
  const maternalCheck = symptoms.find(s => s.id === "s-4")?.checked;

  let calculatedDiagnosis = "Indeterminate - Please check symptoms";
  let diagnosticRisk: "Low" | "Medium" | "High" | "Critical" = "Low";

  if (feverChecked && jointCheck) {
    calculatedDiagnosis = "High Probability Malaria (Plasmodium Falciparum)";
    diagnosticRisk = "High";
  } else if (coughCheck && breathCheck && feverChecked) {
    calculatedDiagnosis = "Pneumonia / Lower Respiratory Pathway Anomaly";
    diagnosticRisk = "High";
  } else if (coughCheck && !feverChecked) {
    calculatedDiagnosis = "Bronchitis or Mild Infection";
    diagnosticRisk = "Medium";
  } else if (maternalCheck) {
    calculatedDiagnosis = "Maternal Gestational Hypertension Risk";
    diagnosticRisk = "Critical";
  } else if (feverChecked) {
    calculatedDiagnosis = "Mild Unspecified Fever - Monitor Hydration";
    diagnosticRisk = "Medium";
  }

  const handleSymptomToggle = (id: string) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  // Offline syncing handler
  const [syncing, setSyncing] = useState(false);
  const syncOfflineRecords = () => {
    setSyncing(true);
    setTimeout(() => {
      setClinicsQueue(0);
      setSyncing(false);
    }, 1500);
  };

  const addOfflineRecord = () => {
    setClinicsQueue(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <HeartPulse className="h-4 w-4 mr-1 text-emerald-400" />
            SYMPTOM CHECKLIST (RURAL CLINIC)
          </h3>

          <div className="space-y-4">
            {symptoms.map(s => (
              <label key={s.id} className="flex items-start space-x-3 cursor-pointer group text-xs text-slate-350 font-mono">
                <input
                  type="checkbox"
                  checked={s.checked}
                  onChange={() => handleSymptomToggle(s.id)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0 h-4 w-4 mt-0.5"
                />
                <span className="group-hover:text-emerald-300 transition">{s.name}</span>
              </label>
            ))}

            <div className="border-t border-slate-800/80 pt-4 mt-2">
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Maternal Phase:</label>
              <select
                value={maternalTrimester}
                onChange={(e) => setMaternalTrimester(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-300 w-full focus:outline-none focus:border-emerald-500"
              >
                <option value="Trimester-1">Trimester 1 (Weeks 1-12)</option>
                <option value="Trimester-2">Trimester 2 (Weeks 13-26)</option>
                <option value="Trimester-3">Trimester 3 (Weeks 27-40)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offline cache widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden font-mono">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Database className="h-4 w-4 mr-1 text-emerald-400" />
            OFFLINE STORAGE SYNC-GATE
          </h3>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-center mb-4">
            <span className="text-[10px] text-slate-500 block uppercase">LOCALLY CACHED DIAGNOSTICS</span>
            <span className="text-3xl font-bold text-emerald-400 block my-1">
              {clinicsQueue} Records
            </span>
            <span className="text-[9px] text-slate-400">Offline state: Clinic is currently disconnected.</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addOfflineRecord}
              className="flex-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg transition"
            >
              QUEUE RECORD
            </button>
            <button
              onClick={syncOfflineRecords}
              disabled={syncing || clinicsQueue === 0}
              className="flex-1 text-[10px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 py-2 rounded-lg font-bold transition flex items-center justify-center space-x-1"
            >
              <span>{syncing ? "SYNCING..." : "SYNC NATIONAL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main diagnostic terminal */}
      <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center">
                <HeartPulse className="h-4 w-4 mr-1 text-emerald-400" />
                SOVEREIGN CLINICAL COMPILER ENGINE
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                diagnosticRisk === "Critical" 
                  ? "bg-rose-950/45 text-rose-300 border border-rose-500/10"
                  : "bg-emerald-950/45 text-emerald-300"
              }`}>
                RISK: {diagnosticRisk}
              </span>
            </div>

            {/* Simulated diagnostic readout */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">CLINICAL DIAGNOSIS PREDICTIONS:</span>
              <p className="text-sm font-mono text-slate-200 font-bold mb-3">{calculatedDiagnosis}</p>
              
              <div className="border-t border-slate-800/80 pt-3 flex items-start space-x-2.5">
                <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${diagnosticRisk === "Low" ? "text-slate-500" : "text-amber-500"}`} />
                <div className="text-xs font-sans text-slate-400 leading-normal">
                  {feverChecked || jointCheck || coughCheck || breathCheck || maternalCheck 
                    ? "Patient matches localized transmission criteria. Ensure proper anti-malarial regimes and maternal blood markers are audited at weekly intervals."
                    : "Symptom checklist is completely empty. Initiate full multi-disease screening loops to identify rural pathogen presence."}
                </div>
              </div>
            </div>

            {/* Multilingual Support translator */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center">
                  <Languages className="h-4 w-4 mr-1.5 text-emerald-400" />
                  RURAL POLYGLOT INTERACTION WIDGET
                </span>
                <div className="flex space-x-1.5 font-mono text-[9px]">
                  {["English", "Pidgin", "Hausa", "Yoruba", "Igbo"].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 rounded transition ${
                        selectedLanguage === lang 
                          ? "bg-emerald-600 text-slate-950 font-bold" 
                          : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-800"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation instructions terminal */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-xs leading-relaxed font-sans font-light italic text-emerald-300">
                &ldquo;{TRANS_DB[selectedLanguage]}&rdquo;
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Offline Diagnostic Pipeline Operational</p>
                <p className="text-[10px] text-slate-500 font-mono">Ensuring full operational continuity without network reach across sub-Saharan outposts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
