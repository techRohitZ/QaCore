import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, MapPin, Sparkles, Coffee, Terminal, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate API call - In production, connect this to your backend
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-6 py-20 overflow-hidden">
      
      {/* --- BACKDROP DECORATION --- */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        
        {/* --- LEFT COLUMN: THE HOOK --- */}
        <div className="space-y-10">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={12} className="animate-pulse" />
              Human-to-Human Protocol
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Don't be a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                stranger.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Found a bug? Want to talk about AI? Or just want to debate why Poha is the best breakfast? We're all ears.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md group hover:border-cyan-500/50 transition-all">
              <Mail className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="text-white font-bold text-sm">Direct Transmission</h3>
              <p className="text-xs text-slate-500 mt-1">hello@neuralqa.dev</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md group hover:border-blue-500/50 transition-all">
              <MapPin className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="text-white font-bold text-sm">Base Station</h3>
              <p className="text-xs text-slate-500 mt-1">Indore, MP (The Poha Capital)</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-6 text-slate-600 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <Coffee size={14} /> Powered by Caffeine
            </div>
            <div className="flex items-center gap-2">
               <Terminal size={14} /> Built for Engineers
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: THE FORM --- */}
        <motion.div variants={itemVariants} className="relative">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Message Intercepted!</h2>
                  <p className="text-slate-400 text-sm">Our AI (and some humans) will review this shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Agent Smith"
                      className="w-full h-14 rounded-2xl bg-slate-950 border border-slate-800 text-white px-5 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Response Channel (Email)</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="smith@matrix.com"
                      className="w-full h-14 rounded-2xl bg-slate-950 border border-slate-800 text-white px-5 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Query</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="I found a glitch in the Matrix..."
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white p-5 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all resize-none shadow-inner"
                    />
                  </div>

                  <button
                    disabled={status === "sending"}
                    className="w-full relative group h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 p-px overflow-hidden shadow-lg shadow-cyan-500/20"
                  >
                    <div className="w-full h-full bg-transparent flex items-center justify-center gap-3 text-slate-950 font-black uppercase tracking-widest text-xs transition-all group-hover:bg-white/10">
                      {status === "sending" ? (
                        <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Establish Connection</span>
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}