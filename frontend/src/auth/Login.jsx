import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { login } from "../api/auth.api";
import { setAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login({ email, password });
      if (res.data?.token) {
        setAuth(res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden">
      
      {/* --- LEFT SIDE: FEATURE CONTENT --- */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex flex-1 relative flex-col justify-center px-16 bg-slate-900/50 border-r border-slate-800"
      >
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Zap size={28} />
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tight leading-tight">
            Automate Your <br />
            <span className="text-cyan-400">Quality Assurance</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            The next generation of AI-powered test generation is here. Secure your workflows and ship faster.
          </p>
          
          <div className="space-y-4 pt-8">
            {[ "AI-Driven Selectors", "One-Click Test Generation", "Real-time Monitoring" ].map((text, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-slate-300"
              >
                <CheckCircle2 size={18} className="text-cyan-500" />
                <span className="font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center lg:text-left space-y-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h3>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full h-14 bg-linear-to-r from-sky-500 to-cyan-500 text-slate-950 font-black rounded-2xl hover:shadow-xl hover:shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20}/></>}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account? <span onClick={() => navigate("/signup")} className="text-cyan-400 cursor-pointer hover:underline font-bold">Create one</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}