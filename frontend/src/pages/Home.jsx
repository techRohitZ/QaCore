import { Link } from "react-router-dom";
const workflow = [
  ["01", "Describe a user flow", "Choose a project and provide exact field labels, button names, and expected messages."],
  ["02", "Review generated scenarios", "Check the AI's assumptions before running. Clear assertions make results useful."],
  ["03", "Inspect execution results", "Run supported steps with Playwright and investigate failures in your project history."],
];
export default function Home() {
  return <main className="mx-auto max-w-6xl px-6 py-20 text-slate-100">
    <section className="max-w-3xl"><p className="mb-6 text-sm font-semibold uppercase tracking-widest text-cyan-400">AI-assisted quality assurance</p><h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">Clear requirements.<br /><span className="text-cyan-400">Useful test scenarios.</span></h1><p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">Build a test suite from your requirements, review its steps, and inspect Playwright execution results in one workspace.</p><Link to="/projects" className="mt-8 inline-block rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-300">Open your workspace →</Link></section>
    <section className="mt-20 grid gap-6 md:grid-cols-3" aria-label="How it works">{workflow.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7"><span className="text-sm font-mono text-cyan-400">{number}</span><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-slate-400">{description}</p></article>)}</section><p className="mt-10 max-w-3xl text-sm leading-6 text-slate-400">Generation uses your URL and instructions. It does not inspect the live DOM or automatically repair selectors. Review inferred labels before executing tests.</p>
  </main>;
}
