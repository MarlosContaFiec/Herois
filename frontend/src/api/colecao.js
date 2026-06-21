import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';

export function useColecao() {
  return useQuery({
    queryKey: ['colecao'],
    queryFn: () => api.get('/colecao').then((r) => r.data),
    staleTime: 0,
  });
}

export function useAdicionarColecao() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartaId) => api.post(`/colecao/${cartaId}`).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso('Carta adicionada à coleção!');
      qc.invalidateQueries({ queryKey: ['colecao'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useRemoverColecao() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartaId) => api.delete(`/colecao/${cartaId}`),
    onSuccess: () => {
      toast.sucesso('Carta removida da coleção!');
      qc.invalidateQueries({ queryKey: ['colecao'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}