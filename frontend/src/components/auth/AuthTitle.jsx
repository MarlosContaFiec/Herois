import { motion } from "framer-motion";
import { IconMissoes } from "../../utils/icones";

export default function AuthTitle({ titulo, subtitulo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="text-center mb-8"
    >
      <motion.div
        className="auth-icon-ring mx-auto mb-5 w-20 h-20 rounded-2xl flex items-center justify-center relative"
        animate={{
          boxShadow: [
            "0 0 25px #00d4ff20, 0 0 50px #00d4ff10",
            "0 0 35px #00d4ff30, 0 0 70px #00d4ff15",
            "0 0 25px #00d4ff20, 0 0 50px #00d4ff10",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(135deg, #00d4ff0d, #a855f70d)",
          border: "1px solid #00d4ff20",
        }}
      >
        <IconMissoes size={36} style={{ color: "#00d4ff" }} />
      </motion.div>
      <h1
        className="text-3xl tracking-widest uppercase"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          color: "#e2e8f0",
          textShadow: "0 0 30px #00d4ff25, 0 2px 4px #00000080",
        }}
      >
        {titulo}
      </h1>
      <p
        className="text-sm mt-2 tracking-wide"
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          color: "#64748b",
        }}
      >
        {subtitulo}
      </p>
    </motion.div>
  );
}
