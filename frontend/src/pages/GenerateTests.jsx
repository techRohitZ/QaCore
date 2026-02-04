import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, Loader2, CheckCircle2, Globe, AlertCircle, 
  Settings2, FolderGit2, Plus, ArrowRight 
} from "lucide-react";
import { generateTests } from "../api/ai.api";
import { getProjects } from "../api/project.api"; 
import { useNavigate } from "react-router-dom";

/**
 * HELPER: Build the AI Prompt on the Frontend
 */
function buildPrompt(url) {
  return `
Analyze the given website URL and generate Playwright end-to-end test cases.

Rules:
- Use Playwright test syntax
- Focus on critical user flows
- Include navigation, interactions, and assertions
- Output MUST be valid JSON only
- No markdown, no explanations

Target URL: ${url}
`;
}

const LOADING_STATES = [
  "Initializing AI Agent...",
  "Scanning DOM structure...",
  "Identifying interactive elements...",
  "Optimizing selectors...",
  "Writing Playwright test suite...",
  "Finalizing code..."
];

export default function GenerateTests() {
  const navigate = useNavigate();

  // Form State
  const [url, setUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Advanced Options State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [depth, setDepth] = useState("basic");
  const [framework, setFramework] = useState("playwright");

  // 1. Fetch Projects on Load
  useEffect(() => {
    async function loadProjects() {
      try {
        setInitialFetchLoading(true);
        const res = await getProjects();
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
          setSelectedProjectId(res.data[0]._id); // Auto-select first project
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setError("Could not load your projects. Please refresh the page.");
      } finally {
        setInitialFetchLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Cycle through loading texts
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[i]);
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!url) return;
    if (!selectedProjectId) {
      setError("Please select a project to save the tests to.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await generateTests({
        url,
        projectId: selectedProjectId, 
        framework,
        depth,
        prompt: buildPrompt(url)
      });

      setSuccess(true);
      
      // Redirect to the project's view page after success
      setTimeout(() => {
        navigate(`/projects/${selectedProjectId}`); 
      }, 1500);

    } catch (err) {
      console.error("Generation failed:", err);
      setError(
        err?.response?.data?.message || 
        "Failed to connect to the AI engine. Please verify the URL and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING LOGIC ---

  // 1. Show global loader while fetching projects
  if (initialFetchLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
        <p className="text-slate-400 font-medium animate-pulse">Syncing your environment...</p>
      </div>
    );
  }

  // 2. Show Zero-State if no projects exist
  if (projects.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6 p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-400">
            <FolderGit2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No Projects Found</h2>
            <p className="text-slate-400 leading-relaxed">
              You need to create a project environment before the AI can generate and save test suites for you.
            </p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")} // Change this to your "Create Project" route
            className="w-full py-4 rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Your First Project
          </button>
        </motion.div>
      </div>
    );
  }

  // 3. Main Form Render (User has projects)
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
             <Wand2 size={12} />
             <span>AI Generator v2.0</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Generate Tests Instantly
          </h1>
          <p className="text-slate-400 text-lg">
            Select a project and enter your URL to build an automated suite.
          </p>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {loading && (
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent z-20 opacity-50"
            />
          )}

          <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            
            {/* 1. PROJECT SELECTION */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <FolderGit2 size={14} className="text-cyan-400" />
                Select Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                disabled={loading}
                className="w-full h-12 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-100 px-4 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} className="bg-slate-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. URL INPUT */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <Globe size={14} className="text-cyan-400" />
                Target Application URL
              </label>
              <div className="relative group">
                <input
                  type="url"
                  placeholder="https://app.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full h-14 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-100 px-5 pl-12 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all disabled:opacity-50 font-mono text-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                   <Globe size={18} />
                </div>
              </div>
            </div>

            {/* ADVANCED TOGGLE */}
            <div>
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider mb-3"
              >
                <Settings2 size={12} />
                {showAdvanced ? "Hide Configuration" : "Advanced Configuration"}
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <div className="space-y-2 p-1">
                      <label className="text-xs text-slate-400">Test Depth</label>
                      <select 
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
                      >
                        <option value="basic">Basic (Smoke)</option>
                        <option value="deep">Deep (Regression)</option>
                        <option value="e2e">Full E2E Flow</option>
                      </select>
                    </div>
                    <div className="space-y-2 p-1">
                      <label className="text-xs text-slate-400">Framework</label>
                      <select 
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
                      >
                        <option value="playwright">Playwright (TS)</option>
                        <option value="cypress">Cypress</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STATUS MESSAGES */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-sm font-medium"
                >
                  <CheckCircle2 size={18} />
                  <span>Suite generated successfully! Redirecting...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading || !url || !selectedProjectId}
              className="w-full relative group overflow-hidden rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 p-px shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative w-full h-full bg-slate-900 group-hover:bg-transparent transition-colors rounded-xl px-6 py-4 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={20} />
                    <span className="text-white font-semibold animate-pulse">{loadingText}</span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-bold text-lg group-hover:text-slate-900 transition-colors">Start Generation</span>
                    <Wand2 size={20} className="text-cyan-400 group-hover:text-slate-900 transition-colors" />
                  </>
                )}
              </div>
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Wand2, Loader2, CheckCircle2, Globe, AlertCircle, Settings2, FolderGit2 } from "lucide-react";
// import { generateTests } from "../api/ai.api";
// import { getProjects } from "../api/project.api"; 
// import { useNavigate } from "react-router-dom";

// /**
//  * HELPER: Build the AI Prompt on the Frontend
//  */
// function buildPrompt(url) {
//   return `
// Analyze the given website URL and generate Playwright end-to-end test cases.

// Rules:
// - Use Playwright test syntax
// - Focus on critical user flows
// - Include navigation, interactions, and assertions
// - Output MUST be valid JSON only
// - No markdown, no explanations

// Target URL: ${url}
// `;
// }

// const LOADING_STATES = [
//   "Initializing AI Agent...",
//   "Scanning DOM structure...",
//   "Identifying interactive elements...",
//   "Optimizing selectors...",
//   "Writing Playwright test suite...",
//   "Finalizing code..."
// ];

// export default function GenerateTests() {
//   const navigate = useNavigate();

//   // Form State
//   const [url, setUrl] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [selectedProjectId, setSelectedProjectId] = useState("");
  
//   // UI State
//   const [loading, setLoading] = useState(false);
//   const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
  
//   // Advanced Options State
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [depth, setDepth] = useState("basic");
//   const [framework, setFramework] = useState("playwright");

//   // 1. Fetch Projects on Load
//   useEffect(() => {
//     async function loadProjects() {
//       try {
//         const res = await getProjects();
//         if (res.data && res.data.length > 0) {
//           setProjects(res.data);
//           setSelectedProjectId(res.data[0]._id); // Auto-select first project
//         }
//       } catch (err) {
//         console.error("Failed to fetch projects", err);
//         setError("Please create a project first before generating tests.");
//       }
//     }
//     loadProjects();
//   }, []);

//   // Cycle through loading texts
//   useEffect(() => {
//     if (!loading) return;
//     let i = 0;
//     const interval = setInterval(() => {
//       i = (i + 1) % LOADING_STATES.length;
//       setLoadingText(LOADING_STATES[i]);
//     }, 800);
//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleGenerate = async (e) => {
//     e.preventDefault();
//     if (!url) return;
//     if (!selectedProjectId) {
//       setError("Please select a project to save the tests to.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       // ✅ UPDATED: Sending the prompt from frontend
//       await generateTests({
//         url,
//         projectId: selectedProjectId, 
//         framework,
//         depth,
//         prompt: buildPrompt(url) // <--- ADDED HERE
//       });

//       setSuccess(true);
      
//       // Redirect after success
//       setTimeout(() => {
//         navigate(`/projects/${selectedProjectId}`); 
//       }, 1500);

//     } catch (err) {
//       console.error("Generation failed:", err);
//       setError(
//         err?.response?.data?.message || 
//         "Failed to connect to the AI engine. Please verify the URL and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
      
//       {/* Background Ambience */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-2xl relative z-10"
//       >
        
//         {/* --- HEADER --- */}
//         <div className="text-center mb-10 space-y-4">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
//              <Wand2 size={12} />
//              <span>AI Generator v2.0</span>
//           </div>
//           <h1 className="text-4xl font-bold text-white tracking-tight">
//             Generate Tests Instantly
//           </h1>
//           <p className="text-slate-400 text-lg">
//             Enter your application URL and let our AI build your test suite.
//           </p>
//         </div>

//         {/* --- MAIN CARD --- */}
//         <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
//           {/* Animated "Scanning" Beam when loading */}
//           {loading && (
//             <motion.div 
//               initial={{ top: "-10%" }}
//               animate={{ top: "110%" }}
//               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//               className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-20 opacity-50"
//             />
//           )}

//           <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            
//             {/* 1. PROJECT SELECTION */}
//             <div className="space-y-3">
//               <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
//                 <FolderGit2 size={14} className="text-cyan-400" />
//                 Select Project
//               </label>
//               <select
//                 value={selectedProjectId}
//                 onChange={(e) => setSelectedProjectId(e.target.value)}
//                 required
//                 disabled={loading}
//                 className="w-full h-12 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-100 px-4 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//               >
//                 <option value="" disabled>-- Select a Project --</option>
//                 {projects.map((p) => (
//                   <option key={p._id} value={p._id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* 2. URL INPUT */}
//             <div className="space-y-3">
//               <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
//                 <Globe size={14} className="text-cyan-400" />
//                 Target Application URL
//               </label>
//               <div className="relative group">
//                 <input
//                   type="url"
//                   placeholder="https://app.example.com"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   disabled={loading}
//                   required
//                   className="w-full h-14 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-100 px-5 pl-12 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all disabled:opacity-50 font-mono text-sm"
//                 />
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
//                    <Globe size={18} />
//                 </div>
//               </div>
//             </div>

//             {/* ADVANCED TOGGLE */}
//             <div>
//               <button 
//                 type="button"
//                 onClick={() => setShowAdvanced(!showAdvanced)}
//                 className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider mb-3"
//               >
//                 <Settings2 size={12} />
//                 {showAdvanced ? "Hide Configuration" : "Advanced Configuration"}
//               </button>
              
//               <AnimatePresence>
//                 {showAdvanced && (
//                   <motion.div 
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="grid grid-cols-2 gap-4 overflow-hidden"
//                   >
//                     <div className="space-y-2 p-1">
//                       <label className="text-xs text-slate-400">Test Depth</label>
//                       <select 
//                         value={depth}
//                         onChange={(e) => setDepth(e.target.value)}
//                         className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
//                       >
//                         <option value="basic">Basic (Smoke)</option>
//                         <option value="deep">Deep (Regression)</option>
//                         <option value="e2e">Full E2E Flow</option>
//                       </select>
//                     </div>
//                     <div className="space-y-2 p-1">
//                       <label className="text-xs text-slate-400">Framework</label>
//                       <select 
//                         value={framework}
//                         onChange={(e) => setFramework(e.target.value)}
//                         className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
//                       >
//                         <option value="playwright">Playwright (TS)</option>
//                         <option value="cypress">Cypress</option>
//                       </select>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* STATUS MESSAGES */}
//             <AnimatePresence mode="wait">
//               {error && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: -10 }} 
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm"
//                 >
//                   <AlertCircle size={18} className="shrink-0 mt-0.5" />
//                   <span>{error}</span>
//                 </motion.div>
//               )}

//               {success && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: -10 }} 
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-sm font-medium"
//                 >
//                   <CheckCircle2 size={18} />
//                   <span>Suite generated successfully! Redirecting...</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ACTION BUTTON */}
//             <button
//               type="submit"
//               disabled={loading || !url || !selectedProjectId}
//               className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 p-[1px] shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <div className="relative w-full h-full bg-slate-900 group-hover:bg-transparent transition-colors rounded-xl px-6 py-4 flex items-center justify-center gap-3">
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin text-white" size={20} />
//                     <span className="text-white font-semibold animate-pulse">{loadingText}</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="text-white font-bold text-lg group-hover:text-slate-900 transition-colors">Start Generation</span>
//                     <Wand2 size={20} className="text-cyan-400 group-hover:text-slate-900 transition-colors" />
//                   </>
//                 )}
//               </div>
//             </button>

//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }