import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useAtualizarPerfil() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) =>
      api.put("/usuarios/perfil", dados).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      toast.sucesso("Perfil atualizado!");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
