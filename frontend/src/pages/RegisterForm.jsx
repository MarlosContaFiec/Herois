import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegistrar } from "../api/auth";
import AuthTitle from "../components/auth/AuthTitle";
import AuthField from "../components/auth/AuthField";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import AuthDivider from "../components/auth/AuthDivider";

export default function RegisterForm() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const registrar = useRegistrar();

  const handleSubmit = (e) => {
    e.preventDefault();
    registrar.mutate({ nomeUsuario, email, senha });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthTitle titulo="Criar Conta" subtitulo="Comece sua jornada" />
      <AuthField
        id="nomeUsuario"
        label="Nome de Usuário"
        type="text"
        value={nomeUsuario}
        onChange={(e) => setNomeUsuario(e.target.value)}
        placeholder="heroi123"
        required
        delay={0.5}
      />
      <AuthField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
        delay={0.6}
      />
      <AuthField
        id="senha"
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="••••••"
        required
        delay={0.7}
      />
      <AuthSubmitButton
        label="Criar Conta"
        loadingLabel="Criando"
        isLoading={registrar.isPending}
        totalFields={3}
        delay={0.5}
      />
      <AuthDivider>
        Já tem conta?{" "}
        <Link to="/login" className="font-medium" style={{ color: "#00d4ff" }}>
          Entrar
        </Link>
      </AuthDivider>
    </form>
  );
}