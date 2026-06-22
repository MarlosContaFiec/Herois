import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useCartas(filtros = {}) {
  return useQuery({
    queryKey: ["cartas", filtros],
    queryFn: () => api.get("/cartas", { params: filtros }).then((r) => r.data),
    staleTime: 0,
  });
}

export function useCarta(id) {
  return useQuery({
    queryKey: ["carta", id],
    queryFn: () => api.get(`/cartas/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCriarCarta() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) => api.post("/cartas", dados).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso("Carta criada!");
      qc.invalidateQueries({ queryKey: ["cartas"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
