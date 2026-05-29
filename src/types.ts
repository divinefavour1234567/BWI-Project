export type ActiveModule =
  | "overview"
  | "flood"
  | "security"
  | "grid"
  | "agriculture"
  | "governance"
  | "healthcare"
  | "traffic"
  | "archives"
  | "operators";

export interface LogMessage {
  id: string;
  timestamp: string;
  source: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export interface SecurityNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  threatLevel: "Low" | "Moderate" | "High" | "Critical";
  status: "Secure" | "Active Monitoring" | "Dispatching" | "Alert";
  lastPing: string;
  agentCount: number;
}

export interface SmartGridNode {
  id: string;
  substation: string;
  district: string;
  currentLoadMW: number;
  capacityMW: number;
  transformerTempCelsius: number;
  theftIndex: number; // Percentage risk of power theft
  solarInputMW: number;
  batteryStatus: number; // battery percentage
  outageRisk: number; // Outage probability percentage
}

export interface AgriculturalFarm {
  id: string;
  name: string;
  state: string;
  cropType: string;
  soilMoisture: number; // 0-100%
  cropHealthStatus: "Excellent" | "Good" | "Requires Attention" | "Infected";
  predictedYieldTons: number;
  detectedDisease?: string;
  rainfallForecastMM: number;
}

export interface TransactionRecord {
  id: string;
  contractTitle: string;
  ministry: string;
  allocatedBudgetBillion: number;
  completionPercentage: number;
  disbursedBillion: number;
  corruptionRiskScore: number; // 1-100
  contractAnomalyFlags: string[];
  satelliteVerificationStatus: "Match" | "Mismatch" | "Delayed Audit";
}

export interface RegionalHealthData {
  id: string;
  clinicName: string;
  county: string;
  malariaCases: number;
  tbScreenings: number;
  pneumoniaProneRating: number; // 1-10
  maternalRiskLevel: "Low" | "Medium" | "High";
  offlineSyncQueue: number; // Number of locally-cached diagnostic records
}

export interface TrafficNode {
  id: string;
  junction: string;
  currentCongestionLevel: number; // 0-100%
  signalDurationSeconds: number;
  accidentZoneIndex: number; // 0-100
  avgSpeedKmh: number;
  optimizedGreenWaveStatus: boolean;
}

export interface FloodTelemetry {
  riverStation: string;
  riverLevelValue: number; // In meters (normal is < 5m)
  criticalThreshold: number; // Threshold for flood trigger
  rainfallRateMMhr: number;
  estimatedSurgeLeadTimeHours: number;
  anomalyDetected: boolean;
}

export const STATE_GEOLOCATIONS = [
  { state: "Lagos", lat: 6.5244, lng: 3.3792 },
  { state: "Abuja", lat: 9.0765, lng: 7.3986 },
  { state: "Kano", lat: 12.0022, lng: 8.5919 },
  { state: "Kaduna", lat: 10.5105, lng: 7.4165 },
  { state: "Rivers", lat: 4.8156, lng: 7.0498 },
  { state: "Oyo", lat: 7.3775, lng: 3.9470 },
  { state: "Anambra", lat: 6.2209, lng: 7.0671 },
  { state: "Borno", lat: 11.8311, lng: 13.1510 },
  { state: "Delta", lat: 5.6815, lng: 6.1362 },
];
