import { motion } from "framer-motion";
import { XCircle, CheckCircle2, AlertCircle, Zap, ArrowRight } from "lucide-react";

/**
 * BEFORE vs AFTER AI
 * - High contrast comparison
 * - "Pain" vs "Gain" psychology
 * - Staggered animations
 */

const PAIN_POINTS = [
  { text: "Writing 100+ lines of brittle boilerplate code", sub: "Manual & Slow" },
  { text: "Tests break when CSS selectors change", sub: "High Maintenance" },
  { text: "Wait hours for sequential regression runs", sub: "Bottleneck" },
  { text: "Digging through console logs to find bugs", sub: "Frustrating" },
];

const QACORE_POINTS = [
  { text: "Generate test scripts from plain English", sub: "AI-Powered" },
  { text: "Self-healing selectors that adapt to UI changes", sub: "Zero Flake" },
  { text: "Parallel cloud execution in minutes", sub: "Lightning Fast" },
  { text: "Video replays & AI Root Cause Analysis", sub: "Instant Debugging" },
];

export default function BeforeAfterAI() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-125 h-125 bg-red-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          >
            Don't let manual testing <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-200 to-slate-500">
              slow you down.
            </span>
          </motion.h2>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative items-stretch">
          
          {/* --- THE OLD WAY (Left) --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-red-500/10 bg-slate-900/50 p-8 md:p-10 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-red-500/10">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200">The Old Way</h3>
                <p className="text-sm text-red-400 font-medium">Traditional Automation</p>
              </div>
            </div>

            {/* List */}
            <ul className="space-y-6">
              {PAIN_POINTS.map((item, i) => (
                <li key={i} className="flex gap-4 group opacity-70">
                  <XCircle className="shrink-0 text-red-500/50 mt-1" size={20} />
                  <div>
                    <p className="text-slate-300 font-medium">{item.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>


          {/* --- VS BADGE (Floating Center) --- */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-16 h-16 rounded-full bg-[#020617] border border-slate-700 flex items-center justify-center shadow-xl shadow-black/50">
              <span className="text-slate-500 font-bold text-sm">VS</span>
            </div>
          </div>


          {/* --- QACORE WAY (Right) --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-8 md:p-10 shadow-2xl shadow-cyan-900/20"
          >
            {/* Glow Border Effect */}
            <div className="absolute inset-0 rounded-3xl border border-cyan-500/20 blur-[1px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-cyan-500/20">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">With QaCore</h3>
                <p className="text-sm text-cyan-400 font-medium">AI-Native Automation</p>
              </div>
            </div>

            {/* List */}
            <ul className="space-y-6">
              {QACORE_POINTS.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 relative">
                    <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-40 rounded-full" />
                    <CheckCircle2 className="relative shrink-0 text-cyan-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.text}</p>
                    <p className="text-xs text-cyan-200/60 mt-0.5 uppercase tracking-wide">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Subtle "Win" Indicator */}
            <div className="mt-8 pt-6 border-t border-cyan-500/10 flex items-center justify-between">
               <span className="text-sm text-slate-400">Efficiency Boost</span>
               <span className="text-xl font-bold text-cyan-400">10x Faster</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}