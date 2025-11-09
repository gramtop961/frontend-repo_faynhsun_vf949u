import { Activity, Droplets, Heart } from "lucide-react";

export default function RealtimeCard({ hr, spo2, status, onReconnect }) {
  const statusDot = {
    connecting: "bg-amber-500",
    live: "bg-emerald-500",
    disconnected: "bg-gray-400",
    error: "bg-rose-500",
  }[status] || "bg-gray-400";

  return (
    <section className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDot}`}></span>
          <h2 className="text-sm font-semibold text-slate-700">Realtime Feed</h2>
        </div>
        {onReconnect && (
          <button onClick={onReconnect} className="text-xs text-slate-500 hover:text-slate-700">Reconnect</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 border border-slate-200 bg-gradient-to-br from-rose-50 to-white">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">Heart Rate</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 tabular-nums">{hr ?? "--"}<span className="text-base font-medium text-slate-500 ml-1">bpm</span></p>
        </div>
        <div className="rounded-xl p-4 border border-slate-200 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-2 text-sky-600 mb-2">
            <Droplets className="h-4 w-4" />
            <span className="text-xs font-medium">SpO₂</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 tabular-nums">{spo2 ?? "--"}<span className="text-base font-medium text-slate-500 ml-1">%</span></p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500 flex items-center gap-1"><Activity className="h-3.5 w-3.5"/> {status === 'live' ? 'Receiving device messages.' : 'Waiting for device messages.'}</p>
    </section>
  );
}
