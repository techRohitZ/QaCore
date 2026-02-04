import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../api/project.api";
import { 
  FolderGit2, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Globe, 
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch User Projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
      setError("Failed to sync projects from the AI engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Handle Deletion
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevents navigating to details when clicking delete
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <FolderGit2 className="text-cyan-400" size={36} />
              My Projects
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your application workspaces and automated test suites.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-500 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-xl shadow-cyan-500/20"
          >
            <Plus size={20} />
            Generate New Suite
          </motion.button>
        </div>

        {/* --- CONTENT SECTION --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
            <p className="text-slate-500 animate-pulse font-mono">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Zero-State UI for New Users */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-20 text-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/20 space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
              <FolderGit2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No Active Projects</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                You haven't created any test environments yet. Launch your first one using the AI Generator.
              </p>
            </div>
            <button 
              onClick={() => navigate("/generate")}
              className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
            >
              Start Generating &rarr;
            </button>
          </motion.div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="group cursor-pointer relative bg-slate-900/40 border border-slate-800 rounded-3xl p-7 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all shadow-lg"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="h-14 w-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-900 transition-all duration-300">
                        <Globe size={28} />
                      </div>
                      <button 
                        onClick={(e) => handleDelete(project._id, e)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-slate-500">
                        <span className="text-xs font-mono truncate bg-slate-950 px-2 py-1 rounded">
                          {project.url}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar size={14} />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400 text-sm font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                        Open <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}