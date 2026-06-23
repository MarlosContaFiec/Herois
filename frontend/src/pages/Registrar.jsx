import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRegistrar } from "../api/auth";
import {
  inputBase,
  btnPrimary,
  cardBase,
  labelBase,
  textSecondary,
} from "../styles/components";
import { IconMissoes } from "../utils/icones";

export default function Registrar() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const registrar = useRegistrar();
  const handleSubmit = (e) => {
    e.preventDefault();
    registrar.mutate({ nomeUsuario, email, senha });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`${cardBase} w-full max-w-md p-8`}
      >
        <div className="text-center mb-8">
          <IconMissoes size={40} className="text-cyan-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-100">Criar Conta</h1>
          <p className={`${textSecondary} text-sm mt-1`}>Comece sua jornada</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomeUsuario" className={labelBase}>Nome de Usuário</label>
            <input
              id="nomeUsuario"
              type="text"
              className={inputBase}
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              placeholder="heroi123"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={labelBase}>Email</label>
            <input
              id="email"
              type="email"
              className={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="senha" className={labelBase}>Senha</label>
            <input
              id="senha"
              type="password"
              className={inputBase}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={registrar.isPending}
            className={`${btnPrimary} w-full`}
          >
            {registrar.isPending ? "Criando..." : "Criar Conta"}
          </button>
        </form>
        <p className={`${textSecondary} text-center text-sm mt-6`}>
          Já tem conta?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
