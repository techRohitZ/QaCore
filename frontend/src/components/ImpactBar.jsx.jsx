import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { Zap, Clock, Shield, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * IMPACT BAR - QaCore
 * - High-performance animated counters
 * - "Financial/Data" dashboard aesthetic with dividers
 * - Scroll-triggered animations
 */

const STATS = [
  {
    id: 1,
    icon: Zap,
    value: 90,
    suffix: "%",
    label: "Faster Test Creation",
    color: "text-amber-400", // Subtle specific color accent
  },
  {
    id: 2,
    icon: Clock,
    value: 2,
    suffix: " min",
    label: "Avg. Execution Time",
    prefix: "< ",
    color: "text-cyan-400",
  },
  {
    id: 3,
    icon: Shield,
    value: 0,
    suffix: " Flakes",
    label: "Deterministic Reliability",
    color: "text-emerald-400",
  },
  {
    id: 4,
    icon: CheckCircle2,
    value: 100,
    suffix: "%",
    label: "Playwright Compatible",
    color: "text-blue-400",
  },
];

// --- Sub-component: Scroll-Triggered Counter ---
function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function ImpactBar() {
  return (
    <section className="relative border-y border-slate-800 bg-[#020617] overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[2rem_2rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {STATS.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <div 
                key={stat.id} 
                className="relative group p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-900/50"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Wrapper */}
                <div className={`mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-lg ${stat.color.replace('text', 'shadow')}/20`}>
                  <Icon size={20} className={stat.color} />
                </div>

                {/* Number */}
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 mb-2">
                  {stat.prefix}
                  <AnimatedNumber value={stat.value} />
                  <span className="text-2xl md:text-3xl text-slate-500 font-medium ml-0.5">{stat.suffix}</span>
                </div>

                {/* Label */}
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </p>
              </div>
            );
          })}
        
        </div>
      </div>
    </section>
  );
}