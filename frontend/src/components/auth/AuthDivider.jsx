import { motion } from "framer-motion";

export default function AuthDivider({ children, delay = 0.9 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center mt-6"
    >
      <div className="flex items-center gap-4 w-full mb-4">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #1e293b)" }} />
        <span style={{ color: "#00d4ff30", textShadow: "0 0 10px #00d4ff20", fontSize: "14px" }}>✦</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1e293b, transparent)" }} />
      </div>
      <div className="text-sm" style={{ color: "#64748b", fontFamily: "'Source Sans 3', sans-serif" }}>
        {children}
      </div>
    </motion.div>
  );
}