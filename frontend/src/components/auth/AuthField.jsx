import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  delay = 0,
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-1"
    >
      <div className="relative group">
        <label
          htmlFor={id}
          className="absolute left-4 transition-all duration-300 pointer-events-none"
          style={{
            top: active ? "8px" : "50%",
            transform: active ? "translateY(0)" : "translateY(-50%)",
            fontSize: active ? "10px" : "14px",
            color: focused ? "#00d4ff" : "#475569",
            fontWeight: active ? "600" : "400",
            fontFamily: "'Source Sans 3', sans-serif",
            letterSpacing: active ? "0.08em" : "0",
            textShadow: focused ? "0 0 10px #00d4ff50" : "none",
            zIndex: 2,
          }}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={active ? placeholder : " "}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl text-sm outline-none transition-all duration-300"
          style={{
            padding: active ? "26px 16px 10px" : "20px 16px",
            background: focused ? "#0c1020" : "#0a0d16",
            border: `1px solid ${focused ? "#00d4ff40" : "#1a1f2e"}`,
            color: "#e2e8f0",
            fontFamily: "'Source Sans 3', sans-serif",
            boxShadow: focused
              ? "0 0 20px #00d4ff10, inset 0 1px 3px #00000040"
              : "inset 0 1px 3px #00000030",
          }}
        />
      </div>
    </motion.div>
  );
}