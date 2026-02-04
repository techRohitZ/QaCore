import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

/**
 * INTERACTIVE CARD
 * - 3D Tilt Effect
 * - Mouse-following Spotlight Background
 * - Mouse-following Spotlight Border
 */
export default function InteractiveCard({ children, className = "" }) {
  const ref = useRef(null);

  // Mouse Position Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics for the 3D Tilt
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  // Create the "Spotlight" gradient strings dynamically
  const maskImage = useMotionTemplate`radial-gradient(240px at ${x}px ${y}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Set raw mouse position for the spotlight
    x.set(clientX - left);
    y.set(clientY - top);

    // Calculate rotation values (center is 0,0)
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;

    // Apply rotation (inverted for natural feel)
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    x.set(0); // Optional: Reset spotlight center or keep it
    y.set(0); 
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      style={{
        rotateX: useSpring(useMotionTemplate`${mouseY} * -12deg`, { stiffness: 200, damping: 20 }), // Tilt vertical
        rotateY: useSpring(useMotionTemplate`${mouseX} * 12deg`, { stiffness: 200, damping: 20 }),  // Tilt horizontal
        transformStyle: "preserve-3d",
      }}
      className={`group relative h-full rounded-3xl border border-slate-800 bg-slate-900/40 transition-colors hover:bg-slate-900/60 ${className}`}
    >
      {/* 1. SPOTLIGHT BORDER OVERLAY */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${x}px ${y}px,
              rgba(6,182,212,0.4),
              transparent 40%
            )
          `,
        }}
      />
      
      {/* 2. INNER CONTENT WRAPPER (Hides the border spillover) */}
      <div className="relative h-full overflow-hidden rounded-3xl p-8">
        
        {/* Spotlight Background Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${x}px ${y}px,
                rgba(6,182,212,0.1),
                transparent 40%
              )
            `,
          }}
        />

        {/* 3. ACTUAL CONTENT (Lifted in 3D Space) */}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </div>

    </motion.div>
  );
}