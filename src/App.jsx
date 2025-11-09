import { useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import DeviceConnector from "./components/DeviceConnector";
import RealtimeCard from "./components/RealtimeCard";
import TrendsChart from "./components/TrendsChart";
import StatsCards from "./components/StatsCards";

function App() {
  const [status, setStatus] = useState("idle");
  const [hr, setHr] = useState(null);
  const [spo2, setSpo2] = useState(null);
  const [history, setHistory] = useState([]);

  const onData = useCallback((d) => {
    if (typeof d.heart_rate === "number") setHr(d.heart_rate);
    if (typeof d.spo2 === "number") setSpo2(d.spo2);
    setHistory((h) => [...h.slice(-59), d]);
  }, []);

  const reconnect = useCallback(() => {
    // This will be handled by DeviceConnector's connect button; kept here for API symmetry
  }, []);

  const subtitle = useMemo(() => {
    if (status === "live") return "Device connected and streaming in real-time";
    if (status === "demo") return "Demo mode generating realistic signals";
    if (status === "connecting") return "Attempting connection to your device...";
    if (status === "error") return "Connection error — check backend or network";
    if (status === "disconnected") return "Disconnected — reconnect or start demo";
    return "Connect your IoT device or start demo to begin";
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">SpO₂ & Heart Rate Monitoring</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <DeviceConnector onData={onData} onStatusChange={setStatus} />

        <StatsCards hr={hr} spo2={spo2} />

        <div className="grid md:grid-cols-2 gap-6">
          <RealtimeCard hr={hr} spo2={spo2} status={status} onReconnect={reconnect} />
          <TrendsChart data={history} />
        </div>

        <footer className="pt-4 text-center text-xs text-slate-500">
          This UI is ready for real devices over WebSocket. Point it at your API and start streaming JSON like {"{"}heart_rate, spo2{"}"} once per second.
        </footer>
      </main>
    </div>
  );
}

export default App;
