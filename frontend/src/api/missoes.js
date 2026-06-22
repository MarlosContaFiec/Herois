import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useMissoes(elemento) {
  return useQuery({
    queryKey: ["missoes", elemento],
    queryFn: () =>
      api
        .get("/missoes", { params: elemento ? { elemento } : {} })
        .then((r) => r.data),
  });
}

export function useTentativaPendente() {
  return useQuery({
    queryKey: ["batalha-pendente"],
    queryFn: () => api.get("/missoes/pendente").then((r) => r.data),
    retry: false,
  });
}

export function useIniciarMissao() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ missaoId, cartasUsuarioIds }) =>
      api
        .post(`/missoes/${missaoId}/iniciar`, { cartasUsuarioIds })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batalha-pendente"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useResolverBatalha() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (tentativaId) =>
      api
        .post(`/missoes/tentativa/${tentativaId}/resolver`)
        .then((r) => r.data),
    onSuccess: (data) => {
      if (data.status === "CONCLUIDO") {
        queryClient.invalidateQueries({ queryKey: ["batalha-pendente"] });
        queryClient.invalidateQueries({ queryKey: ["usuario"] });
        queryClient.invalidateQueries({ queryKey: ["colecao"] });
        queryClient.invalidateQueries({ queryKey: ["ranking"] });
      }
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
