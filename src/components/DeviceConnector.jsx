import { useEffect, useRef, useState } from "react";
import { Wifi, Radio, PlugZap, Power, Bug } from "lucide-react";

const WS_URL = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL.replace("http", "ws") + "/ws/vitals"
  : null;

export default function DeviceConnector({ onData, onStatusChange }) {
  const [status, setStatus] = useState("idle"); // idle | connecting | live | disconnected | error | demo
  const wsRef = useRef(null);
  const demoTimer = useRef(null);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => () => cleanup(), []);

  const cleanup = () => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
    if (demoTimer.current) {
      clearInterval(demoTimer.current);
      demoTimer.current = null;
    }
  };

  const connectWS = () => {
    if (!WS_URL) {
      setStatus("error");
      return;
    }
    cleanup();
    setStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => setStatus("live");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (typeof data.heart_rate === "number" || typeof data.spo2 === "number") {
          onData?.({
            heart_rate: data.heart_rate ?? null,
            spo2: data.spo2 ?? null,
            ts: data.ts ? new Date(data.ts) : new Date(),
          });
        }
      } catch {
        // ignore malformed
      }
    };
  };

  const startDemo = () => {
    cleanup();
    setStatus("demo");
    let t = 0;
    demoTimer.current = setInterval(() => {
      t += 1;
      // synthetic but realistic-ish signals
      const heart_rate = Math.round(72 + 8 * Math.sin(t / 6) + (Math.random() - 0.5) * 6);
      const spo2 = Math.round(97 + 1.2 * Math.sin(t / 18) + (Math.random() - 0.5) * 0.8);
      onData?.({ heart_rate, spo2, ts: new Date() });
    }, 1000);
  };

  const stopAll = () => {
    cleanup();
    setStatus("idle");
  };

  const badge = {
    idle: { text: "Idle", color: "bg-slate-200 text-slate-700", icon: PlugZap },
    connecting: { text: "Connecting", color: "bg-amber-100 text-amber-700", icon: Wifi },
    live: { text: "Live", color: "bg-emerald-100 text-emerald-700", icon: Radio },
    disconnected: { text: "Disconnected", color: "bg-slate-200 text-slate-700", icon: Wifi },
    error: { text: "Error", color: "bg-rose-100 text-rose-700", icon: Bug },
    demo: { text: "Demo", color: "bg-indigo-100 text-indigo-700", icon: Radio },
  }[status];

  const Icon = badge.icon;

  return (
    <section className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
          <Icon className="h-3.5 w-3.5" />
          <span>{badge.text}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={connectWS}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            disabled={!WS_URL}
            title={WS_URL ? `Connect to ${WS_URL}` : "Set VITE_BACKEND_URL to enable WebSocket"}
          >
            Connect device
          </button>
          <button
            onClick={startDemo}
            className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Start demo
          </button>
          <button
            onClick={stopAll}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Power className="h-4 w-4" />
          </button>
        </div>
      </div>
      {!WS_URL && (
        <p className="mt-3 text-xs text-slate-500">Tip: set VITE_BACKEND_URL to your API base to enable live WebSocket streaming.</p>
      )}
    </section>
  );
}
