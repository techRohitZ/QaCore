import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Rocket, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function CTA() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleClick = () => {
    navigate(loggedIn ? "/dashboard" : "/login");
  };

  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
         
         {/* Big Glow behind the card */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-cyan-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-black/50"
        >
          
          {/* Subtle animated border gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent opacity-50" />

          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            
            {/* Left: Copy */}
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                <Rocket size={12} />
                Ready for liftoff?
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Stop testing manually. <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-sky-500">
                  Start automating intelligently.
                </span>
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Free tier available</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-700 rounded-full" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right: Button */}
            <div className="shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-8 py-5 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                
                <div className="relative flex items-center gap-3">
                  {loggedIn ? (
                    <>
                      <span>Go to Dashboard</span>
                      <LayoutDashboard size={20} />
                    </>
                  ) : (
                    <>
                      <span>Start Testing Free</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
              
              <p className="mt-4 text-xs text-slate-500 text-center">
                Includes 500 free AI generations/mo
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}