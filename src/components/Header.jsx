import { HeartPulse, Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white grid place-items-center shadow">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">VitalSense</h1>
            <p className="text-xs text-slate-500 -mt-0.5">SpO₂ & Heart Rate IoT Dashboard</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-rose-600">
          <Activity className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">Live Ready</span>
        </div>
      </div>
    </header>
  );
}
