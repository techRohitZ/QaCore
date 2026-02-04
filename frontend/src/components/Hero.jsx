import { motion } from "framer-motion";
import { ArrowRight, Play, Terminal, Zap, CheckCircle2, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function Hero() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-slate-950">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Glow Spots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* --- LEFT COLUMN: VALUE PROP --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mx-auto lg:mx-0 cursor-default hover:border-cyan-400/50 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
              v1.0 Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Automate QA <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 animate-gradient">
               at the Speed of AI.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
             Stop writing brittle selectors. QaCore uses generative AI to build, execute, and heal Playwright tests automatically. 
             <span className="text-slate-200 font-medium"> Zero code required.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(loggedIn ? "/dashboard" : "/login")}
              className="relative group px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-sm shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.5)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {loggedIn ? "Launch Dashboard" : "Start Automating"} 
                <ArrowRight size={16} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Play size={16} fill="currentColor" /> Watch Demo
            </motion.button>
          </div>
          
          {/* Social Proof */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-xs font-mono uppercase tracking-widest opacity-60">
             <span>Trusted by Builders at</span>
             <div className="flex gap-4 grayscale">
                {/* Simple text placeholders or SVGs for fake logos */}
                <span className="font-black">ACME Corp</span>
                <span className="font-black">Stark Ind.</span>
                <span className="font-black">Cyberdyne</span>
             </div>
          </div>
        </motion.div>


        {/* --- RIGHT COLUMN: THE SIMULATION --- */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative perspective-1000"
        >
           {/* Floating Code Window */}
           <div className="relative z-20 bg-[#0d1117] border border-slate-700/50 rounded-2xl shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 overflow-hidden">
              
              {/* Window Header */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
                 <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                    <Command size={10} />
                    ai-agent-runner — node
                 </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-xs md:text-sm h-[320px] overflow-hidden relative">
                 <TerminalSimulator />
                 {/* Vignette Overlay */}
                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0d1117] to-transparent h-20 bottom-0 top-auto" />
              </div>

              {/* Floating Success Badge */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.5, type: "spring" }}
                className="absolute bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                 <CheckCircle2 size={16} /> All Tests Passed
              </motion.div>
           </div>

           {/* Decorative Background Elements behind terminal */}
           <div className="absolute -top-10 -right-10 w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-2xl -z-10" />
        </motion.div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENT: TERMINAL TYPEWRITER ---
function TerminalSimulator() {
  const [lines, setLines] = useState([
    "> Initializing AI Agent...",
    "> Analyzing DOM structure for https://app.example.com",
    "> Generating selectors..."
  ]);

  useEffect(() => {
    const sequence = [
      { text: "✓ Found login form (#login-form)", color: "text-emerald-400", delay: 800 },
      { text: "> Generative Model: Writing Playwright script...", color: "text-purple-400", delay: 1800 },
      { text: "> Executing: await page.click('#submit')", color: "text-cyan-400", delay: 2800 },
      { text: "> Verifying navigation...", color: "text-slate-300", delay: 3500 },
      { text: "✓ Dashboard loaded successfully", color: "text-emerald-400", delay: 4200 },
      { text: "> Test Suite Completed in 450ms", color: "text-slate-400", delay: 5000 },
    ];

    let timeouts = [];
    sequence.forEach(({ text, color, delay }) => {
       const id = setTimeout(() => {
          setLines((prev) => [...prev, { text, color }]);
       }, delay);
       timeouts.push(id);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-2">
       {lines.map((line, i) => (
          <div key={i} className={`${line.color || "text-slate-400"} flex gap-2`}>
             <span className="opacity-50">$</span>
             <motion.span 
               initial={{ opacity: 0, x: 10 }} 
               animate={{ opacity: 1, x: 0 }}
             >
                {line.text || line}
             </motion.span>
          </div>
       ))}
       <motion.div 
         animate={{ opacity: [0, 1, 0] }} 
         transition={{ repeat: Infinity, duration: 0.8 }}
         className="w-2 h-4 bg-cyan-500 mt-2" 
       />
    </div>
  );
}
// import { motion } from "framer-motion";
// import { ArrowRight, Sparkles, Play, BarChart3, Zap } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";

// /**
//  * HERO SECTION
//  * - Two-column SaaS hero
//  * - Left: Value + CTA
//  * - Right: Animated info slider (auto-rotating)
//  * - Mobile: stacks cleanly
//  */

// const SLIDES = [
//   {
//     icon: Sparkles,
//     title: "AI Test Generation",
//     desc: "Generate Playwright test cases automatically from any URL using AI.",
//   },
//   {
//     icon: Play,
//     title: "Headless Execution",
//     desc: "Run tests safely with screenshots, logs, and deterministic retries.",
//   },
//   {
//     icon: BarChart3,
//     title: "Actionable Reports",
//     desc: "Clear pass/fail insights with full execution history.",
//   },
// ];

// export default function Hero() {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();

//   const [active, setActive] = useState(0);

//   // Auto-rotate slider
//   useEffect(() => {
//     const id = setInterval(() => {
//       setActive((prev) => (prev + 1) % SLIDES.length);
//     }, 3500);
//     return () => clearInterval(id);
//   }, []);

//   return (
//     <section className="relative overflow-hidden py-20 md:py-24">
//       {/* ===== Ambient Background ===== */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-130 w-130 rounded-full bg-cyan-500/10 blur-3xl" />
//         <div className="absolute bottom-[-20%] right-[-10%] h-105 w-105 rounded-full bg-sky-400/10 blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

//         {/* ================= LEFT SIDE ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="space-y-8"
//         >
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-300">
//             <Zap size={14} />
//             AI-Powered QA Automation
//           </div>

//           {/* Headline */}
//           <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold tracking-tight text-slate-100 leading-tight">
//             Test smarter.
//             <br />
//             <span className="text-cyan-400">Ship with confidence.</span>
//           </h1>

//           {/* Subheadline */}
//           <p className="max-w-xl text-slate-400 text-lg">
//             Generate, execute, and analyze Playwright test cases automatically using AI —
//             built for modern engineering teams.
//           </p>

//           {/* CTAs */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={() => navigate(loggedIn ? "/dashboard" : "/login")}
//               className="group inline-flex items-center justify-center gap-2 rounded-xl
//               bg-linear-to-r from-sky-500 to-cyan-500
//               px-6 py-3 text-sm font-semibold text-slate-900
//               shadow-lg shadow-cyan-500/25 hover:brightness-110 transition"
//             >
//               {loggedIn ? "Go to Dashboard" : "Get Started"}
//               <ArrowRight
//                 size={16}
//                 className="transition-transform group-hover:translate-x-1"
//               />
//             </button>

//             <button
//               onClick={() => navigate("/login")}
//               className="rounded-xl border border-slate-700 px-6 py-3
//               text-sm font-medium text-slate-300
//               hover:border-cyan-400 hover:text-cyan-300 transition"
//             >
//               View Demo
//             </button>
//           </div>

//           {/* Trust line */}
//           <p className="text-xs text-slate-500">
//             Playwright • Node.js • MongoDB • AI-Driven
//           </p>
//         </motion.div>

//         {/* ================= RIGHT SIDE ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="relative"
//         >
//           {/* Slider Card */}
//           <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-8 overflow-hidden shadow-xl">

//             {/* Glow */}
//             <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-500/10 to-transparent" />

//             {/* Slides */}
//             <div className="relative z-10 space-y-6">
//               {SLIDES.map((slide, i) => {
//                 const Icon = slide.icon;
//                 const activeSlide = i === active;

//                 return (
//                   <motion.div
//                     key={slide.title}
//                     animate={{
//                       opacity: activeSlide ? 1 : 0.4,
//                       scale: activeSlide ? 1 : 0.95,
//                     }}
//                     transition={{ duration: 0.4 }}
//                     className={`flex gap-4 rounded-xl p-4 transition
//                       ${activeSlide ? "bg-slate-800/60" : "bg-transparent"}`}
//                   >
//                     <div className="mt-1 rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
//                       <Icon size={20} />
//                     </div>

//                     <div>
//                       <h3 className="text-sm font-medium text-slate-100">
//                         {slide.title}
//                       </h3>
//                       <p className="text-xs text-slate-400 mt-1">
//                         {slide.desc}
//                       </p>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Progress dots */}
//             <div className="mt-6 flex gap-2 justify-center">
//               {SLIDES.map((_, i) => (
//                 <div
//                   key={i}
//                   className={`h-1.5 w-1.5 rounded-full transition
//                     ${i === active ? "bg-cyan-400" : "bg-slate-600"}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }


// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowRight, Sparkles, Play, BarChart3, Zap, Terminal } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";

// /**
//  * HERO SECTION - QACORE
//  * - Implements "Layout Animations" for the slider (the moving glow effect).
//  * - Adds a "Tech Grid" background for developer appeal.
//  * - Interactive slide switching.
//  */

// const SLIDES = [
//   {
//     id: "ai",
//     icon: Sparkles,
//     title: "AI Test Generation",
//     desc: "Transform plain English into robust Playwright scripts instantly using our advanced LLM engine.",
//   },
//   {
//     id: "headless",
//     icon: Terminal,
//     title: "Headless Cloud Execution",
//     desc: "Run thousands of tests in parallel on our secure cloud grid with zero-flake infrastructure.",
//   },
//   {
//     id: "reports",
//     icon: BarChart3,
//     title: "Deep Insights & Analytics",
//     desc: "Debug failures faster with video replays, network logs, and AI-driven root cause analysis.",
//   },
// ];

// export default function Hero() {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();
//   const [active, setActive] = useState(0);

//   // Auto-rotate slider logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % SLIDES.length);
//     }, 5000); // 5 seconds per slide
//     return () => clearInterval(timer);
//   }, [active]);

//   return (
//     <section className="relative overflow-hidden py-20 md:py-32 bg-[#020617]">
      
//       {/* ===== 1. TECH GRID BACKGROUND ===== */}
//       <div className="absolute inset-0 pointer-events-none opacity-20">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
//       </div>

//       {/* ===== 2. GLOWING ORBS ===== */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <motion.div 
//           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
//           transition={{ duration: 8, repeat: Infinity }}
//           className="absolute -top-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" 
//         />
//         <div className="absolute top-[10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

//         {/* ================= LEFT SIDE: COPY ================= */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="space-y-8"
//         >
//           {/* Badge */}
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]"
//           >
//             <Zap size={14} fill="currentColor" />
//             <span>v1.0 is now live</span>
//           </motion.div>

//           {/* Headline */}
//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
//             QA Automation, <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
//               Reimagined.
//             </span>
//           </h1>

//           {/* Subheadline */}
//           <p className="max-w-xl text-slate-400 text-lg md:text-xl leading-relaxed">
//             Stop writing brittle selectors. 
//             <strong className="text-slate-200 font-medium"> QaCore </strong> 
//             turns natural language into resilient Playwright test suites in seconds.
//           </p>

//           {/* CTAs */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-2">
//             <button
//               onClick={() => navigate(loggedIn ? "/dashboard" : "/login")}
//               className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40"
//             >
//               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//               <span className="relative">{loggedIn ? "Go to Dashboard" : "Start Testing Free"}</span>
//               <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1" />
//             </button>

//             <button
//               onClick={() => navigate("/about")}
//               className="rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-sm font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all backdrop-blur-sm"
//             >
//               How it works
//             </button>
//           </div>

//           {/* Social Proof / Tech Stack */}
//           <div className="pt-6 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
//              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Powered By:</span>
//              {/* Simple visual representation of tech stack */}
//              <div className="flex gap-4">
//                 <Play size={20} className="text-orange-500" /> {/* Playwright color hint */}
//                 <Terminal size={20} className="text-green-500" /> {/* Node color hint */}
//                 <Sparkles size={20} className="text-purple-500" /> {/* AI color hint */}
//              </div>
//           </div>
//         </motion.div>

//         {/* ================= RIGHT SIDE: INTERACTIVE SLIDER ================= */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="relative"
//         >
//           {/* Glass Card Container */}
//           <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-2 shadow-2xl">
            
//             {/* The List of Features */}
//             <div className="flex flex-col gap-2">
//               {SLIDES.map((slide, i) => {
//                 const isActive = i === active;
//                 const Icon = slide.icon;

//                 return (
//                   <div
//                     key={slide.id}
//                     onClick={() => setActive(i)} // Allow manual click
//                     className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 group ${isActive ? "" : "hover:bg-slate-800/30"}`}
//                   >
//                     {/* THE MAGIC: Moving Background using layoutId */}
//                     {isActive && (
//                       <motion.div
//                         layoutId="activeSlide"
//                         className="absolute inset-0 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg"
//                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                       />
//                     )}

//                     <div className="relative z-10 flex gap-5">
//                       {/* Icon Box */}
//                       <div className={`mt-1 h-12 w-12 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 
//                         ${isActive ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "bg-slate-800 text-slate-400 group-hover:text-cyan-400"}`}>
//                         <Icon size={24} />
//                       </div>

//                       {/* Text Content */}
//                       <div className="flex flex-col justify-center">
//                         <h3 className={`text-lg font-bold transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
//                           {slide.title}
//                         </h3>
//                         <p className={`text-sm mt-1 transition-colors duration-300 leading-relaxed ${isActive ? "text-slate-300" : "text-slate-500"}`}>
//                           {slide.desc}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Progress Bar (Only visible when active) */}
//                     {isActive && (
//                       <motion.div 
//                         initial={{ width: "0%" }}
//                         animate={{ width: "100%" }}
//                         transition={{ duration: 5, ease: "linear" }}
//                         className="absolute bottom-0 left-6 right-6 h-[2px] bg-cyan-500/50 rounded-full"
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//           </div>
          
//           {/* Decorative Elements behind the card */}
//           <div className="absolute -z-10 top-10 right-10 w-full h-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-3xl blur-2xl" />

//         </motion.div>
//       </div>
//     </section>
//   );
// }