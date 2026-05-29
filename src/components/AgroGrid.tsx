import React, { useState } from "react";
import { Sprout, Eye, AlertCircle, Calendar, Sparkles, Upload, CloudSun, CheckCircle2 } from "lucide-react";

interface CropPreset {
  name: string;
  type: string;
  condition: string;
  treatment: string;
  urgency: "Safe" | "Medium Risk" | "Severe Infection";
  imageUrl: string;
}

export default function AgroGrid() {
  const [soilMoisture, setSoilMoisture] = useState(48); // %
  const [irrigationState, setIrrigationState] = useState(false);
  const [customFile, setCustomFile] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<CropPreset | null>(null);

  // Constants
  const PRESET_CROPS: CropPreset[] = [
    {
      name: "Cassava Leaf - Sector E-1",
      type: "Cassava",
      condition: "Cassava Mosaic Virus (CMD)",
      treatment: "Vector containment (whiteflies control), crop rotation, immediate planting of CMD-resistant clones (e.g. TME 419).",
      urgency: "Severe Infection",
      imageUrl: "🍂" // Fallback icon instead of dead url
    },
    {
      name: "Maize Crop - Kaduna North",
      type: "Maize",
      condition: "Maize Streak Virus (MSV)",
      treatment: "Early sowing, apply seed-dressing neonicotinoid insecticides to hamper leafhopper populations.",
      urgency: "Medium Risk",
      imageUrl: "🌱"
    },
    {
      name: "Oyo Yam Tuber - Core-Alpha",
      type: "Yam",
      condition: "Stable (Healthy Leaf)",
      treatment: "None required. Maintain current nitrogen-phosphorus potting balance and mulching.",
      urgency: "Safe",
      imageUrl: "🌿"
    }
  ];

  const handleScanPreset = (crop: CropPreset) => {
    setScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setScannedResult(crop);
      setScanning(false);
    }, 1400);
  };

  const simulateDragDropUpload = () => {
    setScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setScannedResult({
        name: "User Uploaded Specimen",
        type: "Rice Node Stem",
        condition: "Blast (Pyricularia oryzae)",
        treatment: "Avoid excessive nitrogen fertilizers. Spray approved systemic tricyclazole fungicide at 2.5g/L under optimal dew windows.",
        urgency: "Severe Infection",
        imageUrl: "🌾"
      });
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-1">
      {/* Parameter section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <CloudSun className="h-4 w-4 mr-1 text-emerald-400" />
            SOIL & IRRIGATION PARAMETERS
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Soil Moisture Density:</span>
                <span className="text-emerald-400 font-bold">{soilMoisture}% Hydration</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(+e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Arid Outflux</span>
                <span>Waterlogged Roots</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
              <div>
                <span className="text-xs font-mono text-slate-300 block">Drip Irrigation Gates:</span>
                <span className="text-[10px] text-slate-500 font-mono">Dynamic hydrologic optimization</span>
              </div>
              <button
                onClick={() => {
                  setIrrigationState(!irrigationState);
                  if (!irrigationState) setSoilMoisture(prev => Math.min(85, prev + 15));
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition ${
                  irrigationState 
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/20" 
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {irrigationState ? "CLOSING GATES" : "ENGAGE IRRIGATION"}
              </button>
            </div>
          </div>
        </div>

        {/* Schedule recommender */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg font-mono">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-emerald-400" />
            AI CROPPING PLANNERS
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
              <span className="text-emerald-400 font-bold block mb-1">KADUNA CORN CYCLES:</span>
              <p className="text-[10px] text-slate-400 leading-normal">
                Based on predicted rainfall delta (320mm next 30 days), start sowing nitrogen-fertilized seeds immediately. Soil moistures below {soilMoisture}% need 12-hour drip rotations.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg">
              <span className="text-amber-500 font-bold block mb-1">SOVEREIGN FOOD REPORT:</span>
              <p className="text-[10px] text-slate-400 leading-normal">
                National Cassava inventory margins are tightening. Yield vectors indicate 4.2% drop unless CMD resistant clones are seeded at delta zones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CV Model Grid */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center">
              <Eye className="h-4 w-4 mr-1 text-emerald-400" />
              SATELLITE & COMPUTER VISION CROP DIAGNOSTICS SCANNER
            </h3>

            <p className="text-xs text-slate-400 font-sans mb-4 leading-relaxed">
              Select an image preset of a compromised African crop below, or drag/drop your own custom leaf specimens to trigger active machine-vision diagnostics.
            </p>

            {/* Presets and Drop box */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PRESET_CROPS.map((crop, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanPreset(crop)}
                  className="bg-slate-950 border border-slate-850 hover:border-emerald-500/20 p-3 rounded-lg text-left transition flex flex-col items-center justify-center space-y-2 group"
                >
                  <span className="text-3xl text-center group-hover:scale-110 transition duration-300">{crop.imageUrl}</span>
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-300 block truncate max-w-[120px]">{crop.type} Sample</span>
                    <span className={`text-[8px] font-mono uppercase px-1 rounded ${
                      crop.urgency.includes("Severe") 
                        ? "bg-rose-950/40 text-rose-300" 
                        : crop.urgency.includes("Medium") 
                          ? "bg-amber-950/40 text-amber-300" 
                          : "bg-emerald-950/40 text-emerald-300"
                    }`}>
                      {crop.urgency}
                    </span>
                  </div>
                </button>
              ))}

              {/* Drag Drop Simulator Box */}
              <button
                onClick={simulateDragDropUpload}
                className="bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/30 p-3 rounded-lg flex flex-col items-center justify-center space-y-1.5 transition text-slate-400 group"
              >
                <Upload className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-mono text-slate-300 text-center">Upload Specimen</span>
                <span className="text-[8px] text-slate-500">Drag leaf.jpg directly</span>
              </button>
            </div>
          </div>

          {/* Diagnostic results console */}
          <div className="mt-6 border-t border-slate-800/80 pt-5">
            {scanning ? (
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex items-center justify-center space-x-4 animate-pulse">
                <Sprout className="h-6 w-6 text-emerald-400 animate-spin" />
                <span className="text-xs font-mono text-slate-300">AIG Vision Engine processing chlorophyl cell maps...</span>
              </div>
            ) : scannedResult ? (
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-200">{scannedResult.name}</h4>
                      <p className="text-[9px] text-slate-500 font-mono">VISION ANALYZED SPECIMEN PROFILE</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    scannedResult.urgency.includes("Severe") 
                      ? "bg-rose-950/40 text-rose-400 border border-rose-500/10" 
                      : scannedResult.urgency.includes("Medium") 
                        ? "bg-amber-950/40 text-amber-400" 
                        : "bg-emerald-950/40 text-emerald-400"
                  }`}>
                    {scannedResult.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono font-light">
                  <div className="space-y-1">
                    <span className="text-slate-500 block uppercase text-[9px]">Detected Anomaly:</span>
                    <span className="text-rose-400 font-semibold">{scannedResult.condition}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block uppercase text-[9px]">Mitigation Recipe:</span>
                    <p className="text-slate-300 text-[10px] leading-relaxed font-sans font-normal">{scannedResult.treatment}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-950/50 border border-slate-850/50 rounded-xl flex flex-col items-center justify-center text-center text-slate-500">
                <CheckCircle2 className="h-6 w-6 text-slate-700 mb-2" />
                <p className="text-[11px] font-mono">Vision Matrix Idle. Click a specimen cell above or upload to classify vegetation status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
