import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUsuario(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setToken(null);
          setUsuario(null);
        })
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, [token]);

const login = (tokenRecebido, usuarioRecebido) => {
    localStorage.setItem("token", tokenRecebido);
    localStorage.setItem("usuario", JSON.stringify(usuarioRecebido));
    setToken(tokenRecebido);
    setUsuario(usuarioRecebido);
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, carregando, login, logout, setUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
