import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../api/dashboard.api";
import { createProject } from "../api/project.api"; // Ensure this API helper exists
import StatCard from "../components/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  RefreshCcw, 
  LayoutDashboard,
  Zap,
  Plus,
  Globe,
  FolderPlus,
  X,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", url: "" });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createProject(newProject);
      setIsModalOpen(false);
      setNewProject({ name: "", url: "" });
      fetchDashboard(); // Refresh to show stats
    } catch (err) {
      console.error("Creation failed", err);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="relative space-y-8 p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* --- ENHANCED HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="text-cyan-400" />
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of your test suites and automation performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700
            px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition-all"
          >
            <Plus size={18} className="text-cyan-400" />
            New Project
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-500
            px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            <Zap size={18} fill="currentColor" className="opacity-80" />
            Generate Tests
          </motion.button>
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      {loading ? (
        <DashboardSkeleton />
      ) : (!summary || summary.totalRuns === 0) ? (
        /* ✅ PROFESSIONAL EMPTY STATE */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-20 rounded-3xl border border-slate-800 bg-slate-900/40 border-dashed space-y-6"
        >
          <div className="p-5 bg-cyan-500/10 rounded-full text-cyan-400">
            <FolderPlus size={48} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">No Projects Active</h2>
            <p className="text-slate-400 max-w-sm">Create your first project environment to start generating AI-powered test suites.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20"
          >
            Get Started
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
              <StatCard label="Total Runs" value={summary.totalRuns} icon={Activity} color="text-blue-400" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard label="Passed" value={summary.passed} icon={CheckCircle2} color="text-emerald-400" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard label="Failed" value={summary.failed} icon={XCircle} color="text-red-400" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard label="Pass Rate" value={`${summary.passRate}%`} icon={Percent} color="text-cyan-400" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ✅ CREATE PROJECT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Create New Project</h3>
                  <p className="text-sm text-slate-400">Define your application workspace.</p>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Project Name</label>
                    <input 
                      required
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="e.g. My SaaS App"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Base URL</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        required
                        type="url"
                        value={newProject.url}
                        onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                        placeholder="https://example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-11 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={isCreating}
                    className="w-full py-4 bg-cyan-500 text-slate-900 font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                  >
                    {isCreating ? <Loader2 className="animate-spin" /> : "Initialize Project"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6 space-y-4">
           <div className="flex justify-between">
              <div className="h-4 w-24 bg-slate-800 rounded"></div>
              <div className="h-8 w-8 bg-slate-800 rounded-full"></div>
           </div>
           <div className="h-8 w-16 bg-slate-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}