import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function useLaboratorio() {
  return useQuery({
    queryKey: ["laboratorio"],
    queryFn: () => api.get("/laboratorio").then((r) => r.data),
  });
}

export function useCriarCartaLab() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) => api.post("/laboratorio", dados).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso("Carta criada no laboratório!");
      qc.invalidateQueries({ queryKey: ["laboratorio"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useDeletarCartaLab() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api.delete(`/laboratorio/${id}`),
    onSuccess: () => {
      toast.sucesso("Carta removida do laboratório!");
      qc.invalidateQueries({ queryKey: ["laboratorio"] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useTransferirLab() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (id) =>
      api.post(`/laboratorio/${id}/transferir`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`"${data.carta.nome}" transferida para o catálogo global!`);
      qc.invalidateQueries({ queryKey: ["laboratorio"] });
      qc.invalidateQueries({ queryKey: ["cartas"] });
      setUsuario((prev) =>
        prev ? { ...prev, moedas: data.moedasRestantes } : prev,
      );
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
