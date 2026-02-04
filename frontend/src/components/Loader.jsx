import { motion } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * PROFESSIONAL AI LOADER
 * Used as a fallback during lazy-loading of pages.
 */
export default function Loader() {
  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-slate-950">
      <div className="relative">
        {/* Outer Pulsing Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-cyan-500 blur-2xl rounded-full"
        />

        {/* Inner Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative z-10 h-16 w-16 flex items-center justify-center rounded-2xl bg-slate-900 border border-cyan-500/50 text-cyan-400 shadow-xl"
        >
          <Zap size={32} fill="currentColor" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]"
      >
        Initializing AI Environment
      </motion.p>
    </div>
  );
}