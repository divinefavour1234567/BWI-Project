import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "../context/AuthContext";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  Users, ShieldAlert, KeyRound, Check, RefreshCw, Search, 
  Trash2, UserCheck, Calendar, Filter
} from "lucide-react";

interface OperatorUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  createdAt?: any;
}

export default function OperatorsRegistry() {
  const { userProfile, updateUserRoleByAdmin } = useAuth();
  const [operators, setOperators] = useState<OperatorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const rolesList: UserRole[] = [
    "Admin",
    "Government Analyst",
    "Security Analyst",
    "Healthcare Analyst",
    "Agricultural Analyst",
    "General User"
  ];

  // Load operators from Firestore securely
  useEffect(() => {
    if (userProfile?.role !== "Admin") {
      setLoading(false);
      return;
    }

    const path = "users";
    const q = query(collection(db, path), limit(40));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const opsList: OperatorUser[] = [];
        snapshot.forEach((doc) => {
          opsList.push({ uid: doc.id, ...doc.data() } as OperatorUser);
        });
        setOperators(opsList);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userProfile]);

  const handleRoleChange = async (targetUid: string, currentRole: UserRole, targetRole: UserRole) => {
    if (currentRole === targetRole) return;
    setUpdatingId(targetUid);
    setFeedbackMsg("");

    try {
      await updateUserRoleByAdmin(targetUid, targetRole);
      setFeedbackMsg(`Successfully authorized clearance level: ${targetRole}`);
      setTimeout(() => setFeedbackMsg(""), 4000);
    } catch (err: any) {
      console.error(err);
      alert("Role modification rejected under security policy bounds.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (userProfile?.role !== "Admin") {
    return (
      <div className="bg-rose-950/20 border border-rose-500/10 rounded-xl p-6 text-center space-y-4 font-mono select-none">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-sm font-bold text-rose-400">ACCESS FORBIDDEN AND LOGGED</h3>
        <p className="text-xs text-rose-350 leading-relaxed max-w-md mx-auto">
          Operational Registry is exclusive to administrative level operators. Your session credentials have been tagged under compliance directive 9-A.
        </p>
      </div>
    );
  }

  // Filter operator records list
  const filteredOperators = operators.filter((op) => {
    const matchesQuery = 
      op.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (roleFilter === "ALL") return matchesQuery;
    return matchesQuery && op.role === roleFilter;
  });

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header and Summary banner */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center">
            <Users className="h-5 w-5 text-emerald-400 mr-2" />
            Clearance & Operational Operator Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative terminal to manage, audit, and re-classify access levels of global sector analysts.
          </p>
        </div>
        
        {feedbackMsg && (
          <div className="px-3.5 py-1.5 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg animate-pulse flex items-center space-x-1">
            <Check className="h-3 w-3" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Query Search filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
        
        <div className="md:col-span-7 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter staff by name or email hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-5 flex items-center space-x-2">
          <Filter className="h-4 w-4 text-emerald-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-350 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Show All Clearances</option>
            {rolesList.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Operators list grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin" />
        </div>
      ) : filteredOperators.length === 0 ? (
        <div className="text-center py-10 bg-slate-950 border border-slate-850 rounded-xl text-slate-500">
          No authenticated operators found matching filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredOperators.map((op) => {
            const isSelf = op.uid === userProfile?.uid;
            return (
              <div 
                key={op.uid}
                className={`p-4 bg-slate-950 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                  isSelf ? "border-emerald-500/20 shadow-lg shadow-emerald-950/5" : "border-slate-850 hover:border-slate-800"
                }`}
              >
                {/* Operator Profile Info */}
                <div className="flex items-center space-x-3.5">
                  <img
                    src={op.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256"}
                    alt={op.displayName}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-sans font-bold text-slate-100 text-xs">
                        {op.displayName}
                      </span>
                      {isSelf && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-600 text-slate-950 font-bold">
                          CURRENT UNIT
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px] block font-mono">{op.email}</span>
                  </div>
                </div>

                {/* Role Allocation select dropdown */}
                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                  
                  <div className="text-left">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Active Clearance:</span>
                    <span className={`text-[10px] uppercase font-bold ${
                      op.role === "Admin" ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {op.role}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={op.role}
                      disabled={isSelf || updatingId === op.uid}
                      onChange={(e) => handleRoleChange(op.uid, op.role, e.target.value as UserRole)}
                      className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-[10px] text-slate-300 w-44 focus:outline-none focus:border-red-500/80 disabled:opacity-50"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r} disabled={r === "Admin" && !isSelf}>
                          {r}
                        </option>
                      ))}
                    </select>
                    
                    {updatingId === op.uid && (
                      <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin" />
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
