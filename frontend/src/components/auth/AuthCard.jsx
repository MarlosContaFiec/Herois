import { motion } from "framer-motion";

export default function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.2 }}
      className="relative w-full max-w-md z-10"
    >
      <div className="auth-glow absolute -inset-[2px] rounded-2xl" />
      <div className="auth-border absolute -inset-[1px] rounded-2xl" />
      <div
        className="relative rounded-2xl p-8"
        style={{
          background: "linear-gradient(170deg, rgba(15,15,30,0.9) 0%, rgba(8,8,18,0.95) 100%)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      >
        {children}
      </div>
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-8 rounded-full"
        style={{
          background: "radial-gradient(ellipse, #00d4ff18, transparent)",
          filter: "blur(12px)",
        }}
      />
    </motion.div>
  );
}