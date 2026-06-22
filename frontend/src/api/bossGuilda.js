import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useBossStatus() {
  return useQuery({
    queryKey: ["boss-guilda"],
    queryFn: () => api.get("/boss-guilda/status").then((r) => r.data),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
}

export function useAtacarBoss() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartasUsuarioIds) =>
      api.post("/boss-guilda/atacar", { cartasUsuarioIds }).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["boss-guilda"] });
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      if (data.derrotou) {
        toast.sucesso("Boss derrotado! Novo boss mais forte apareceu!");
      } else {
        toast.info(`Dano causado: ${data.danoCausado}`);
      }
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

// somente para testes, remover depois
export async function testarReset(guildaId) {
  return api.post(`/boss-guilda/testar-reset/${guildaId}`).then((r) => r.data);
}
