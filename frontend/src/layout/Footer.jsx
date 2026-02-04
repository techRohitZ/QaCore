import { motion } from "framer-motion";
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 pt-16 pb-8 overflow-hidden">
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10"
      >
        {/* 1. Brand & Description */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-xl font-black text-white italic tracking-tighter">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap size={18} fill="currentColor" />
            </div>
            AI-QA<span className="text-cyan-400">.dev</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Revolutionizing software quality through autonomous AI agent testing and real-time execution monitoring.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
             <Github size={18} className="hover:text-white cursor-pointer transition-colors" />
             <Twitter size={18} className="hover:text-cyan-400 cursor-pointer transition-colors" />
             <Linkedin size={18} className="hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </motion.div>

        {/* 2. Product Links */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">Product</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {["Dashboard", "Projects", "Test Runner", "API Reference"].map((link) => (
              <li key={link} className="hover:text-cyan-400 cursor-pointer transition-all hover:translate-x-1 duration-200">
                {link}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 3. Tech Stack / Ecosystem */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">Engine</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {["Playwright Core", "Google Gemini AI", "Node.js Environment", "MongoDB Atlas"].map((link) => (
              <li key={link} className="hover:text-white cursor-default transition-all">
                {link}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 4. Newsletter/Call to Action */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">System Status</h4>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">All Systems Operational</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-normal">
               AI-QA clusters are currently optimized and ready for high-load test generation.
             </p>
          </div>
        </motion.div>
      </motion.div>

      {/* --- COPYRIGHT BAR --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600"
      >
        <p>© {currentYear} QaCore · Engineering the future of QA</p>
        <div className="flex items-center gap-1">
          Made with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">Developer</span>
        </div>
      </motion.div>
    </footer>
  );
}