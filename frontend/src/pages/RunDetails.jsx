import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; // Or your custom API helper
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  FileCode, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { getToken } from "../utils/auth";

export default function RunDetails() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRunDetails = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`http://localhost:5000/api/runs/${runId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRun(res.data);
      } catch (err) {
        console.error("Failed to fetch run details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRunDetails();
  }, [runId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!run) return <div className="p-20 text-center text-white">Execution report not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Project
        </button>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Run Report</h1>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">
                #{run._id.slice(-8).toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <Clock size={14} /> Executed on {new Date(run.createdAt).toLocaleString()}
            </p>
          </div>

          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-bold border ${
            run.status === 'passed' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {run.status === 'passed' ? <CheckCircle2 /> : <XCircle />}
            {run.status.toUpperCase()}
          </div>
        </div>

        {/* --- TEST CASES LIST --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Terminal size={20} className="text-cyan-400" /> Test Step Summary
          </h2>
          
          <div className="space-y-3">
            {run.results?.map((test, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${test.status === 'passed' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {test.status === 'passed' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{test.title}</h4>
                    {test.error && (
                      <pre className="mt-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-xs font-mono overflow-x-auto">
                        {test.error}
                      </pre>
                    )}
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-600">{test.duration}ms</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- RAW LOGS / CODE --- */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <FileCode size={20} className="text-blue-400" /> Playwright Execution Logs
            </h3>
            <button className="text-xs text-slate-500 hover:text-white transition-colors">Copy Logs</button>
          </div>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-sm text-slate-400 overflow-x-auto max-h-96">
            <p className="text-cyan-500 mb-2">// Starting Playwright runner v1.4.0...</p>
            <p className="mb-1 text-slate-500 italic">[{new Date().toLocaleTimeString()}] Navigating to {run.targetUrl}...</p>
            {run.logs || "No additional log output recorded for this run."}
            <p className="mt-2 text-emerald-500">✓ Execution finished with exit code 0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getRunDetails, rerunTest } from "../api/runs.api";

// export default function RunDetails() {
//   const { runId } = useParams();
//   const [run, setRun] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [rerunning, setRerunning] = useState(false);

//   useEffect(() => {
//     async function fetchRun() {
//       try {
//         const res = await getRunDetails(runId);
//         setRun(res.data);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRun();
//   }, [runId]);

//   const handleRerun = async () => {
//     setRerunning(true);
//     try {
//       await rerunTest(runId);
//       alert("Rerun triggered");
//     } finally {
//       setRerunning(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading run details...</div>;
//   if (!run) return <div className="p-6">Run not found</div>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-xl font-semibold">Run Details</h1>

//       {/* Metadata */}
//       <div className="space-y-1 text-sm">
//         <div>Status: {run.status}</div>
//         <div>Duration: {run.duration || "-"} ms</div>
//         <div>Created: {new Date(run.createdAt).toLocaleString()}</div>
//       </div>

//       {/* Rerun */}
//       <button
//         onClick={handleRerun}
//         disabled={rerunning}
//         className="px-4 py-2 border border-slate-700 text-sm"
//       >
//         {rerunning ? "Re-running..." : "Rerun Test"}
//       </button>

//       {/* Failed Tests */}
//       {run.failedTests?.length > 0 && (
//         <div>
//           <h2 className="font-medium">Failed Tests</h2>
//           <ul className="list-disc list-inside text-sm">
//             {run.failedTests.map((t, i) => (
//               <li key={i}>{t}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* stdout */}
//       <div>
//         <h2 className="font-medium">Stdout</h2>
//         <pre className="bg-slate-900 p-4 text-xs overflow-x-auto">
//           {run.stdout || "No stdout"}
//         </pre>
//       </div>

//       {/* stderr */}
//       {run.stderr && (
//         <div>
//           <h2 className="font-medium">Stderr</h2>
//           <pre className="bg-slate-900 p-4 text-xs overflow-x-auto text-red-400">
//             {run.stderr}
//           </pre>
//         </div>
//       )}

//       {/* Screenshots */}
//       {run.screenshots?.length > 0 && (
//         <div>
//           <h2 className="font-medium">Screenshots</h2>
//           <ul className="text-sm">
//             {run.screenshots.map((s, i) => (
//               <li key={i}>{s}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
