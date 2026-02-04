import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, Menu, X, Zap } from "lucide-react";
import { isAuthenticated } from "../utils/auth";

/**
 * Navbar – QaCore
 * - Includes "Generate Tests" button for logged-in users.
 * - Responsive Mobile Menu.
 * - Sticky blur effect.
 */

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" }, // future
  { name: "About", to: "/about" },       // future
  { name: "Contact", to: "/contact" },   // future
];

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "backdrop-blur-md bg-slate-950/80 border-b border-slate-800"
          : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ===== BRAND ===== */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center
              rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 
              group-hover:bg-cyan-500/20 transition-colors">
              <ScanSearch size={22} />
            </div>

            <div className="text-xl font-semibold tracking-tight text-slate-100">
              Qa<span className="text-cyan-400">Core</span>
            </div>
          </Link>

          {/* ===== DESKTOP NAV ===== */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `relative transition-colors duration-200 ${
                    isActive
                      ? "text-slate-100"
                      : "text-slate-400 hover:text-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left transition-transform duration-300 ease-out bg-cyan-400 
                      ${isActive ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ===== ACTIONS (DESKTOP) ===== */}
          <div className="hidden md:flex items-center gap-4">
            {!loggedIn ? (
              // LOGGED OUT STATE
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-slate-400 hover:text-slate-100 transition"
                >
                  Sign in
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-linear-to-r from-sky-500 to-cyan-500
                  px-4 py-2 text-sm font-bold text-slate-900
                  shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
                >
                  Get Started
                </motion.button>
              </>
            ) : (
              // LOGGED IN STATE
              <>
                {/* 1. Generate Tests Button (Primary) */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/generate")}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-500
                  px-4 py-2 text-sm font-semibold text-slate-900
                  shadow shadow-cyan-500/30"
                >
                  <Zap size={16} fill="currentColor" className="opacity-80" />
                  Generate Tests
                </motion.button>

                {/* 2. Dashboard Button (Secondary) */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/dashboard")} // Fixed route to /dashboard
                  className="rounded-xl border border-slate-700 px-4 py-2
                  text-sm font-medium text-slate-300
                  hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-800/50 transition-all"
                >
                  Dashboard
                </motion.button>

                {/* 3. Logout */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-slate-300 hover:text-white transition"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU PANEL ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-xl"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <ScanSearch className="text-cyan-400" size={22} />
                <span className="text-lg font-semibold text-slate-100">
                  Qa<span className="text-cyan-400">Core</span>
                </span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={24} className="text-slate-400 hover:text-white transition" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-6 px-6 py-10 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-slate-300 hover:text-cyan-400 transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="mt-auto px-6 pb-10 flex flex-col gap-4">
              {!loggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full rounded-xl bg-linear-to-r
                    from-sky-500 to-cyan-500 px-5 py-3
                    text-sm font-bold text-slate-900 shadow-lg shadow-cyan-500/20"
                  >
                    Get Started
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="text-sm font-medium text-slate-400 text-center py-2"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Generate Button */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/generate");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r
                    from-sky-500 to-cyan-500 px-5 py-3
                    text-sm font-bold text-slate-900 shadow-lg shadow-cyan-500/20"
                  >
                    <Zap size={18} fill="currentColor" />
                    Generate Tests
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/");
                    }}
                    className="w-full rounded-xl border border-slate-700
                    px-5 py-3 text-sm font-medium text-slate-200 hover:border-cyan-500 transition"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-400 text-center py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}