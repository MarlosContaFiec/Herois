import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtualizarPerfil } from "../api/usuario";
import { useAuth } from "../context/AuthContext";
import {
  cardBase,
  btnPrimary,
  btnGhost,
  btnSm,
  inputBase,
  labelBase,
  textSecondary,
  fontSemibold,
} from "../styles/components";
import {
  IconFechar,
  IconUser,
  IconCheck,
  IconErro,
  IconLock,
} from "../utils/icones";

export default function EditarPerfilModal({ onClose }) {
  const { usuario } = useAuth();
  const atualizar = useAtualizarPerfil();
  const [aba, setAba] = useState("perfil");
  const [form, setForm] = useState({
    nomeUsuario: usuario?.nomeUsuario || "",
    email: usuario?.email || "",
  });
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});

  const validarPerfil = () => {
    const errs = {};
    if (form.nomeUsuario.length < 3) errs.nomeUsuario = "Minimo 3 caracteres";
    if (!form.email.includes("@")) errs.email = "Email invalido";
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const validarSenha = () => {
    const errs = {};
    if (senhaForm.senhaAtual.length < 6)
      errs.senhaAtual = "Minimo 6 caracteres";
    if (senhaForm.novaSenha.length < 6) errs.novaSenha = "Minimo 6 caracteres";
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha)
      errs.confirmarSenha = "Senhas nao conferem";
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSalvarPerfil = () => {
    if (!validarPerfil()) return;
    const dados = {};
    if (form.nomeUsuario !== usuario.nomeUsuario)
      dados.nomeUsuario = form.nomeUsuario;
    if (form.email !== usuario.email) dados.email = form.email;
    if (Object.keys(dados).length === 0) {
      setErros({ geral: "Nenhuma alteracao detectada" });
      return;
    }
    atualizar.mutate(dados, { onSuccess: onClose });
  };

  const handleSalvarSenha = () => {
    if (!validarSenha()) return;
    atualizar.mutate(
      { senhaAtual: senhaForm.senhaAtual, novaSenha: senhaForm.novaSenha },
      {
        onSuccess: () => {
          setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
          onClose();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`${cardBase} p-5 w-full max-w-sm`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${fontSemibold} text-lg text-slate-200`}>
              Editar Perfil
            </h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300"
            >
              <IconFechar size={20} />
            </button>
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1 gap-1 mb-5">
            <button
              onClick={() => {
                setAba("perfil");
                setErros({});
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${aba === "perfil" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
            >
              <IconUser size={14} /> Perfil
            </button>
            <button
              onClick={() => {
                setAba("senha");
                setErros({});
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${aba === "senha" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
            >
              <IconLock size={14} /> Senha
            </button>
          </div>

          {erros.geral && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-4 text-xs text-red-400 flex items-center gap-1">
              <IconErro size={12} /> {erros.geral}
            </div>
          )}

          {aba === "perfil" && (
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Nome de usuario</label>
                <input
                  className={`${inputBase} ${erros.nomeUsuario ? "border-red-500/50" : ""}`}
                  value={form.nomeUsuario}
                  onChange={(e) =>
                    setForm({ ...form, nomeUsuario: e.target.value })
                  }
                />
                {erros.nomeUsuario && (
                  <p className="text-red-400 text-xs mt-1">
                    {erros.nomeUsuario}
                  </p>
                )}
              </div>
              <div>
                <label className={labelBase}>Email</label>
                <input
                  type="email"
                  className={`${inputBase} ${erros.email ? "border-red-500/50" : ""}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {erros.email && (
                  <p className="text-red-400 text-xs mt-1">{erros.email}</p>
                )}
              </div>
              <button
                onClick={handleSalvarPerfil}
                disabled={atualizar.isPending}
                className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
              >
                <IconCheck size={16} />{" "}
                {atualizar.isPending ? "Salvando..." : "Salvar Alteracoes"}
              </button>
            </div>
          )}

          {aba === "senha" && (
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Senha atual</label>
                <input
                  type="password"
                  className={`${inputBase} ${erros.senhaAtual ? "border-red-500/50" : ""}`}
                  value={senhaForm.senhaAtual}
                  onChange={(e) =>
                    setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })
                  }
                />
                {erros.senhaAtual && (
                  <p className="text-red-400 text-xs mt-1">
                    {erros.senhaAtual}
                  </p>
                )}
              </div>
              <div>
                <label className={labelBase}>Nova senha</label>
                <input
                  type="password"
                  className={`${inputBase} ${erros.novaSenha ? "border-red-500/50" : ""}`}
                  value={senhaForm.novaSenha}
                  onChange={(e) =>
                    setSenhaForm({ ...senhaForm, novaSenha: e.target.value })
                  }
                />
                {erros.novaSenha && (
                  <p className="text-red-400 text-xs mt-1">{erros.novaSenha}</p>
                )}
              </div>
              <div>
                <label className={labelBase}>Confirmar nova senha</label>
                <input
                  type="password"
                  className={`${inputBase} ${erros.confirmarSenha ? "border-red-500/50" : ""}`}
                  value={senhaForm.confirmarSenha}
                  onChange={(e) =>
                    setSenhaForm({
                      ...senhaForm,
                      confirmarSenha: e.target.value,
                    })
                  }
                />
                {erros.confirmarSenha && (
                  <p className="text-red-400 text-xs mt-1">
                    {erros.confirmarSenha}
                  </p>
                )}
              </div>
              <button
                onClick={handleSalvarSenha}
                disabled={atualizar.isPending}
                className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
              >
                <IconLock size={16} />{" "}
                {atualizar.isPending ? "Salvando..." : "Alterar Senha"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
