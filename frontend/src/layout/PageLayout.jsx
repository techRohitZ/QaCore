import Navbar from "./Navbar";
import Footer from "./Footer";
import CursorGlow from "../components/CursorGlow";
export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-200">

      {/* ===== Ambient Background (CodeHelp-style) ===== */}
      <div className="pointer-events-none absolute inset-0">

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0
          bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),
              linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]
          bg-size-[4rem_4rem]
          opacity-10"
        />

        {/* Top spotlight (primary) */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2
          h-130 w-130 rounded-full
          bg-cyan-500/10 blur-3xl"
        />

        {/* Bottom accent glow */}
        <div
          className="absolute bottom-[-20%] right-[-10%]
          h-105 w-105 rounded-full
          bg-sky-400/10 blur-3xl"
        />
      </div>

      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Main Content ===== */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>

      {/* ===== Footer ===== */}
      <Footer />
      <CursorGlow />
    </div>
  );
}
