import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Globe, Zap, CheckCircle2, Layers, Rocket, Sparkles, Coffee } from "lucide-react";
import { useRef } from "react";

export default function About() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 70, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-200 selection:bg-cyan-500/30">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px]" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.05]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >

          {/* --- LEFT COLUMN: THE HOOK --- */}
          <div className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-900/20">
                <Rocket size={14} className="animate-bounce" />
                V1.0.0 - Stable Release
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white">
                We automate <br />
                the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">boring stuff.</span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed font-light">
                QaCore isn't just a tool; it's a rebellion against flaky tests and endless manual clicking. We teach AI to see your app like a human, but test it like a machine.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
               <StatBadge number="99%" label="Uptime" />
               <StatBadge number="0.2s" label="Latency" />
               <StatBadge number="∞" label="Coffees" highlight />
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: THE VISUAL STORY --- */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="ml-4 text-xs font-mono text-slate-500">mission_control.tsx</div>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                  <span className="text-slate-600">01</span>
                  <span className="text-purple-400">const</span> 
                  <span className="text-yellow-200">future</span> 
                  <span className="text-slate-400">=</span> 
                  <span className="text-cyan-400">await</span> 
                  <span className="text-blue-400">buildBetterQA()</span>;
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600">02</span>
                  <span className="text-purple-400">if</span> 
                  <span className="text-yellow-200">(manualTesting)</span> 
                  <span className="text-slate-400">{`{`}</span>
                </div>
                <div className="flex gap-3 pl-8">
                  <span className="text-slate-600">03</span>
                  <span className="text-red-400">throw new Error</span>
                  <span className="text-green-300">("Ain't nobody got time for that")</span>;
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600">04</span>
                  <span className="text-slate-400">{`}`}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400`}>Dev</div>
                    ))}
                 </div>
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Open Source Core</div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl z-20 hidden md:block"
            >
              <Cpu className="text-cyan-400" size={32} />
            </motion.div>
          </motion.div>

        </motion.div>


        {/* --- SCROLL SECTION: PHILOSOPHY --- */}
        <div ref={targetRef} className="mt-40 space-y-24">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
             <h2 className="text-3xl md:text-5xl font-black text-white">Why we built this.</h2>
             <p className="text-slate-400">Because writing E2E tests manually feels like assembling IKEA furniture without the manual.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <FeatureCard 
               icon={<Zap size={24} />} 
               title="Speed First" 
               desc="Optimized for millisecond-level interactions. No artificial delays."
               color="text-yellow-400"
             />
             <FeatureCard 
               icon={<CheckCircle2 size={24} />} 
               title="Zero Flakiness" 
               desc="Our AI retries smartly, ignoring temporary network hiccups."
               color="text-emerald-400"
             />
             <FeatureCard 
               icon={<Globe size={24} />} 
               title="Runs Anywhere" 
               desc="Execute tests on your local machine or in our cloud containers."
               color="text-blue-400"
             />
          </div>

        </div>

        {/* --- BOTTOM CTA --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-cyan-600 to-blue-700 text-center relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
           
           <div className="relative z-10 space-y-6">
             <h2 className="text-4xl font-black text-white">Ready to break things?</h2>
             <p className="text-cyan-100 max-w-lg mx-auto text-lg">
               Join the developers who are shipping faster by letting AI handle the QA heavy lifting.
             </p>
             <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:scale-105 transition-transform">
               Get Started for Free
             </button>
           </div>
        </motion.div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatBadge({ number, label, highlight }) {
  return (
    <div className={`flex flex-col px-6 py-3 rounded-2xl border ${highlight ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
       <span className={`text-2xl font-black ${highlight ? 'text-cyan-400' : 'text-white'}`}>{number}</span>
       <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 backdrop-blur-sm hover:bg-slate-900/60 transition-colors group"
    >
       <div className={`w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
       </div>
       <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
       <p className="text-slate-400 leading-relaxed text-sm">
         {desc}
       </p>
    </motion.div>
  );
}