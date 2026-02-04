import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Code2, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  FileCode,
  ChevronDown,
  Globe,
  Settings
} from "lucide-react";
import { getProjectById, runProjectSuite, getProjectRuns } from "../api/project.api";

// Reusable Code Block with Syntax-ish highlighting
const CodeBlock = ({ code }) => (
  <div className="relative group">
    <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
      Playwright / TS
    </div>
    <pre className="bg-[#0b0e14] text-slate-300 p-5 rounded-2xl overflow-x-auto text-sm font-mono border border-slate-800/50 leading-relaxed shadow-inner">
      {code}
    </pre>
  </div>
);

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tests"); 
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState([]); 
  const [runsLoading, setRunsLoading] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState(null);

  // 1. Fetch Project Data
  const fetchProject = useCallback(async () => {
    try {
      const res = await getProjectById(id);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to load project", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 2. Fetch Run History
  const fetchHistory = useCallback(async () => {
    try {
      setRunsLoading(true);
      const res = await getProjectRuns(id);
      // Ensure we always have an array
      const runsData = res.data?.data || res.data || [];
      setRuns(Array.isArray(runsData) ? runsData : []); 
    } catch (err) {
      console.error("Failed to load history", err);
      setRuns([]);
    } finally {
      setRunsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (activeTab === "runs") {
      fetchHistory();
      const interval = setInterval(() => fetchHistory(), 8000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchHistory]);

  const handleRunSuite = async () => {
    try {
      setRunning(true);
      await runProjectSuite(id);
      setActiveTab("runs");
      await fetchHistory();
    } catch (err) {
      console.error("Run failed", err);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <p className="text-slate-500 font-mono text-sm tracking-widest">SYNCING PROJECT DATA</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* --- BREADCRUMBS & HEADER --- */}
      <div className="space-y-6">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Back to Projects
        </motion.button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <FileCode size={28} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight italic">
                {project.name}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400 ml-1">
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-slate-600"/> {project.url}</span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-600"/> Updated {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
              <Settings size={20} />
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunSuite}
              disabled={running}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-slate-950 font-black shadow-xl transition-all ${
                running 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-linear-to-r from-cyan-400 to-sky-500 shadow-cyan-500/20"
              }`}
            >
              {running ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
              {running ? "EXECUTING..." : "RUN SUITE"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="border-b border-slate-800/50 flex gap-10">
        {["tests", "runs"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "tests" ? "Generated Suite" : "Execution History"}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            )}
          </button>
        ))}
        {activeTab === "runs" && runsLoading && (
          <div className="pb-4 flex items-center gap-2 text-[10px] text-cyan-500/50 font-bold uppercase tracking-widest animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
            Live Sync
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="min-h-100"
        >
          {activeTab === "tests" ? (
            <div className="grid gap-6">
              {project.tests?.length > 0 ? (
                project.tests.map((test, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="rounded-3xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-md overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Terminal size={16} className="text-cyan-500" />
                        <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">
                          {test.title || `Test_Case_${i+1}.spec.ts`}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <CodeBlock code={test.code} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-800/50">
                  <p className="text-slate-500 font-medium">No tests generated yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {runs.length > 0 ? (
                runs.map((run, i) => {
                  const status = run.status?.toLowerCase() || 'pending';
                  const isPassed = status === 'passed' || status === 'completed';
                  const isFailed = status === 'failed';

                  return (
                    <motion.div 
                      key={run._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-md overflow-hidden transition-all hover:border-slate-700"
                    >
                      <div 
                        onClick={() => setExpandedRunId(expandedRunId === run._id ? null : run._id)}
                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-800/20 transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            isPassed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                            isFailed ? 'bg-red-500/5 border-red-500/20 text-red-400' :
                            'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                          }`}>
                            {isPassed ? <CheckCircle2 size={24} /> : isFailed ? <XCircle size={24} /> : <Loader2 size={24} className="animate-spin" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 tracking-tight">
                              Execution #{run._id.substring(run._id.length - 6).toUpperCase()}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                              <span>{new Date(run.createdAt).toLocaleString()}</span>
                              <span>•</span>
                              <span>{run.results?.length || 0} Steps</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden sm:block">
                              <p className={`text-xs font-black uppercase tracking-widest ${isPassed ? 'text-emerald-400' : isFailed ? 'text-red-400' : 'text-cyan-400'}`}>
                                {status}
                              </p>
                              <p className="text-[10px] text-slate-600 font-mono mt-0.5">{run.duration || '0'}ms</p>
                           </div>
                           <ChevronDown className={`text-slate-600 transition-transform duration-300 ${expandedRunId === run._id ? 'rotate-180 text-cyan-400' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedRunId === run._id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-slate-800/50 bg-slate-950/20"
                          >
                            <div className="p-6 space-y-3">
                              {run.results?.map((res, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                                  <div className="flex items-center gap-3">
                                    {res.status === 'pass' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                                    <span className="text-sm font-medium text-slate-300">{res.testTitle}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-600">{res.duration}ms</span>
                                </div>
                              ))}
                              <button 
                                onClick={() => navigate(`/runs/${run._id}`)}
                                className="w-full py-3 mt-2 rounded-xl border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                              >
                                View Full Trace Report
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-800/50">
                  <p className="text-slate-500 font-medium">No execution logs found.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


// import { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ArrowLeft, 
//   Play, 
//   Code2, 
//   Terminal, 
//   Clock, 
//   CheckCircle2, 
//   XCircle,
//   Loader2,
//   FileCode,
//   ChevronDown
// } from "lucide-react";
// import { getProjectById, runProjectSuite, getProjectRuns } from "../api/project.api";

// // Simple Syntax Highlighter (Visual only)
// const CodeBlock = ({ code }) => (
//   <pre className="bg-[#0d1117] text-slate-300 p-4 rounded-xl overflow-x-auto text-sm font-mono border border-slate-800 leading-relaxed">
//     {code}
//   </pre>
// );

// export default function ProjectDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Execution States
//   const [activeTab, setActiveTab] = useState("tests"); // tests | runs
//   const [running, setRunning] = useState(false);
//   const [runs, setRuns] = useState([]); 
//   const [runsLoading, setRunsLoading] = useState(false);
//   const [expandedRunId, setExpandedRunId] = useState(null); // Track expanded row

//   // 1. Fetch Project Data
//   const fetchProject = useCallback(async () => {
//     try {
//       const res = await getProjectById(id);
//       setProject(res.data);
//     } catch (err) {
//       console.error("Failed to load project", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // 2. Fetch Run History
//   const fetchHistory = useCallback(async () => {
//     try {
//       setRunsLoading(true);
//       const res = await getProjectRuns(id);
//       setRuns(res.data.data || []); 
//     } catch (err) {
//       console.error("Failed to load history", err);
//     } finally {
//       setRunsLoading(false);
//     }
//   }, [id]);

//   // Initial Load
//   useEffect(() => {
//     fetchProject();
//   }, [fetchProject]);

//   // Load History when tab changes
//   useEffect(() => {
//     if (activeTab === "runs") {
//       fetchHistory();
//       // Optional: Poll for updates every 5 seconds if a run is pending
//       const interval = setInterval(() => {
//          // only poll if we see a running status
//          fetchHistory();
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [activeTab, fetchHistory]);

//   // 3. Handle "Run Suite" Click
//   const handleRunSuite = async () => {
//     try {
//       setRunning(true);
//       await runProjectSuite(id);
//       setActiveTab("runs");
//       await fetchHistory();
//     } catch (err) {
//       console.error("Run failed", err);
//       alert("Failed to start suite: " + (err.response?.data?.error || err.message));
//     } finally {
//       setRunning(false);
//     }
//   };

//   const toggleRun = (runId) => {
//     setExpandedRunId(expandedRunId === runId ? null : runId);
//   };

//   if (loading) return <div className="p-10 text-center text-slate-500">Loading project...</div>;
//   if (!project) return <div className="p-10 text-center text-red-400">Project not found</div>;

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="space-y-2">
//           <button 
//             onClick={() => navigate("/")}
//             className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
//           >
//             <ArrowLeft size={16} /> Back to Dashboard
//           </button>
          
//           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//             <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
//               <FileCode size={24} />
//             </span>
//             {project.name}
//           </h1>
//           <p className="text-slate-400 text-sm ml-1">
//             Target URL: <a href={project.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{project.url}</a>
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">
//             <Code2 size={18} />
//             Edit Config
//           </button>
          
//           <button 
//             onClick={handleRunSuite}
//             disabled={running}
//             className={`flex items-center gap-2 px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-transform ${
//               running 
//                 ? "bg-slate-700 cursor-not-allowed text-slate-400" 
//                 : "bg-linear-to-r from-emerald-500 to-green-500 hover:scale-105 shadow-emerald-500/20"
//             }`}
//           >
//             {running ? (
//                <><Loader2 size={18} className="animate-spin" /> Starting...</> 
//             ) : (
//                <><Play size={18} fill="currentColor" /> Run Suite</>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* --- TABS --- */}
//       <div className="border-b border-slate-800 flex gap-8">
//         <button 
//           onClick={() => setActiveTab("tests")}
//           className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "tests" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
//         >
//           Generated Tests
//           {activeTab === "tests" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />}
//         </button>
//         <button 
//           onClick={() => setActiveTab("runs")}
//           className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "runs" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
//         >
//           Execution History
//           {activeTab === "runs" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />}
//         </button>
//       </div>

//       {/* --- CONTENT AREA --- */}
//       <motion.div 
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         {activeTab === "tests" ? (
//           <div className="space-y-6">
//             {project.tests && project.tests.length > 0 ? (
//               project.tests.map((test, i) => (
//                 <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
//                   <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
//                         <Terminal size={16} />
//                       </div>
//                       <span className="font-mono text-sm text-slate-200">{test.title || `Test Case ${i+1}`}</span>
//                     </div>
//                   </div>
//                   <div className="p-0">
//                     <CodeBlock code={test.code} />
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
//                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
//                     <Code2 size={32} />
//                 </div>
//                 <h3 className="text-lg font-medium text-slate-200">No Tests Found</h3>
//                 <p className="text-slate-500 mt-2">Generate tests first to see them here.</p>
//               </div>
//             )}
//           </div>
//         ) : (
          
//           /* --- ✅ HISTORY TAB --- */
//           <div className="space-y-4">
//             {runsLoading && runs.length === 0 ? (
//                <div className="text-center py-10 text-slate-500">Loading history...</div>
//             ) : runs.length > 0 ? (
//                runs.map((run) => {
//                  const status = run.status.toLowerCase(); // ✅ FIX: Case-insensitive check
//                  const isCompleted = status === 'completed' || status === 'passed';
//                  const isFailed = status === 'failed';
                 
//                  return (
//                   <div key={run._id} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-all duration-200">
                    
//                     {/* Clickable Header */}
//                     <div 
//                       onClick={() => toggleRun(run._id)}
//                       className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition"
//                     >
//                       <div className="flex items-center gap-4">
//                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                             isCompleted ? 'bg-green-500/10 text-green-500' :
//                             isFailed ? 'bg-red-500/10 text-red-500' :
//                             'bg-blue-500/10 text-blue-500'
//                          }`}>
//                            {isCompleted ? <CheckCircle2 size={20} /> : 
//                             isFailed ? <XCircle size={20} /> : 
//                             <Loader2 size={20} className="animate-spin" />}
//                          </div>
//                          <div>
//                            <h4 className="font-medium text-slate-200 capitalize">
//                               {isCompleted ? 'Suite Execution Passed' : `Suite ${status}`}
//                            </h4>
//                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
//                               <span className="font-mono text-slate-600">ID: {run._id.substring(0, 8)}</span>
//                               <span>•</span>
//                               <span>{new Date(run.createdAt).toLocaleString()}</span>
//                            </div>
//                          </div>
//                       </div>
                      
//                       <div className="text-right flex items-center gap-4">
//                          <div>
//                            <span className={`text-sm font-bold ${
//                               isCompleted ? 'text-green-400' : 
//                               isFailed ? 'text-red-400' : 
//                               'text-blue-400'
//                            }`}>
//                               {status.toUpperCase()}
//                            </span>
//                            <p className="text-xs text-slate-500 mt-1">
//                               {run.results ? `${run.results.length} Tests` : 'Processing...'}
//                            </p>
//                          </div>
//                          <motion.div 
//                            animate={{ rotate: expandedRunId === run._id ? 180 : 0 }}
//                            className="text-slate-500"
//                          >
//                            <ChevronDown size={20} />
//                          </motion.div>
//                       </div>
//                     </div>

//                     {/* Expandable Details */}
//                     <AnimatePresence>
//                       {expandedRunId === run._id && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           className="border-t border-slate-800 bg-slate-950/30"
//                         >
//                           <div className="p-4 space-y-2">
//                              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detailed Results</h5>
//                              {run.results && run.results.length > 0 ? (
//                                run.results.map((result, idx) => (
//                                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800/50">
//                                    <div className={`mt-0.5 ${result.status === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
//                                      {result.status === 'pass' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
//                                    </div>
//                                    <div className="flex-1 min-w-0">
//                                      <div className="flex justify-between items-center">
//                                         <p className="text-sm font-medium text-slate-300">{result.testTitle}</p>
//                                         <span className="text-xs text-slate-600 font-mono">{result.duration}ms</span>
//                                      </div>
//                                      {result.status === 'fail' && result.error && (
//                                        <div className="mt-2 p-3 rounded bg-red-950/20 border border-red-900/30 text-red-300 text-xs font-mono overflow-x-auto">
//                                          {result.error}
//                                        </div>
//                                      )}
//                                    </div>
//                                  </div>
//                                ))
//                              ) : (
//                                <div className="text-sm text-slate-500 italic">No detailed results available.</div>
//                              )}
                             
//                              {/* Show Raw Output if needed */}
//                              {isFailed && run.rawOutput && (
//                                <div className="mt-4">
//                                  <p className="text-xs font-semibold text-slate-500 mb-2">System Logs:</p>
//                                  <pre className="text-xs bg-black/50 p-3 rounded text-slate-400 overflow-x-auto border border-slate-800">
//                                    {run.rawOutput.slice(0, 500)}...
//                                  </pre>
//                                </div>
//                              )}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                  );
//                })
//             ) : (
//               <div className="text-center py-20 text-slate-500">
//                 <Clock size={48} className="mx-auto mb-4 opacity-20" />
//                 <p>No execution history yet. Click "Run Suite" to start.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </motion.div>

//     </div>
//   );
// }