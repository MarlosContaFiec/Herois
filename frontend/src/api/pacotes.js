import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function usePacotes() {
  return useQuery({
    queryKey: ['pacotes'],
    queryFn: () => api.get('/pacotes').then((r) => r.data),
  });
}

export function useComprarPacote() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: (pacoteId) => api.post(`/pacotes/${pacoteId}/comprar`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Pacote aberto! ${data.cartasRecebidas.length} cartas recebidas.`);
      qc.invalidateQueries({ queryKey: ['colecao'] });
      qc.invalidateQueries({ queryKey: ['pity'] });
      setUsuario((prev) => prev ? { ...prev, moedas: data.moedasRestantes } : prev);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function usePity(pacoteId) {
  return useQuery({
    queryKey: ['pity', pacoteId],
    queryFn: () => api.get(`/pacotes/${pacoteId}/pity`).then((r) => r.data),
    enabled: !!pacoteId,
  });
}

export function useResgatarPity() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ pacoteId, cartaId }) => api.post(`/pacotes/${pacoteId}/pity`, { cartaId }).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Carta resgatada via Pity: ${data.carta.nome}!`);
      qc.invalidateQueries({ queryKey: ['colecao'] });
      qc.invalidateQueries({ queryKey: ['pity'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}