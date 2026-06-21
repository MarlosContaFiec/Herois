import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function useEvoluir() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (cartaUsuarioId) =>
      api.post(`/evolucao/${cartaUsuarioId}/evoluir`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Carta evoluída para ${data.novaRaridade}!`);
      qc.invalidateQueries({ queryKey: ['colecao'] });
      setUsuario((prev) => prev ? { ...prev, moedas: data.moedasRestantes } : prev);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}