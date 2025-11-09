import { Battery, Gauge, HeartPulse, Zap } from "lucide-react";

export default function StatsCards({ hr, spo2 }) {
  const hrColor = hr ? (hr < 55 || hr > 110 ? "text-rose-600" : "text-emerald-600") : "text-slate-600";
  const spoColor = spo2 ? (spo2 < 94 ? "text-rose-600" : "text-emerald-600") : "text-slate-600";
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200 p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Heart Rate</span>
          <HeartPulse className="h-4 w-4 text-rose-600" />
        </div>
        <p className={`text-3xl font-bold tabular-nums ${hrColor}`}>{hr ?? "--"}<span className="text-base text-slate-500 ml-1">bpm</span></p>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">SpO₂</span>
          <Gauge className="h-4 w-4 text-sky-600" />
        </div>
        <p className={`text-3xl font-bold tabular-nums ${spoColor}`}>{spo2 ?? "--"}<span className="text-base text-slate-500 ml-1">%</span></p>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Battery</span>
          <Battery className="h-4 w-4 text-amber-600" />
        </div>
        <p className="text-3xl font-bold tabular-nums text-slate-800">--<span className="text-base text-slate-500 ml-1">%</span></p>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Signal</span>
          <Zap className="h-4 w-4 text-indigo-600" />
        </div>
        <p className="text-3xl font-bold tabular-nums text-slate-800">--<span className="text-base text-slate-500 ml-1">dBm</span></p>
      </div>
    </div>
  );
}
