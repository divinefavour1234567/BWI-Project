import React, { useState } from "react";
import { useAuth, UserRole } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Mail, User, ShieldAlert, KeyRound, ArrowRight, 
  Compass, Loader2, Sparkles, Server, CheckCircle2, AlertTriangle, ChevronRight
} from "lucide-react";

export default function AuthInterface() {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, resetPassword, connectionHealthy } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("General User");
  
  // UX Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) throw new Error("Please enter all required credentials");
        await loginWithEmail(email, password);
        setSuccessMsg("Access Key validated. Authenticating operator session...");
      } else if (mode === "signup") {
        if (!email || !password || !displayName) throw new Error("Please provide complete profile registration metrics");
        if (password.length < 6) throw new Error("Cryptographic Passwords must contain at least 6 tokens");
        await signUpWithEmail(email, password, displayName, selectedRole);
        setSuccessMsg("Sovereign operator ledger created successfully. Loading command grid...");
      } else {
        if (!email) throw new Error("Provide registered operator email");
        await resetPassword(email);
        setSuccessMsg("Password reset token dispatched to terminal email index.");
      }
    } catch (err: any) {
      console.error(err);
      let resolvedMsg = err.message || "An unexpected system rejection occurred.";
      if (err.code === "auth/invalid-credential") {
        resolvedMsg = "Invalid access credentials. Check operator email or secret keys.";
      } else if (err.code === "auth/email-already-in-use") {
        resolvedMsg = "This operator email is already mapped to an active ledger.";
      } else if (err.code === "auth/user-not-found") {
        resolvedMsg = "No record found matching this operational index.";
      }
      setErrorMsg(resolvedMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await loginWithGoogle(selectedRole);
      setSuccessMsg("Google Identity verified. Aligning authorization vectors...");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google Single Sign-On hand-shake failed.");
      setLoading(false);
    }
  };

  // Enterprise details for selected role description
  const ROLE_SPECS = [
    { role: "General User", desc: "Overview & global live telemetry feeds", color: "border-slate-800 text-slate-400" },
    { role: "Government Analyst", desc: "Access public treasury, contracts & progress audits", color: "border-amber-500/20 text-amber-400" },
    { role: "Security Analyst", desc: "Command security hotspots, drones & threat intercepts", color: "border-rose-500/20 text-rose-400" },
    { role: "Healthcare Analyst", desc: "Audit regional outpatient diagnostics & medical systems", color: "border-emerald-500/20 text-emerald-400" },
    { role: "Agricultural Analyst", desc: "Manage multi-spectral crop growth & irrigation indices", color: "border-blue-500/20 text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased text-slate-150 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background grids and glowing graphics (Futuristic vibe) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04),transparent_50%)]" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Connection Offline Indicator */}
      {!connectionHealthy && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 z-50 bg-rose-950/80 border border-rose-500/20 backdrop-blur px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow-2xl">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <p className="text-[10px] font-mono text-rose-300">
            SECURE LINK COMPROMISED - OFFLINE SIMULATION FALLBACK ACTIVE
          </p>
        </div>
      )}

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1000px] bg-slate-900/60 border border-slate-800/80 rounded-2xl md:grid md:grid-cols-12 shadow-2xl backdrop-blur-lg relative overflow-hidden z-10"
      >
        
        {/* Left Hand Visual Hero Frame (Enterprise Branding) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/60 p-8 flex-col justify-between relative">
          
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 bg-gradient-to-tr from-emerald-600 to-amber-500 rounded-lg flex items-center justify-center">
                <Compass className="h-5.5 w-5.5 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xs font-bold font-mono tracking-widest text-slate-100 uppercase">
                  AIG SOVEREIGN
                </h1>
                <span className="text-[9px] font-mono text-emerald-400">OPERATIONAL TERMINAL</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-[10px] font-bold">
                  <Server className="h-3.5 w-3.5" />
                  <span>CYBER METRICS LOG</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  All requests audited & sealed with double AES-GCM-256 payload envelopes. Direct neural-state link connected.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[10px] font-bold">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>GEMINI AUTO-DECRYPT</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  Sovereign compiler analyzing anomalous state vectors and pipeline thresholds across sub-Saharan operations.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-[9px] font-mono text-slate-500">
              <span>LEDGER SYSTEM STANDARD</span>
              <span className="text-emerald-500">V1.40-SECURED</span>
            </div>
          </div>
        </div>

        {/* Right Hand Form Wrapper */}
        <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-center">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold mb-1">
                FEDERAL COMMAND CENTER
              </p>
              <h2 className="text-lg font-mono font-bold text-slate-100">
                {mode === "login" && "IDENTITY AUTHORIZATION"}
                {mode === "signup" && "RECRUIT NEW OPERATOR"}
                {mode === "forgot" && "SECRET KEY RECOVERY"}
              </h2>
            </div>
            {/* Visual indicator of encrypted state */}
            <div className="h-7 w-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* User Feedback messages with simple animations */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-rose-950/40 border border-rose-500/20 rounded-xl flex items-start space-x-2"
              >
                <ShieldAlert className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-rose-300 leading-snug">{errorMsg}</p>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-start space-x-2"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-emerald-300 leading-snug">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAction} className="space-y-4 font-mono text-xs">
            
            {/* Email/Pass Login + Signup Forms */}
            {mode === "signup" && (
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Operator Display Name:</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Secure Channel Email:</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="operator@aig.gov.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider block">Access Secret Key (Password):</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[9px] text-amber-500 hover:text-amber-400 transition cursor-pointer"
                    >
                      Forgot access key?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Futuristic Role Selector for Sign-up/Onboarding */}
            {mode === "signup" && (
              <div className="border-t border-slate-850 pt-4">
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-2 font-bold flex items-center">
                  <Server className="h-3 w-3 mr-1 text-emerald-400" />
                  Target Analytical Clearance Workspace:
                </label>
                
                <div className="grid grid-cols-1 select-none gap-2 max-h-[145px] overflow-y-auto pr-1">
                  {ROLE_SPECS.map(({ role, desc }) => (
                    <div
                      key={role}
                      onClick={() => setSelectedRole(role as UserRole)}
                      className={`p-2 border rounded-lg cursor-pointer transition flex items-start space-x-2.5 ${
                        selectedRole === role 
                          ? "bg-emerald-950/20 border-emerald-500/80" 
                          : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedRole === role}
                        onChange={() => {}}
                        className="mt-1 h-3 w-3 accent-emerald-500"
                      />
                      <div className="text-[10px]">
                        <span className="font-bold text-slate-250 block leading-tight">{role}</span>
                        <span className="text-[9px] text-slate-500 leading-snug">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit / Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/30"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login" && "AUTHORIZE TERMINAL"}
                    {mode === "signup" && "SECURELY REGISTER LEDGER"}
                    {mode === "forgot" && "DISPATCH RESET TOKEN"}
                  </span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Google OAuth Login Spliter */}
          {mode !== "forgot" && (
            <div className="mt-4 space-y-3 font-mono">
              <div className="flex items-center text-slate-600 text-[10px]">
                <div className="h-px bg-slate-850 flex-1" />
                <span className="px-2.5 uppercase font-medium tracking-wide">Or Sync Identity via</span>
                <div className="h-px bg-slate-850 flex-1" />
              </div>

              {/* In Signup mode, we will allow choosing a role first, then clicking Google Sign-In */}
              {mode === "signup" && (
                <p className="text-[9px] text-slate-500 text-center uppercase tracking-wide">
                  *(Selected analytical clearance role above will map to your new Google profile)*
                </p>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Enterprise OAuth Link</span>
              </button>
            </div>
          )}

          {/* Mode Switching Bottom Nav */}
          <div className="mt-6 text-center text-[11px] font-mono border-t border-slate-850/60 pt-4 flex justify-between items-center text-slate-500">
            {mode === "login" ? (
              <>
                <span>New Operator?</span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center cursor-pointer"
                >
                  Request Registration <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </>
            ) : mode === "signup" ? (
              <>
                <span>Already registered?</span>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center cursor-pointer"
                >
                  Access Terminal <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </>
            ) : (
              <>
                <span>Recall key?</span>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center cursor-pointer"
                >
                  Access Terminal <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </>
            )}
          </div>

        </div>

      </motion.div>
    </div>
  );
}
