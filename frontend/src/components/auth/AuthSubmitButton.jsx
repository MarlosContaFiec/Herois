import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AuthSubmitButton({
  label,
  loadingLabel,
  isLoading,
  totalFields = 3,
  delay = 0,
}) {
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + totalFields * 0.1, duration: 0.5 }}
      className="pt-2"
    >
      <motion.button
        ref={btnRef}
        type="submit"
        disabled={isLoading}
        onClick={handleClick}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full rounded-xl font-semibold text-sm overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          padding: "16px",
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.03em",
          background: "linear-gradient(135deg, #00d4ff, #0891b2, #00d4ff)",
          backgroundSize: "200% 200%",
          color: "#06060f",
          boxShadow: "0 4px 20px #00d4ff30, 0 0 40px #00d4ff10",
          transition: "box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.boxShadow =
              "0 6px 30px #00d4ff50, 0 0 60px #00d4ff20";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 4px 20px #00d4ff30, 0 0 40px #00d4ff10";
        }}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: r.x - 60,
              top: r.y - 60,
              width: 120,
              height: 120,
              background: "rgba(255,255,255,0.25)",
              transform: "scale(0)",
              animation: "btnRipple 0.8s ease-out forwards",
            }}
          />
        ))}
        <span className="relative z-10">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              {loadingLabel}
              <span className="flex gap-1">
                {[0, 0.2, 0.4].map((d) => (
                  <motion.span
                    key={d}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "#06060f" }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d }}
                  />
                ))}
              </span>
            </span>
          ) : (
            label
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}