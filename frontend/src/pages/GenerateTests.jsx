import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FlaskConical, Loader2 } from "lucide-react";
import { generateTests } from "../api/ai.api";
import { getProjects } from "../api/project.api";

export default function GenerateTests() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [url, setUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProjects().then(({ data }) => {
      if (!active) return;
      setProjects(data);
      setProjectId(data[0]?._id || "");
      setUrl(data[0]?.url || "");
    }).catch(() => { if (active) setError("Could not load projects. Refresh to try again."); })
      .finally(() => { if (active) setLoadingProjects(false); });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (generating || !projectId) return;
    setGenerating(true);
    setError("");
    try {
      await generateTests({ projectId, url, customPrompt: instructions });
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Generation failed. Please try again.");
    } finally { setGenerating(false); }
  }

  const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60";
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-slate-100 sm:px-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">Test workspace</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn requirements into test scenarios.</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">Describe the flow, provide the labels and expected results, then review your generated suite before running it.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8" aria-busy={generating}>
          <div><label htmlFor="project" className="mb-2 block text-sm font-medium">Project</label>
            <select id="project" required disabled={loadingProjects || generating} className={inputClass} value={projectId} onChange={e => { setProjectId(e.target.value); setUrl(projects.find(p => p._id === e.target.value)?.url || ""); }}>
              <option value="">{loadingProjects ? "Loading projects…" : "Select a project"}</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          {!loadingProjects && !projects.length && <p className="text-sm text-slate-300">Create a project to get started. <Link className="text-cyan-400 underline" to="/projects">Go to projects</Link></p>}
          <div><label htmlFor="target" className="mb-2 block text-sm font-medium">Target URL</label><input id="target" type="url" required disabled={generating} className={inputClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-app.com/login" /></div>
          <div><label htmlFor="instructions" className="mb-2 block text-sm font-medium">What should we test?</label><textarea id="instructions" maxLength={5000} disabled={generating} className={`${inputClass} min-h-40 resize-y`} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder={'Example: The login form has Email and Password labels and a Sign in button. An empty submission should display “Email is required”.'} /><p className="mt-2 text-xs text-slate-400">Include exact field labels, button names, and expected messages.</p></div>
          {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
          <button disabled={generating || loadingProjects || !projectId} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{generating ? <><Loader2 size={18} className="animate-spin" /> Generating scenarios…</> : <>Generate test suite <ArrowRight size={18} /></>}</button>
          <p role="status" className="text-sm text-slate-400">{generating ? "This may take up to 90 seconds. Keep this page open." : "Your suite will be saved to the selected project."}</p>
        </form>
        <aside className="self-start rounded-2xl border border-slate-800 p-6"><FlaskConical className="mb-4 text-cyan-400" /><h2 className="font-semibold">Better inputs. Useful tests.</h2><ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-6 text-slate-400"><li>Choose one user flow.</li><li>Describe its controls and expected outcome.</li><li>Review the generated steps and assertions.</li><li>Run the suite and inspect failures.</li></ol><p className="mt-6 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-400">Generation uses your instructions and URL. It does not inspect the live page. Inferred selectors need review; unsupported steps fail explicitly.</p></aside>
      </div>
    </main>
  );
}
