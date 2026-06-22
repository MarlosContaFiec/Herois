import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function usePacotes() {
  return useQuery({
    queryKey: ["pacotes"],
    queryFn: () => api.get("/pacotes").then((r) => r.data),
  });
}

export function useComprarPacote() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (pacoteId) =>
      api.post(`/pacotes/${pacoteId}/comprar`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
      queryClient.invalidateQueries({ queryKey: ["pity"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function usePity(pacoteId) {
  return useQuery({
    queryKey: ["pity", pacoteId],
    queryFn: () => api.get(`/pacotes/${pacoteId}/pity`).then((r) => r.data),
    enabled: !!pacoteId,
  });
}

export function useResgatarPity() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ pacoteId, cartaId }) =>
      api.post(`/pacotes/${pacoteId}/pity`, { cartaId }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pity"] });
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      toast.sucesso("Carta resgatada!");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
