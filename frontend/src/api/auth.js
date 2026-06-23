import { useMutation } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (dados) => {
      const { data } = await api.post("/auth/login", dados);
      return data;
    },
    onSuccess: (data) => {
      login(data.token, data.usuario);
      toast.sucesso("Login realizado com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      toast.erro(error.response?.data?.erro || "Erro ao fazer login");
    },
  });
}

export function useRegistrar() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (dados) => {
      const { data } = await api.post("/auth/registrar", dados);
      return data;
    },
    onSuccess: (data) => {
      login(data.token, data.usuario);
      toast.sucesso("Conta criada com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      toast.erro(error.response?.data?.erro || "Erro ao registrar");
    },
  });
}