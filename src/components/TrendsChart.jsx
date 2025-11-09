import { useEffect, useRef } from "react";

// Simple canvas chart without extra deps
export default function TrendsChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(width, y + 0.5); ctx.stroke();
    }

    const maxLen = 60; // last 60 points
    const slice = data.slice(-maxLen);

    const xFor = (i) => (i / Math.max(1, slice.length - 1)) * width;

    const hrValues = slice.map((d) => d.heart_rate).filter((v) => typeof v === "number");
    const spoValues = slice.map((d) => d.spo2).filter((v) => typeof v === "number");

    const hrMin = Math.min(50, ...hrValues);
    const hrMax = Math.max(120, ...hrValues);
    const spoMin = Math.min(90, ...spoValues);
    const spoMax = Math.max(100, ...spoValues);

    const yForHr = (v) => height - ((v - hrMin) / Math.max(1, hrMax - hrMin)) * height;
    const yForSpo = (v) => height - ((v - spoMin) / Math.max(1, spoMax - spoMin)) * height;

    // HR line
    ctx.strokeStyle = "#e11d48"; // rose-600
    ctx.lineWidth = 2;
    ctx.beginPath();
    slice.forEach((d, i) => {
      if (typeof d.heart_rate !== "number") return;
      const x = xFor(i);
      const y = yForHr(d.heart_rate);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // SpO2 line
    ctx.strokeStyle = "#0284c7"; // sky-600
    ctx.lineWidth = 2;
    ctx.beginPath();
    slice.forEach((d, i) => {
      if (typeof d.spo2 !== "number") return;
      const x = xFor(i);
      const y = yForSpo(d.spo2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // legends
    ctx.fillStyle = "#334155";
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillText("HR (bpm)", 8, 16);
    ctx.fillText("SpO₂ (%)", 80, 16);
  }, [data]);

  return (
    <section className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Trends (last 60s)</h3>
      </div>
      <div className="h-48 w-full">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </section>
  );
}
