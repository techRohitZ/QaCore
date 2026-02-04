import { motion } from "framer-motion";
import { ShieldCheck, Zap, Workflow } from "lucide-react";

/**
 * WHY US SECTION
 * - Professional Left-Aligned Layout
 * - High-end "Glassmorphic" cards
 * - Hover glow effects
 * - Staggered entrance animations
 */

const FEATURES = [
  {
    icon: Zap,
    title: "Zero Setup",
    desc: "Stop wrestling with config files. Generate and run tests instantly from any URL.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Workflow,
    title: "Built for Scale",
    desc: "Designed for enterprise workflows: manage thousands of test runs with ease.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: ShieldCheck,
    title: "Production Safe",
    desc: "Headless execution in isolated environments ensures your live data stays safe.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } },
};

export default function WhyUs() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-7xl mx-auto px-6"
      >
        
        {/* --- HEADER (Left Aligned for Professional Look) --- */}
        <div className="max-w-3xl mb-16 space-y-6">
          <motion.div variants={itemVariants} className="flex justify-start">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <Zap size={12} className="text-amber-400" fill="currentColor" />
                <span>Performance First</span>
             </div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Built for the <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              Modern QA Stack
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            We stripped away the complexity of traditional automation tools to focus on what matters: speed, reliability, and developer experience.
          </motion.p>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((p, i) => (
            <motion.div
              key={p.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Card Inner Glow */}
              <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                
                {/* Icon Wrapper */}
                <div className={`mb-6 w-14 h-14 rounded-2xl ${p.bg} border border-white/5 flex items-center justify-center ${p.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <p.icon size={28} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Learn More Link (Visual) */}
                <div className="pt-6 mt-auto flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Learn more <span className="text-cyan-400">→</span>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}