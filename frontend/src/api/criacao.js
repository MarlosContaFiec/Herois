import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function useTaxasCriacao() {
  return useQuery({
    queryKey: ["taxas-criacao"],
    queryFn: () => api.get("/criacao/taxas").then((r) => r.data),
  });
}

export function useCriarCartaCatalogo() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (dados) => api.post("/criacao", dados).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(
        `Carta "${data.carta.nome}" criada por ${data.custoPago} moedas!`,
      );
      qc.invalidateQueries({ queryKey: ["cartas"] });
      qc.invalidateQueries({ queryKey: ["taxas-criacao"] });
      setUsuario((prev) =>
        prev ? { ...prev, moedas: data.moedasRestantes } : prev,
      );
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
