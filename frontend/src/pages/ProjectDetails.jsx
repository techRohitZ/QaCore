import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, Terminal, CheckCircle2, XCircle,
  Loader2, ChevronDown, Globe, Layers, Zap, 
  AlertTriangle, FolderGit2, Calendar, Copy, LayoutGrid
} from "lucide-react";
import { getProjectById, runProjectSuite, getProjectRuns, getProjectSuites } from "../api/project.api";
import { toast } from "react-hot-toast";

const CodeBlock = ({ code, steps }) => {
  const handleCopy = () => {
    const text = code || (Array.isArray(steps) ? steps.join('\n') : steps);
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b0e14] overflow-hidden mt-3 shadow-inner">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-900/50 border-b border-slate-800">
        <span className="text-[10px] font-bold text-cyan-500 uppercase flex items-center gap-2 tracking-wider">
          <Terminal size={12} /> Playwright Logic
        </span>
        <button onClick={handleCopy} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-500 hover:text-white">
          <Copy size={12} />
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        {code || (Array.isArray(steps) ? steps.join('\n') : steps)}
      </pre>
    </div>
  );
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data State
  const [project, setProject] = useState(null);
  const [suites, setSuites] = useState([]); 
  const [runs, setRuns] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tests"); 
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState(null);

  const pollInterval = useRef(null);

  // --- 🛡️ RESILIENT DATA FETCHING ---
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Project (Critical - Must Succeed)
      const projRes = await getProjectById(id);
      setProject(projRes.data);

      // 2. Fetch Runs (Critical - Must Succeed)
      const runsRes = await getProjectRuns(id);
      setRuns(Array.isArray(runsRes.data) ? runsRes.data : (runsRes.data?.data || []));

      // 3. Fetch Suites (Optional - Can Fail without crashing)
      try {
        const suitesRes = await getProjectSuites(id);
        setSuites(Array.isArray(suitesRes.data) ? suitesRes.data : []);
      } catch (suiteErr) {
        console.warn("⚠️ Suite API missing or empty. Falling back to Project List.");
        setSuites([]); // Fallback to empty, so we use project.tests instead
      }

      // Check for active runs to keep polling
      const history = Array.isArray(runsRes.data) ? runsRes.data : [];
      return history.some(r => r.status === 'pending' || r.status === 'running');

    } catch (err) {
      console.error("🔥 Critical Sync Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startPolling = () => {
    if (pollInterval.current) return;
    pollInterval.current = setInterval(async () => {
      const shouldContinue = await fetchData();
      if (!shouldContinue) stopPolling();
    }, 3000);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  const handleRunSuite = async () => {
    setIsRunningSuite(true);
    setActiveTab("runs");
    try {
      const tempRun = { _id: "temp-" + Date.now(), status: "pending", createdAt: new Date().toISOString(), results: [] };
      setRuns([tempRun, ...runs]);
      await runProjectSuite(id);
      toast.success("Suite execution initialized");
      startPolling();
    } catch (err) {
      toast.error("Failed to start execution");
    } finally {
      setIsRunningSuite(false);
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Loading Project Environment...</p>
    </div>
  );

  // --- RENDER LOGIC: CHOOSE VIEW ---
  // If we have Suites, show Suite View. If not, show Grid View (project.tests)
  const showSuiteView = suites.length > 0;
  const testsToDisplay = showSuiteView ? [] : (project?.tests || []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="space-y-4">
          <button onClick={() => navigate("/projects")} className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 uppercase transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
          </button>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">{project.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs font-mono">
                <Globe size={12} /> {project.url}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate(`/generate-tests?projectId=${id}`)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white hover:border-slate-700 transition-all text-xs uppercase tracking-wider">
            <Zap size={16} className="text-yellow-500" /> New Instruction
          </button>
          <button 
            onClick={handleRunSuite} 
            disabled={isRunningSuite} 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 text-xs uppercase tracking-wider"
          >
            {isRunningSuite ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
            {isRunningSuite ? "Initializing..." : "Run Suite"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-8 border-b border-slate-800 mb-8">
        {["tests", "runs"].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            className={`pb-4 text-xs font-black uppercase tracking-widest relative ${activeTab === t ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"}`}
          >
            {t === "tests" ? "Test Suites" : "Execution History"}
            {activeTab === t && <motion.div layoutId="line" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
          
          {/* --- GENERATED SUITES / GRID TAB --- */}
          {activeTab === "tests" && (
            <div className="space-y-8">
              {showSuiteView ? (
                /* --- MODE A: SUITE VIEW (Folders) --- */
                suites.map((suite) => (
                  <div key={suite._id} className="rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden">
                    <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white flex items-center gap-3">
                          <FolderGit2 className="text-cyan-500" size={20} />
                          <span className="capitalize">{suite.prompt || "General Scan"}</span>
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(suite.createdAt).toLocaleString()}</span>
                          <span className="text-cyan-400 font-bold">{suite.testCases?.length || 0} Tests</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {suite.testCases?.map((test, i) => (
                        <TestCaseCard key={i} test={test} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                /* --- MODE B: GRID VIEW (Fallback) --- */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {testsToDisplay.length > 0 ? (
                      testsToDisplay.map((test, i) => (
                        <div key={i} className="group p-px rounded-2xl bg-slate-800 hover:bg-cyan-500/30 transition-colors">
                           <div className="bg-slate-950 rounded-[15px] p-5 h-full relative">
                              <div className="absolute top-4 right-4 text-slate-700 group-hover:text-cyan-500 transition-colors">
                                <LayoutGrid size={16} />
                              </div>
                              <TestCaseCard test={test} />
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                        <Layers size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-slate-500 font-medium">No tests generated yet.</p>
                      </div>
                   )}
                </div>
              )}
            </div>
          )}

          {/* --- EXECUTION HISTORY TAB (Unchanged) --- */}
          {activeTab === "runs" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {runs.map((run) => (
                <RunCard key={run._id} run={run} expandedRunId={expandedRunId} setExpandedRunId={setExpandedRunId} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANLINESS ---

function TestCaseCard({ test }) {
  return (
    <div className="bg-slate-950 rounded-xl p-5 h-full border border-slate-800/50">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500/80" /> {test.title}
        </h4>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-1 rounded font-mono uppercase">
          {test.priority || 'MED'}
        </span>
      </div>
      <details className="group/code">
        <summary className="text-[10px] font-bold text-cyan-500 cursor-pointer uppercase tracking-widest hover:text-cyan-300 transition-colors select-none flex items-center gap-1 list-none">
          <span className="flex items-center gap-1">View Logic <ChevronDown size={12} className="group-open/code:rotate-180 transition-transform"/></span>
        </summary>
        <div className="mt-3">
          <CodeBlock code={test.code} steps={test.steps} />
        </div>
      </details>
    </div>
  );
}

function RunCard({ run, expandedRunId, setExpandedRunId }) {
  const status = (run.status || 'unknown').toLowerCase();
  const isPending = status === 'pending' || status === 'running';
  const isFailed = status === 'failed';

  // --- NEW: Calculate Stats ---
  const results = run.results || [];
  const total = results.length;
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;

  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
      <div 
        onClick={() => setExpandedRunId(expandedRunId === run._id ? null : run._id)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${
            isPending ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-500" :
            isFailed ? "border-red-500/20 bg-red-500/10 text-red-500" :
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
          }`}>
            {isPending ? <Loader2 size={18} className="animate-spin" /> : 
             isFailed ? <AlertTriangle size={18} /> : 
             <CheckCircle2 size={18} />}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">
                Run #{run._id.slice(-6).toUpperCase()}
              </span>
              
              {/* Status Badge */}
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                isPending ? "bg-yellow-500/10 text-yellow-500" :
                isFailed ? "bg-red-500/10 text-red-400" :
                "bg-emerald-500/10 text-emerald-400"
              }`}>
                {status}
              </span>
            </div>
            
            {/* --- NEW: Result Summary --- */}
            <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(run.createdAt).toLocaleString()}</span>
              {!isPending && total > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className={failed > 0 ? "text-red-400 font-bold" : "text-emerald-500 font-bold"}>
                    {passed}/{total} Tests Passed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <ChevronDown size={18} className={`text-slate-600 transition-transform ${expandedRunId === run._id ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {expandedRunId === run._id && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-800 bg-black/20">
            <div className="p-4 space-y-2">
              {isPending ? (
                 <div className="py-4 text-center text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-cyan-500" />
                    <span className="text-xs uppercase tracking-widest">Running Tests...</span>
                 </div>
              ) : (results.length > 0) ? (
                results.map((res, idx) => (
                  <div key={idx} className="flex justify-between p-3 rounded bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-3">
                      {res.status === 'pass' 
                        ? <CheckCircle2 size={14} className="text-emerald-500" /> 
                        : <XCircle size={14} className="text-red-500" />}
                      <span className="text-xs text-slate-300 font-medium">{res.testTitle}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">{res.duration}ms</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded bg-slate-900 border border-slate-800 text-center text-xs text-slate-500 italic">
                  No detailed logs available.
                </div>
              )}
            </div>
          </motion.div>
        )}
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