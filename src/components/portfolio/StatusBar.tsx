"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Clock, Cpu, Gauge, Shield } from "lucide-react";

export function StatusBar() {
  const [pid, setPid] = useState(1024);
  const [started] = useState(() => new Date());
  const [now, setNow] = useState(() => new Date());
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    const pidTimer = setInterval(
      () => setPid(Math.floor(Math.random() * 8000) + 1000),
      8000,
    );
    const latencyTimer = setInterval(
      () => setLatency(Math.floor(Math.random() * 10) + 20),
      3000,
    );
    return () => {
      clearInterval(clock);
      clearInterval(pidTimer);
      clearInterval(latencyTimer);
    };
  }, []);

  const uptime = useMemo(() => {
    const diff = now.getTime() - started.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [now, started]);

  const sysTime = now.toLocaleTimeString([], { hour12: false });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-[#00ff41]/30 backdrop-blur-xl z-[100] px-4 md:px-8 py-2.5 font-mono text-[10px] md:text-xs text-[#00ff41]/60 flex justify-between items-center select-none uppercase tracking-[0.2em] shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="flex gap-4 md:gap-8 items-center">
        <span className="flex items-center gap-2 text-[#00ff41] font-bold">
          <Shield size={12} className="text-[#00ff41] animate-pulse" />
          <span className="hidden xs:inline">SECURE_SESSION:</span> AES-256
        </span>
        <span className="hidden sm:flex items-center gap-2 border-l border-[#00ff41]/10 pl-4 text-[#00ff41]/40">
          <Gauge size={12} className="text-[#00ff41]/20" /> {latency}ms
        </span>
        <span className="hidden md:flex items-center gap-2 border-l border-[#00ff41]/10 pl-4 text-[#00ff41]/40">
          <Clock size={12} /> SYS_TIME: {sysTime}
        </span>
      </div>

      <div className="flex gap-4 md:gap-10 items-center">
        <span className="hidden lg:flex items-center gap-2 text-[#00ff41]">
          <Activity size={12} className="text-[#00ff41] animate-pulse" />
          STATUS: <span className="text-white">OPERATIONAL</span>
        </span>
        <span className="text-[#00ff41] font-black border-x border-[#00ff41]/10 px-4 md:px-8 bg-[#00ff41]/5 py-0.5 shadow-[inset_0_0_10px_rgba(0,255,65,0.05)]">
          <span className="hidden sm:inline">SESSION_UPTIME:</span> {uptime}
        </span>
        <span className="hidden lg:flex items-center gap-2 text-[#00ff41]/40">
          <Cpu size={12} /> KERNEL_PID:{" "}
          <span className="text-[#00ff41]">{pid}</span>
        </span>
      </div>
    </div>
  );
}
