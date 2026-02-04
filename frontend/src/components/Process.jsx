import { motion } from "framer-motion";
import { Sparkles, Play, BarChart3, ArrowRight } from "lucide-react";

/**
 * PROCESS SECTION
 * - Visual "Pipeline" design with connecting lines.
 * - Glassmorphic cards.
 * - Staggered sequential animation.
 */

const STEPS = [
  {
    icon: Sparkles,
    title: "AI Generation",
    desc: "Paste any URL. Our AI analyzes the DOM and writes robust Playwright scripts in seconds.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Play,
    title: "Headless Execution",
    desc: "Tests run instantly in our secure cloud grid. Zero flakiness, deterministic results.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Get actionable insights, video replays of failures, and network logs immediately.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60 } }
};

export default function Process() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-100 bg-slate-900/50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight"
          >
            From URL to Report <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-200 to-slate-500">
              in three simple steps.
            </span>
          </motion.h2>
        </div>

        {/* --- PROCESS PIPELINE --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          
          {/* CONNECTING LINE (Desktop: Horizontal, Mobile: Vertical) */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-linear-to-r from-transparent via-slate-700 to-transparent hidden md:block" />
          <div className="absolute top-8 bottom-8 left-8 w-0.5 bg-linear-to-b from-transparent via-slate-700 to-transparent md:hidden" />

          {STEPS.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="relative group">
              
              {/* Step Badge (The Number) */}
              <div className="absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-white z-20 shadow-xl group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300">
                {i + 1}
              </div>

              {/* The Card */}
              <div className="mt-8 pt-8 px-6 pb-6 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 transition-colors text-center md:text-left h-full">
                
                {/* Icon */}
                <div className={`mx-auto md:mx-0 w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center ${step.color} mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <step.icon size={32} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.desc}
                </p>

                {/* Arrow (Desktop only visual cue) */}
                {i !== STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 text-slate-700 transform -translate-y-1/2">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>

            </motion.div>
          ))}

        </motion.div>

      </div>
    </section>
  );
}