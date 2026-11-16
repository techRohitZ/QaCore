import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="border-t border-slate-800 px-6 py-8 text-sm text-slate-400"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5"><p>© {new Date().getFullYear()} QaCore · AI-assisted test workflows</p><nav aria-label="Footer" className="flex gap-6"><Link to="/projects">Projects</Link><Link to="/about">About</Link><a href="https://github.com/techRohitZ/QaCore">GitHub</a></nav></div></footer>;
}
