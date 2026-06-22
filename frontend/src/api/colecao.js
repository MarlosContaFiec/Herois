import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useColecao() {
  return useQuery({
    queryKey: ["colecao"],
    queryFn: () => api.get("/colecao").then((r) => r.data),
  });
}

export function useAdicionarColecao() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ cartaId, pacoteId }) =>
      api.post(`/colecao/${cartaId}`, { pacoteId }).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      toast.sucesso(`Carta importada! Custo: ${data.custoPago} moedas`);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useRemoverColecao() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartaId) =>
      api.delete(`/colecao/${cartaId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
      toast.sucesso("Carta removida da coleção");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useFavoritar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartaId) =>
      api.patch(`/colecao/${cartaId}/favoritar`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
    },
  });
}

export function useDetalhesCarta(cartaId) {
  return useQuery({
    queryKey: ["detalhes-carta", cartaId],
    queryFn: () => api.get(`/colecao/${cartaId}/detalhes`).then((r) => r.data),
    enabled: !!cartaId,
  });
}
