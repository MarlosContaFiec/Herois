import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthBackground from "../components/auth/AuthBackground";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const slideVariants = {
  initial: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 100 : -100,
    filter: "blur(8px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -100 : 100,
    filter: "blur(8px)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AuthLayout() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isRegistrar = location.pathname === "/registrar";
  const direction = isRegistrar ? 1 : -1;

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  if (token) return null;

  return (
    <>
      <AuthBackground />
      <div className="relative min-h-screen flex items-center justify-center px-4 z-10">
        <AuthCard>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {isRegistrar ? <RegisterForm /> : <LoginForm />}
            </motion.div>
          </AnimatePresence>
        </AuthCard>
      </div>
    </>
  );
}