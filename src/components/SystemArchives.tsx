import React, { useState } from "react";
import { FileCode, Database, Cpu, ShieldAlert, BadgeDollarSign, Map, HelpCircle, Copy, Check } from "lucide-react";

type ArchTab = "diagram" | "database" | "api" | "cyber" | "pitch" | "roadmap";

export default function SystemArchives() {
  const [activeTab, setActiveTab] = useState<ArchTab>("diagram");
  const [copied, setCopied] = useState(false);

  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const POSTGRES_DDL = `-- AFRICA INTELLIGENCE GRID (AIG) SOVEREIGN SCHEMA 
-- Target Database: PostgreSQL 16+ / Google Cloud Spanner (Postgres dialect)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Sovereign Security Feeds & Telemetry
CREATE TABLE security_sectors (
    sector_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    threat_level VARCHAR(50) CHECK (threat_level IN ('Low', 'Moderate', 'High', 'Critical')),
    operational_status VARCHAR(100) DEFAULT 'ACTIVE_SECURE',
    drone_patrol_frequency_minutes INT DEFAULT 45,
    incident_counter INT DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table: Hydrometric Basin Real-time Sensors
CREATE TABLE river_basins (
    station_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(255) NOT NULL,
    state_region VARCHAR(100) NOT NULL,
    current_river_level_meters DECIMAL(4,2) NOT NULL,
    critical_threshold_meters DECIMAL(4,2) DEFAULT 6.50,
    precipitation_rate_mm_hr DECIMAL(5,2) DEFAULT 0.00,
    spillway_valve_open BOOLEAN DEFAULT FALSE,
    environmental_alert_state VARCHAR(50) DEFAULT 'STABLE'
);

-- Table: Anti-Corruption Public Ledger
CREATE TABLE procurement_audits (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_title VARCHAR(500) NOT NULL,
    supervising_ministry VARCHAR(255) NOT NULL,
    allocated_budget_billion_usd DECIMAL(12,4) NOT NULL,
    treasury_disbursed_billion_usd DECIMAL(12,4) DEFAULT 0.00,
    declared_ground_progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    satellite_verified_progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    anomaly_divergence_index DECIMAL(5,2) GENERATED ALWAYS AS (ABS(declared_ground_progress_percentage - satellite_verified_progress_percentage)) STORED,
    corruption_risk_assessment_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sec_threat ON security_sectors(threat_level);
CREATE INDEX idx_procurement_anomaly ON procurement_audits(anomaly_divergence_index);`;

  const API_CONTRACT = `// RESTful / gRPC Gateway Interface Contract Specification
// Endpoint Routing Core: /api/v1/*

[POST] /api/v1/telemetry/dispatches
Query Payload Schema:
{
  "coordinate_id": "SEC-41",
  "sector_reference": "Sambisa Border Zone delta-9",
  "threat_level": "Critical",
  "mobilize_units": true,
  "payload": {
    "drone_swarm_id": "AIR-SVY-90",
    "backup_interceptors_deployed": 12
  }
}
Response Payload (gRPC Protocol Buffer equivalent):
{
  "transaction_hash": "aig_sec_tx_90114aa8bcc1",
  "dispatch_timestamp": "2026-05-29T15:15:36Z",
  "seconds_to_eta": 45,
  "status": "MOBILIZED_AIRBORNE"
}

---------------------------------------

[POST] /api/v1/audits/reconcile-satellites
Payload:
{
  "project_id": "PRJ-904",
  "ground_reported_progress": 95.0,
  "sensor_reprobe": true
}
Response:
{
  "satellite_congruence": "MISMATCH",
  "divergence_margin": 83.00,
  "computed_corruption_ratio": 0.92,
  "efcc_escrow_trigger": true
}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans text-xs">
      {/* Tab Select Panel */}
      <div className="bg-slate-950 border-b border-slate-850 p-2.5 flex flex-wrap gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("diagram")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "diagram" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>SYSTEM-ARCHITECTURE</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "database" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>POSTGRES-SCHEMA</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "api" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>API-GATEWAYS</span>
        </button>

        <button
          onClick={() => setActiveTab("cyber")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "cyber" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>CYBERSECURITY-SHIELD</span>
        </button>

        <button
          onClick={() => setActiveTab("pitch")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "pitch" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <BadgeDollarSign className="h-3.5 w-3.5" />
          <span>INVESTOR-PITCH-DECK</span>
        </button>

        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded transition font-mono ${
            activeTab === "roadmap" ? "bg-emerald-600 text-slate-950 font-bold" : "text-slate-400 hover:bg-slate-850"
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>BUDGET & IMPLEMENTATION</span>
        </button>
      </div>

      <div className="p-6">
        {/* DIAGRAM TAB */}
        {activeTab === "diagram" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">
              PALANTIR-GRADE FULL-STACK MULTI-AGENT STATE GRID
            </h3>
            
            <p className="text-slate-400 leading-relaxed font-light">
              We govern physical state operations via a multi-tiered, resilient cloud-native array encompassing edge-computing, geospatial telemetry nodes and centralized machine-learning nodes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase block">TIER 1 - EDGE SENSOR ARRAYS</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Satellite aperture relays, local river confluence radar gauge stations, Smart Meter voltage controllers (VAR systems), and rural outpatient medical sync devices.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase block">TIER 2 - AI SOVEREIGN ENGINE</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Gemini-3.5-flash server-side inference engine. Spatial classification pipelines checking contract corruption models and mapping rainfall precipitation rates.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase block">TIER 3 - SECURITY AUDIT CAP</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  End-to-end audit loops connected directly to state defense commands, the Ministry of Health, and budget financial compliance agencies (EFCC/ICPC metrics).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === "database" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                POSTGRESQL TECHNICAL RELATIONAL SCHEMAS
              </h3>
              <button
                onClick={() => triggerCopy(POSTGRES_DDL)}
                className="bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-slate-950 font-mono text-[10px] px-2.5 py-1 rounded flex items-center space-x-1 transition"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-950" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "COPIED RELATIONAL DDL" : "COPY TRANS-DDL"}</span>
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed font-light mb-2">
              Sovereign entity relationship layout configured with specialized autocommit telemetry tracking variables for sub-Saharan regional deployments.
            </p>

            <pre className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-[10px] font-mono whitespace-pre text-slate-350 overflow-x-auto max-h-[250px] leading-tight select-all">
              {POSTGRES_DDL}
            </pre>
          </div>
        )}

        {/* API TAB */}
        {activeTab === "api" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                AIG OPERATING ENDPOINTS - CONTRACT PROTOCOLS
              </h3>
              <button
                onClick={() => triggerCopy(API_CONTRACT)}
                className="bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-slate-950 font-mono text-[10px] px-2.5 py-1 rounded flex items-center space-x-1 transition"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-950" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "COPIED API CONTRACT" : "COPY CONTRACT"}</span>
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed font-light mb-2">
              Fully decoupled RESTful and gRPC serialization structures mapping physical dispatches, emergency alerts, and anti-corruption auditing loops.
            </p>

            <pre className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-[10px] font-mono whitespace-pre text-emerald-400 overflow-x-auto max-h-[250px] leading-tight select-all">
              {API_CONTRACT}
            </pre>
          </div>
        )}

        {/* CYBERSECURITY TAB */}
        {activeTab === "cyber" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">
              SOVEREIGN MIL-SPEC CYBERSECURITY HARDENING BLUEPRINT
            </h3>
            
            <p className="text-slate-400 leading-relaxed font-light">
              Because AIG governs national-grade flooding defenses, power distribution grids, and criminal intercept telemetry, we enforce a strict zero-trust operational framework.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono font-light">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <span className="text-rose-400 font-bold block">1. SATELLITE & EDGE IPSEC TUNNELING</span>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  All edge river sensors and drone flight units use HW-locked TPM profiles. Communications are routed via double-wrapped AES-GCM-256 IPsec arrays directly back to regional command silos.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <span className="text-rose-400 font-bold block">2. DECENTRALIZED PROCUREMENT AUDITING Ledger</span>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Contract disbursal audits are cryptographically signed. Local physical audits are cross-referenced with satellite hashes that cannot be altered or deleted by corrupt officials.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <span className="text-rose-400 font-bold block">3. REGIONAL IDENTITY & ACCESS MANAGEMENT (IAM)</span>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  State officials log in using Google Authenticator and secure OAuth. Any high-volume action (like opening a flood spillway valve) triggers multi-party biometric authorization.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <span className="text-rose-400 font-bold block">4. OFFLINE-FIRST PHANTOM SYNC SAFETY</span>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Rural clinical diagnostics are cached inside offline-first local sandbox databases using AES-256. These records automatically compile audit values to detect diagnostic tampering.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PITCH DECK TAB */}
        {activeTab === "pitch" && (
          <div className="space-y-4 font-normal">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">
              AFRICA INTELLIGENCE GRID - $1B INVESTOR PITCH SLIDES
            </h3>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-emerald-400 font-bold uppercase">Slide 1: The Multi-Billion Dollar Rupture</span>
                <p className="text-slate-400 font-sans text-[11px] mt-1">
                  Nigeria loses $4B+ to flooding annually, $12B+ to electric grid failure, and $8B+ to transaction graft and procurement markup. Uncontrollable logistics congestion costs Lagos $4B in lost output.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-emerald-400 font-bold uppercase">Slide 2: The Pan-African Sovereign Engine</span>
                <p className="text-slate-400 font-sans text-[11px] mt-1">
                  AIG is Africa's Sovereign AI Operating Complex. By integrating real-time computer vision crop analysis, smart-grid demand balancing, and satellite auditing overlays, we optimize civil infrastructure directly.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-emerald-400 font-bold uppercase">Slide 3: Business Model & TAM ($5.2B)</span>
                <p className="text-slate-400 font-sans text-[11px] mt-1">
                  SaaS sovereign hosting licenses sold to State Governments ($8M/year license per state), coupled with enterprise commercial electricity offsets and logistics routing fees.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">
              MVP TIMELINES & SOVEREIGN EXPENDITURE RATIOS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">MVP ROADMAP (90 DAYS)</span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-[11px] font-sans">
                  <li><strong>Day 1-30:</strong> Pilot Lokoja hydrometric confluence gauges & validate satellite overlays in Delta state.</li>
                  <li><strong>Day 31-60:</strong> Rollout smart solar voltage integration across active transmission loops in Ikeja.</li>
                  <li><strong>Day 61-90:</strong> Launch offline diagnostics app in 40 Cross River regional health outposts.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">INFRASTRUCTURAL COST ESTIMATES (YEAR 1)</span>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>Aperture Spatial Relays:</span>
                    <span className="text-emerald-400 font-bold">$220,000</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>Edge Confluence Sensors:</span>
                    <span className="text-emerald-400 font-bold">$85,000</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>Mil-Spec Swarm Telemetry:</span>
                    <span className="text-emerald-400 font-bold">$410,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Central Sovereign Cloud hosting:</span>
                    <span className="text-emerald-400 font-bold">$120,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
