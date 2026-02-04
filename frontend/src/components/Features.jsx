import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Sparkles, Play, RotateCcw, BarChart3, Layers } from "lucide-react";

/**
 * FEATURES SECTION
 * - Includes a custom "Spotlight" hover effect.
 * - Distinct color themes for each feature.
 * - Grid layout with glassmorphism.
 */

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Test Generation",
    desc: "Stop writing boilerplate. Our LLM engine analyzes your DOM and generates robust Playwright scripts instantly.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
    shadow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Play,
    title: "Headless Execution",
    desc: "Run tests in parallel on our secure cloud grid. Zero setup, zero maintenance, just fast results.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
    shadow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: RotateCcw,
    title: "Smart Auto-Retries",
    desc: "Flaky test detection is built-in. We automatically retry failed steps to differentiate bugs from noise.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/50",
    shadow: "group-hover:shadow-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Trace every run with video replays, network logs, and DOM snapshots to debug in seconds.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "group-hover:border-cyan-500/50",
    shadow: "group-hover:shadow-cyan-500/20",
  },
];

export default function Features() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-linear-to-b from-slate-900/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Layers size={12} />
            <span>Everything you need</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight"
          >
            Built for Modern <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              QA Engineering
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-400 leading-relaxed"
          >
            We've automated the tedious parts of testing so you can focus on shipping features.
          </motion.p>
        </div>

        {/* --- FEATURE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
        
      </div>
    </section>
  );
}

// --- SUB-COMPONENT: SPOTLIGHT CARD ---
function FeatureCard({ feature, index }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${feature.border} hover:shadow-xl ${feature.shadow}`}
    >
      
      {/* 1. MOUSE SPOTLIGHT EFFECT */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />

      {/* 2. GRID PATTERN OVERLAY (Subtle Tech Feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[14px_14px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

      {/* 3. CARD CONTENT */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Icon */}
        <div className={`mb-6 w-12 h-12 rounded-lg ${feature.bg} border border-white/5 flex items-center justify-center ${feature.color} shadow-lg`}>
          <feature.icon size={24} />
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-50 transition-colors">
          {feature.title}
        </h3>
        
        <p className="text-sm text-slate-400 leading-relaxed">
          {feature.desc}
        </p>

        {/* Learn More (Auto-position at bottom) */}
        <div className="mt-auto pt-6 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className={`text-xs font-bold uppercase tracking-wider ${feature.color}`}>
            Explore Feature &rarr;
          </span>
        </div>
      </div>

    </motion.div>
  );
}