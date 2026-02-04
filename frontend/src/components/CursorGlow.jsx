import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const glow = document.createElement("div");
    glow.className =
      "pointer-events-none fixed z-[9999] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl";
    document.body.appendChild(glow);

    const move = (e) => {
      glow.style.transform = `translate(${e.clientX - 80}px, ${e.clientY - 80}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(glow);
    };
  }, []);

  return null;
}
