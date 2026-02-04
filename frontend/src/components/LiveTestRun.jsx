import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Check, Loader2, Play, Cpu, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * LIVE TEST RUN - QaCore
 * - Simulates a real-time AI test execution loop.
 * - Auto-scrolling terminal aesthetic.
 * - "Matrix" style scanline effect.
 */

const SEQUENCE = [
  { text: "$ qacore run https://app.neuralqa.com", type: "command", delay: 1000 },
  { text: "ℹ Initializing AI Agent (v2.4.0)...", type: "info", delay: 800 },
  { text: "→ Analyzing DOM structure...", type: "process", delay: 1200 },
  { text: "✔ Identified: Login Form (email, password)", type: "success", delay: 600 },
  { text: "→ Generating Playwright script...", type: "process", delay: 1500 },
  { text: "Executing: page.fill('input[type=email]')", type: "code", delay: 400 },
  { text: "Executing: page.click('button[type=submit]')", type: "code", delay: 600 },
  { text: "✔ Screenshot captured: /evidence/login-success.png", type: "success", delay: 800 },
  { text: "✨ Report generated successfully", type: "final", delay: 2000 },
];

export default function LiveTestRun() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Animation Loop Logic
  useEffect(() => {
    if (isResetting) return;

    if (currentIndex < SEQUENCE.length) {
      const step = SEQUENCE[currentIndex];
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, step]);
        setCurrentIndex((prev) => prev + 1);
      }, step.delay);
      return () => clearTimeout(timer);
    } else {
      // Sequence complete, wait then reset
      const resetTimer = setTimeout(() => {
        setIsResetting(true);
        setVisibleLines([]);
        setCurrentIndex(0);
        setTimeout(() => setIsResetting(false), 500); // Small pause before restarting
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, isResetting]);

  return (
    <section className="py-24 bg-[#020617] overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Execution Engine
           </div>
           <h2 className="text-3xl font-bold text-white">Watch AI write tests in real-time</h2>
        </div>

        {/* TERMINAL WINDOW */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-slate-800 bg-[#0B1120] shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          
          {/* 1. Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal size={12} />
              <span>agent-worker-01</span>
            </div>
            <div className="w-12" /> {/* Spacer for centering */}
          </div>

          {/* 2. Terminal Body */}
          <div className="relative p-6 font-mono text-sm h-100 flex flex-col justify-end">
            
            {/* Scanline Effect Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-5 bg-size-[100%_2px,3px_100%] pointer-events-none opacity-20" />

            {/* The Lines */}
            <div className="flex flex-col justify-start h-full gap-3 overflow-hidden">
               <AnimatePresence mode="popLayout">
                  {visibleLines.map((line, i) => (
                    <TerminalLine key={i} line={line} />
                  ))}
               </AnimatePresence>
               
               {/* Blinking Cursor at the end */}
               {!isResetting && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="flex items-center gap-2 mt-2"
                 >
                   <span className="text-cyan-500">➜</span>
                   <span className="w-2 h-4 bg-cyan-500 animate-pulse" />
                 </motion.div>
               )}
            </div>

          </div>

          {/* 3. Footer / Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-[#0f172a] text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                ONLINE
              </span>
              <span className="flex items-center gap-1">
                <Cpu size={10} /> 32% CPU
              </span>
              <span>RAM: 1.2GB</span>
            </div>
            <div>
              <span>Playwright v1.40.0</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

// Sub-component for individual lines with specific styling
function TerminalLine({ line }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3"
    >
      {/* Icon/Prefix based on type */}
      <span className="mt-0.5 shrink-0">
        {line.type === "command" && <span className="text-cyan-500">$</span>}
        {line.type === "success" && <Check size={14} className="text-emerald-400" />}
        {line.type === "process" && <Loader2 size={14} className="text-blue-400 animate-spin" />}
        {line.type === "final" && <SparklesIcon />} 
        {line.type === "info" && <span className="text-blue-500">i</span>}
        {line.type === "code" && <Play size={12} className="text-slate-500 ml-1" />}
      </span>

      {/* Text Content */}
      <span
        className={`
          ${line.type === "command" ? "text-cyan-100 font-bold" : ""}
          ${line.type === "success" ? "text-emerald-400" : ""}
          ${line.type === "process" ? "text-blue-300" : ""}
          ${line.type === "code" ? "text-slate-400 italic" : ""}
          ${line.type === "final" ? "text-white font-bold" : ""}
          ${line.type === "info" ? "text-slate-400" : ""}
        `}
      >
        {line.text}
      </span>
    </motion.div>
  );
}

// Tiny Sparkle SVG for the final step
const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#FACC15" />
  </svg>
);