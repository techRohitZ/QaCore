import { motion } from "framer-motion";
import { Code2, Terminal, GitBranch, Cpu, ChevronRight, Copy } from "lucide-react";

/**
 * BUILT FOR DEV
 * - Highlights the "Developer Experience" (DX).
 * - Features a realistic "VS Code" style code snippet.
 * - Emphasizes clean architecture.
 */

const FEATURES = [
  {
    icon: Code2,
    title: "Playwright Native",
    desc: "No proprietary lock-in. We generate standard Playwright Typescript code you can export and own."
  },
  {
    icon: Terminal,
    title: "CLI & CI/CD Ready",
    desc: "Run tests locally via CLI or integrate seamlessly into GitHub Actions, Jenkins, or GitLab."
  },
  {
    icon: GitBranch,
    title: "Version Controllable",
    desc: "Treat your test suites like code. Branch, merge, and review changes just like your app code."
  }
];

export default function BuiltForDev() {
  return (
    <section className="py-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* ================= LEFT: CONTENT ================= */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
               <Cpu size={14} />
               <span>Developer First</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Don't fight the tool. <br />
              <span className="text-slate-400">Control the code.</span>
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed">
              Most low-code tools are black boxes. QaCore is different. We respect your architecture, offering deterministic execution and full access to the underlying code.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-6">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex gap-4 group"
              >
                <div className="mt-1 w-10 h-10 shrink-0 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* ================= RIGHT: CODE VISUAL ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow Behind */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl -z-10 rounded-full opacity-50" />

          {/* Code Window */}
          <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-2xl">
            
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80" />
               </div>
               <div className="text-xs text-slate-500 font-mono">neuralqa.config.ts</div>
               <Copy size={14} className="text-slate-600 cursor-pointer hover:text-slate-400" />
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="block">
                  <span className="text-purple-400">import</span>{" "}
                  <span className="text-slate-300">{`{ defineConfig }`}</span>{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-green-400">'@neuralqa/core'</span>;
                </code>
                <code className="block mt-4">
                  <span className="text-purple-400">export default</span>{" "}
                  <span className="text-blue-400">defineConfig</span>({`{`}
                </code>
                <code className="block pl-4">
                  <span className="text-slate-300">baseUrl:</span>{" "}
                  <span className="text-green-400">'https://app.example.com'</span>,
                </code>
                <code className="block pl-4">
                  <span className="text-slate-300">browser:</span>{" "}
                  <span className="text-green-400">'chromium'</span>,
                </code>
                <code className="block pl-4">
                  <span className="text-slate-300">aiModel:</span>{" "}
                  <span className="text-green-400">'gpt-4-turbo'</span>,
                </code>
                <code className="block pl-4">
                  <span className="text-slate-300">retries:</span>{" "}
                  <span className="text-orange-400">2</span>,
                </code>
                <code className="block pl-4">
                  <span className="text-slate-300">headless:</span>{" "}
                  <span className="text-orange-400">true</span>,
                </code>
                <code className="block">
                  {`});`}
                </code>
                <code className="block mt-4 text-slate-500 text-xs">
                  {`// NeuralQA generates native Playwright code`}
                </code>
              </pre>
            </div>
            
            {/* Bottom Status Bar */}
            <div className="px-4 py-1 bg-[#161b22] border-t border-slate-800 flex justify-between text-[10px] text-slate-500 font-mono">
               <span>TypeScript React</span>
               <span>Ln 12, Col 4</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}