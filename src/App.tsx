import SovereignCommandCenter from "./components/SovereignCommandCenter";
import AuthInterface from "./components/AuthInterface";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RefreshCw, Compass } from "lucide-react";

function SystemLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 font-mono select-none relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_40%)]" />
      
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 bg-gradient-to-tr from-emerald-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
          <Compass className="h-8 w-8 text-slate-950 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
      </div>

      <div className="text-center space-y-1.5 z-10">
        <h2 className="text-[11px] font-bold tracking-widest text-slate-200 uppercase">
          AIG CORE KEYING MODULE
        </h2>
        <p className="text-[9px] text-emerald-400 font-mono flex items-center justify-center space-x-1.5">
          <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
          <span>DECRYPTING SECURE SECTOR CHANNELS...</span>
        </p>
      </div>
    </div>
  );
}

function MainAppGate() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <SystemLoadingScreen />;
  }

  if (!currentUser) {
    return <AuthInterface />;
  }

  return <SovereignCommandCenter />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppGate />
    </AuthProvider>
  );
}
