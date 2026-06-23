import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../api/auth";
import AuthTitle from "../components/auth/AuthTitle";
import AuthField from "../components/auth/AuthField";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import AuthDivider from "../components/auth/AuthDivider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const login = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate({ email, senha });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthTitle titulo="Entrar" subtitulo="Acesse sua conta" />
      <AuthField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
        delay={0.5}
      />
      <AuthField
        id="senha"
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="••••••"
        required
        delay={0.6}
      />
      <AuthSubmitButton
        label="Entrar"
        loadingLabel="Entrando"
        isLoading={login.isPending}
        totalFields={2}
        delay={0.5}
      />
      <AuthDivider>
        Não tem conta?{" "}
        <Link to="/registrar" className="font-medium" style={{ color: "#00d4ff" }}>
          Registre-se
        </Link>
      </AuthDivider>
    </form>
  );
}
