import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle, RefreshCw, Cpu, BrainCircuit, User } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "engine";
  text: string;
  timestamp: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "aig-1",
      sender: "engine",
      text: "### Africa Intelligence Grid Sovereign Oracle Initiated.\n\nState-level microservices and sensor feeds are mapped to this interactive knowledge nexus. Ask for deep spatial forecasts, audit analysis, or rural health diagnostic scripts.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUERIES = [
    { label: "Anambra Flood Remediation", q: "Provide an emergency flood routing plan for Anambra State under heavy 250mm precipitation." },
    { label: "Predict Kaduna Harvest", q: "Forecast maize harvest in Kaduna based on current 40% soil moisture and rain levels." },
    { label: "Audit Project Anomaly", q: "Verify the $1.2B inflated stadium project in Delta State. How can sat imagery confirm corruption?" },
    { label: "Lagos Green Wave Optimization", q: "Calculate green wave timing intervals for Ikorodu road in Lagos to reduce congestion by 30%." },
    { label: "Malaria Vector Projections", q: "Outline outbreak risk modeling and rural offline syncing architecture for Cross River clinics." },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const activeText = queryText || input.trim();
    if (!activeText || loading) return;

    if (!queryText) setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: activeText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activeText,
          systemInstruction: "You are the AIG Sovereign Command Oracle, an omnipotent infrastructure intelligence platform designed specifically to resolve massive, multi-billion dollar problems across Nigeria and sub-Saharan Africa. Your responses must be structured, authoritative, metrics-driven, and rich with practical, ground-level policy and engineering solutions. Format outputs gracefully with neat Markdown lists, headers, and code sections if needed.",
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "engine",
        text: data.text || "Operational fault: Gemini backend did not return structured telemetry.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "engine",
        text: "🚨 **Transmission Interrupted**: Could not connect to AIG Sovereign Core. Ensure your `GEMINI_API_KEY` is configured in AI Studio Secrets.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-emerald-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-wider text-slate-100">
              AIG SOVEREIGN ORACLE
            </h3>
            <span className="text-[10px] font-mono text-emerald-500 flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
              COGNITIVE AGENT LEVEL-05
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: "aig-reset",
                sender: "engine",
                text: "### AIG Oracle Nexus Re-anchored.\nSensor data feeds live. Ask about hydrological, energy, security, or trans-procurement systems.",
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }}
          className="text-slate-500 hover:text-emerald-400 p-1 rounded hover:bg-slate-800 transition"
          title="Clear Terminal Session"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-mono text-slate-500">
              {m.sender === "user" ? (
                <>
                  <span>SUPERUSER COMMAND</span>
                  <User className="h-3 w-3 text-emerald-500" />
                </>
              ) : (
                <>
                  <Cpu className="h-3 w-3 text-emerald-500" />
                  <span>AIG_ORACLE_CORE</span>
                </>
              )}
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>
            
            <div
              className={`p-3.5 rounded-xl max-w-[85%] leading-relaxed prose prose-invert text-xs border ${
                m.sender === "user"
                  ? "bg-emerald-950/40 text-emerald-100 border-emerald-500/20"
                  : "bg-slate-950 text-slate-200 border-slate-800"
              }`}
            >
              {m.text.split("\n\n").map((para, i) => {
                if (para.startsWith("###")) {
                  return (
                    <h4 key={i} className="font-mono text-xs text-emerald-400 font-bold tracking-tight mb-2 mt-2 border-b border-emerald-500/10 pb-0.5">
                      {para.replace("###", "")}
                    </h4>
                  );
                }
                if (para.startsWith("*") || para.startsWith("-")) {
                  return (
                    <ul key={i} className="list-disc pl-4 space-y-1 my-2">
                      {para.split("\n").map((li, j) => (
                        <li key={j} className="text-slate-300">
                          {li.replace(/^[\s*-]+/, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="mb-2">
                    {para}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-mono text-slate-500">
              <Cpu className="h-3 w-3 text-emerald-500 animate-spin" />
              <span>AIG_ORACLE_PIPELINE...</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-75" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150" />
              <span className="text-xs font-mono text-slate-400">Synthesizing telemetry arrays</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Injections */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[9px] font-mono text-amber-500/80 uppercase tracking-wider shrink-0">
          Command presets:
        </span>
        {SUGGESTED_QUERIES.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq.q)}
            className="text-[10px] bg-slate-940 hover:bg-emerald-950/30 hover:text-emerald-300 hover:border-emerald-500/30 text-slate-400 border border-slate-800 px-2 py-1 rounded transition whitespace-nowrap"
          >
            {sq.label}
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Query intelligence matrix (e.g. outline Lagos congestion relief)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition placeholder-slate-500"
          id="oracle-chat-input"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 p-2 rounded-lg transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
