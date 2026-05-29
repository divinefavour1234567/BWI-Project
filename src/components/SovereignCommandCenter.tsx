import React, { useState, useEffect } from "react";
import { 
  Building2, Droplet, ShieldCheck, Zap, Sprout, Scale, HeartPulse, 
  Compass, Eye, AlertOctagon, Terminal, BrainCircuit, BookOpen,
  Lock, Key, Users, LogOut, Settings, RefreshCw, Check, X
} from "lucide-react";
import { ActiveModule, LogMessage } from "../types";
import { useAuth, UserRole } from "../context/AuthContext";
import FloodGrid from "./FloodGrid";
import SecurityGrid from "./SecurityGrid";
import SmartGrid from "./SmartGrid";
import AgroGrid from "./AgroGrid";
import GovernanceGrid from "./GovernanceGrid";
import HealthcareGrid from "./HealthcareGrid";
import TrafficGrid from "./TrafficGrid";
import SystemArchives from "./SystemArchives";
import AiAssistant from "./AiAssistant";
import OperatorsRegistry from "./OperatorsRegistry";

export default function SovereignCommandCenter() {
  const { userProfile, logout, updateProfileDetails } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveModule>("overview");
  const [currentClock, setCurrentClock] = useState("");
  const [tickerLogs, setTickerLogs] = useState<LogMessage[]>([
    { id: "log-1", timestamp: "15:11:42", source: "AIG_HYDRO_DETECTOR", type: "info", message: "Confluence monitors active. Lokoja level holding standard at 3.4m." },
    { id: "log-2", timestamp: "15:11:51", source: "SENTINEL_DRONE_02", type: "success", message: "Sector patrol delta cleared. Zero thermal incursions near pipeline G-3." },
    { id: "log-3", timestamp: "15:12:00", source: "SMART_GRID_OPT", type: "warning", message: "Slight overload detected on Ibadan distributor feed. Solar offset optimization recommended." },
  ]);

  // Profile management edit modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || "");
  const [editAvatar, setEditAvatar] = useState(userProfile?.photoURL || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize dynamic values on load
  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.displayName || "");
      setEditAvatar(userProfile.photoURL || "");
    }
  }, [userProfile]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentClock(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const sub = setInterval(updateTime, 1000);
    return () => clearInterval(sub);
  }, []);

  // Dispatch a dummy operational log dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ["MET_SATELLITE", "GRID_VOLT_VAR", "AGRO_SENSORS", "GOV_LEDGER_AUD"];
      const messages = [
        "Aperture orbit sweep completed over Delta Coastal Highway - High congruency verified.",
        "Maize farm sector soil hydration levels optimized successfully via drip gate balance.",
        "Smart grid frequencies stable. All substations returning nominal voltage index.",
        "Rural outpatient offline buffer synchronized. 14 locally-cached reports committed to server-side."
      ];
      
      const randomIdx = Math.floor(Math.random() * sources.length);
      const newLog: LogMessage = {
        id: `gen-log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        source: sources[randomIdx],
        type: "success",
        message: messages[randomIdx],
      };

      setTickerLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Strict Matrix of Allowed Tabs for each Role
  const PERMITTED_MODULES: Record<UserRole, ActiveModule[]> = {
    "Admin": ["overview", "flood", "security", "grid", "agriculture", "governance", "healthcare", "traffic", "archives", "operators"],
    "Government Analyst": ["overview", "governance", "traffic", "archives"],
    "Security Analyst": ["overview", "security", "traffic", "archives"],
    "Healthcare Analyst": ["overview", "healthcare", "archives"],
    "Agricultural Analyst": ["overview", "agriculture", "flood", "archives"],
    "General User": ["overview", "traffic", "archives"]
  };

  const userRole = userProfile?.role || "General User";
  const userAllowedTabs = PERMITTED_MODULES[userRole];
  const isTabAuthorized = userAllowedTabs.includes(activeTab);

  const CORE_METRICS = [
    { label: "OPERATOR CLEARANCE", val: userRole.toUpperCase(), detail: `Permitted grids: ${userAllowedTabs.length} of 10 channels` },
    { label: "GRID INDEX SHUNTS", val: "99.2% RECONCILED", detail: "Nominal Load Capacity: 5.2GW" },
    { label: "DISPATCH REACTION FORCE", val: "45 SECONDS LATENCY", detail: "Tactical drone deployment standard" },
    { label: "SOVEREIGN SYSTEM STATE", val: "ACTIVE SECURE", detail: "Zero Compromises Logged" }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSavingProfile(true);
    setSaveSuccess(false);
    try {
      await updateProfileDetails(editName, editAvatar);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsProfileModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Error synchronizing profile data.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-emerald-500 selection:text-slate-950 relative">
      
      {/* Dynamic African-inspired Tech Header */}
      <header className="border-b border-emerald-500/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-tr from-emerald-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <Compass className="h-6 w-6 text-slate-950 animate-pulse" />
            </div>
            {/* National insignia highlight dots */}
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-semibold tracking-widest font-mono text-slate-100 uppercase">
                AFRICA INTELLIGENCE GRID
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500 text-slate-950">
                AIG-OS SOVEREIGN-V01
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-wide">
              Infrastructure Intelligence & Tactical Command Complex • Federal Republic of Nigeria
            </p>
          </div>
        </div>

        {/* Real-time Sovereign clock and current user profile block */}
        <div className="flex items-center space-x-4">
          <div className="text-right font-mono text-slate-350">
            <span className="text-[10px] text-slate-500 block">COORDINATED CHRONOMETER</span>
            <span className="text-xs text-amber-500 font-bold tracking-wider">{currentClock}</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden md:block" />
          
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="group flex items-center space-x-2 bg-slate-950/80 border border-slate-800 hover:border-slate-700 py-1 px-2.5 rounded-xl cursor-pointer transition text-left"
            >
              <img
                src={userProfile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256"}
                alt={userProfile?.displayName}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-lg object-cover border border-slate-800 group-hover:border-emerald-500 transition"
              />
              <div className="hidden lg:block">
                <span className="text-[10px] font-mono font-bold block group-hover:text-emerald-400 transition leading-tight truncate max-w-[120px]">
                  {userProfile?.displayName}
                </span>
                <span className="text-[8px] text-slate-500 block font-mono leading-tight">
                  {userRole}
                </span>
              </div>
            </button>
            
            <button 
              onClick={logout}
              title="Logout terminal"
              className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-955 hover:border-rose-900/60 transition cursor-pointer flex items-center justify-center text-slate-400 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* State Bento Cards Grid (Global telemetry tickers) */}
      <section className="bg-slate-900 border-b border-slate-850 px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {CORE_METRICS.map((m, i) => (
          <div key={i} className="border-r border-slate-800 last:border-0 pr-3 flex flex-col justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{m.label}</span>
            <span className="text-xs font-mono font-bold text-slate-200 mt-0.5">{m.val}</span>
            <span className="text-[9px] text-slate-500 font-light truncate mt-0.5">{m.detail}</span>
          </div>
        ))}
      </section>

      {/* Main Command Panel split layout */}
      <main className="flex-1 lg:grid lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        
        {/* Navigation Sidebar Drawer */}
        <nav className="lg:col-span-3 flex flex-col gap-5 mr-1 mb-6 lg:mb-0">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 px-2">
              Grid Sectors HQ
            </span>

            {[
              { id: "overview", label: "Operations Headquarters", icon: Building2, desc: "Sovereign situational overview" },
              { id: "flood", label: "Hydrological Flood Grid", icon: Droplet, desc: "Crest forecasting & cell dispatch" },
              { id: "security", label: "Sentinel Security Nexus", icon: ShieldCheck, desc: "Crime hotspots & drone feeds" },
              { id: "grid", label: "Smart Grid Volt-Optimizer", icon: Zap, desc: "Grid optimizations & theft counters" },
              { id: "agriculture", label: "Agro-Sovereign Shield", icon: Sprout, desc: "CV crop health diagnostics & schedule" },
              { id: "governance", label: "Transparency Audit Ledger", icon: Scale, desc: "Sat verified procurement audits" },
              { id: "healthcare", label: "Rural Diagnostics Clinic", icon: HeartPulse, desc: "Offline compiler & multi-lang translations" },
              { id: "traffic", label: "Lagos Urban Flow Engine", icon: Compass, desc: "Transit congestion & Green waves" },
              { id: "archives", label: "Blueprint & Archives", icon: BookOpen, desc: "Tech stacks, schemas & budgets" },
              { id: "operators", label: "Clearance Directory", icon: Users, desc: "Operator rosters & role clearances" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasAccess = userAllowedTabs.includes(tab.id as ActiveModule);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveModule)}
                  className={`w-full text-left font-mono text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition group relative overflow-hidden ${
                    isActive 
                      ? "bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-950/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-slate-950" : "text-emerald-500 group-hover:scale-110 transition"}`} />
                    <div>
                      <span className="block">{tab.label}</span>
                      <span className={`block text-[8px] font-sans font-normal mt-0.5 ${isActive ? "text-slate-800" : "text-slate-500"}`}>
                        {tab.desc}
                      </span>
                    </div>
                  </div>

                  {/* Visual authorization indicator */}
                  {!hasAccess && (
                    <Lock className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-slate-900" : "text-slate-600"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Integration instructions card */}
          <div className="bg-slate-920 border border-slate-850 rounded-xl p-4 text-xs font-mono space-y-2">
            <span className="text-[9px] uppercase font-bold text-amber-500 flex items-center">
              <AlertOctagon className="h-3.5 w-3.5 mr-1" />
              Sovereign Clearance Matrix
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Operators have distinct access clearances mapped directly to their specialized role assignments to guard state variables.
            </p>
          </div>
        </nav>

        {/* Dynamic Panel Canvas Area (Center/Right Grid) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex-1">
              
              {/* IF USER TRYING TO VIEW UNAUTHORIZED TAB */}
              {!isTabAuthorized ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6 font-mono select-none space-y-4">
                  <div className="h-14 w-14 rounded-full bg-rose-950/50 border border-rose-500/30 flex items-center justify-center mb-2 animate-pulse">
                    <Lock className="h-7 w-7 text-rose-500" />
                  </div>
                  <h3 className="text-sm font-bold text-rose-450 tracking-widest uppercase">
                    INSUFFICIENT SECURITY CLEARANCE LEVEL
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 max-w-md">
                    <p className="text-[11px] text-slate-400 leading-relaxed text-left">
                      To safeguard public data and infrastructure, AIG-OS locks access under attribute-based keys. 
                    </p>
                    <div className="mt-3 border-t border-slate-900 pt-2.5 flex justify-between text-[10px] text-slate-500">
                      <span>SEC_CHANNEL: ACCESS_DENIED</span>
                      <span className="text-rose-400">REQUIRES OPERATIONAL ELEVATION</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Your clearance profile: <span className="text-amber-500 font-bold">{userRole}</span>. Contact system administration operators.
                  </p>
                </div>
              ) : (
                <>
                  {/* OVERVIEW PANEL */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-widest flex items-center">
                          <Building2 className="h-5 w-5 text-emerald-400 mr-2" />
                          OPERATIONS HEADQUARTERS Situational Dashboard
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          This sovereign dashboard synthesizes critical civil data feeds over Nigeria sector-by-sector. Ensure satellite and drone telemetry paths remain aligned with regional emergency services.
                        </p>
                      </div>

                      {/* Operational status grid nodes map */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-1.5 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 block font-semibold">SOVEREIGN HEALTH INDEX</span>
                          <p className="text-2xl font-mono font-black text-emerald-300">98.4 / 100</p>
                          <span className="text-[10px] text-slate-500 font-mono">All operations grids nominal</span>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-1.5 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-rose-400 block font-semibold">ACTIVE REGIONAL CRITICAL ALERTS</span>
                          <p className="text-2xl font-mono font-black text-rose-400">03 SEC. ALARMS</p>
                          <span className="text-[10px] text-slate-500 font-mono">Pipeline G-3 patrolling secure</span>
                        </div>
                      </div>

                      {/* Live System Logging Ledger */}
                      <div className="bg-slate-955 border border-slate-850 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-2 border-b border-slate-850 pb-2">
                          <Terminal className="h-4 w-4 text-emerald-400" />
                          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-200">
                            STATE INFRASTRUCTURE EVENTS TELEMETRY RECORD
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {tickerLogs.map((log) => (
                            <div key={log.id} className="text-[10px] font-mono flex items-start space-x-1.5 leading-tight hover:bg-slate-900/40 p-1 rounded transition">
                              <span className="text-slate-500 font-semibold text-[8px] bg-slate-950 px-1 py-0.5 rounded shrink-0">{log.timestamp}</span>
                              <span className="text-emerald-400 font-bold shrink-0">[{log.source}]</span>
                              <span className="text-slate-350">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROUTE INDIVIDUAL SECTORS */}
                  {activeTab === "flood" && <FloodGrid />}
                  {activeTab === "security" && <SecurityGrid />}
                  {activeTab === "grid" && <SmartGrid />}
                  {activeTab === "agriculture" && <AgroGrid />}
                  {activeTab === "governance" && <GovernanceGrid />}
                  {activeTab === "healthcare" && <HealthcareGrid />}
                  {activeTab === "traffic" && <TrafficGrid />}
                  {activeTab === "archives" && <SystemArchives />}
                  {activeTab === "operators" && <OperatorsRegistry />}
                </>
              )}

            </div>
          </div>
        </section>

        {/* Secure Gemini AI Assistant Side panel */}
        <section className="lg:col-span-3 flex flex-col">
          <AiAssistant />
        </section>

      </main>

      {/* Profile/Operator Customizer Modal Dialog */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-mono text-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <Settings className="h-4.5 w-4.5 text-emerald-400 animate-spin-slow" />
                <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs">
                  OPERATOR PROFILE CONFIGS
                </h3>
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">
                  Operator Nickname/Callsign:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">
                  Operator Avatar Vector Path (Image URL):
                </label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Paste URL (https://...)"
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Sample Avatar Shortcuts */}
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-500 block mb-2 font-mono">
                  Standard Profile Avatar Assets:
                </label>
                <div className="flex gap-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256"
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditAvatar(url)}
                      className={`h-9 w-9 rounded-lg overflow-hidden border transition shrink-0 ${
                        editAvatar === url ? "border-emerald-500 p-0.5" : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <img src={url} alt="preset" className="h-full w-full object-cover rounded-md" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4 mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-1/2 bg-slate-950 hover:bg-slate-900 border border-slate-850 py-2.5 rounded-xl transition font-bold"
                >
                  ABORT CHANGES
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : saveSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>SYNCD!</span>
                    </>
                  ) : (
                    <span>CONFIRM KEYS</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Sovereign Page Margin credits */}
      <footer className="border-t border-slate-850 px-6 py-2 bg-slate-950/80 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-2">
        <span>© 2026 AFRICA INTELLIGENCE GRID. ALL RIGHT RESERVED PARALLEL ARRAYS.</span>
        <span className="text-emerald-400">DESIGNED BY UNITED METRICS DIVISION • ADHERING TO FEDERAL INTEGRITY MANDATE</span>
      </footer>

    </div>
  );
}
