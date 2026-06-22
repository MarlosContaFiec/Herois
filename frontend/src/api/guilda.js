import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function useGuildas() {
  return useQuery({
    queryKey: ["guildas"],
    queryFn: () => api.get("/guildas").then((r) => r.data),
  });
}

export function useGuilda(id) {
  return useQuery({
    queryKey: ["guilda", id],
    queryFn: () => api.get(`/guildas/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCriarGuilda() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (dados) => api.post("/guildas", dados).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso("Guilda criada!");
      qc.invalidateQueries({ queryKey: ["guildas"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useEntrarGuilda() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api.post(`/guildas/${id}/entrar`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(
        data.status === "ENTROU" ? "Você entrou na guilda!" : "Pedido enviado!",
      );
      qc.invalidateQueries({ queryKey: ["guildas"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useSairGuilda() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: () => api.post("/guildas/sair").then((r) => r.data),
    onSuccess: () => {
      toast.sucesso("Você saiu da guilda.");
      qc.invalidateQueries({ queryKey: ["guildas"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useMinhaGuilda() {
  return useQuery({
    queryKey: ["minha-guilda"],
    queryFn: () => api.get("/guildas/minha").then((r) => r.data),
  });
}
