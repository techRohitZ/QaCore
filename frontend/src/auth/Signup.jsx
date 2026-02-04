import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BarChart3 
} from "lucide-react";
import { signup } from "../api/auth.api";
import { setAuth } from "../utils/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signup({ name, email, password });
      if (res.data && res.data.token) {
        setAuth(res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100 } 
    },
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden">
      
      {/* --- LEFT SIDE: THE FORM --- */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-10">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          {/* Brand/Mobile Header */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap size={24} fill="currentColor" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-black text-white tracking-tight">Get Started.</h1>
              <p className="text-slate-400 mt-2 text-lg">Create your account to start automating.</p>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full h-14 bg-linear-to-r from-sky-500 to-cyan-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 transition-all"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20}/></>}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center text-slate-500 text-sm">
            Already have an account? <span onClick={() => navigate("/login")} className="text-cyan-400 cursor-pointer font-bold hover:underline">Sign in</span>
          </motion.p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: THE CONTENT --- */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-1 bg-slate-900/50 border-l border-slate-800 flex-col justify-center px-20 relative"
      >
        <div className="absolute inset-0 bg-linear-to-bl from-cyan-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Powerful features for <br />
              <span className="text-cyan-500">Modern QA Teams.</span>
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <Cpu size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">AI-Powered Extraction</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Automatically identifies critical paths and interactive elements on any URL.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Self-Healing Tests</h4>
                <p className="text-slate-400 text-sm leading-relaxed">AI adapts to UI changes, ensuring your test suite never breaks due to small updates.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <BarChart3 size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Advanced Analytics</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Track pass rates, regression trends, and system health in real-time.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Trusted by builders worldwide</p>
            <div className="flex gap-6 mt-4 opacity-30 grayscale invert">
              {/* Optional: Add small SVG logos here */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}