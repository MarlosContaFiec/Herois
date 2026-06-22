import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function useBoosters() {
  return useQuery({
    queryKey: ["boosters"],
    queryFn: () => api.get("/boosters").then((r) => r.data),
  });
}

export function useCriarBooster() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) => api.post("/boosters", dados).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso("Booster criado!");
      qc.invalidateQueries({ queryKey: ["boosters"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useComprarBooster() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (id) => api.post(`/boosters/${id}/comprar`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Booster aberto! ${data.cartasRecebidas.length} cartas.`);
      qc.invalidateQueries({ queryKey: ["colecao"] });
      setUsuario((prev) =>
        prev ? { ...prev, moedas: data.moedasRestantes } : prev,
      );
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
