import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function useMissoes(elemento) {
  return useQuery({
    queryKey: ['missoes', elemento],
    queryFn: () => api.get('/missoes', { params: elemento ? { elemento } : {} }).then((r) => r.data),
  });
}

export function useMissao(id) {
  return useQuery({
    queryKey: ['missao', id],
    queryFn: () => api.get(`/missoes/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useEnfrentarMissao() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: ({ missaoId, cartasUsuarioIds }) =>
      api.post(`/missoes/${missaoId}/enfrentar`, { cartasUsuarioIds }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.resultado === 'VITORIA') {
        toast.sucesso(`Vitória! +${data.moedasGanhas} moedas, +${data.expGanha} XP`);
      } else {
        toast.erro('Derrota! Tente novamente.');
      }
      qc.invalidateQueries({ queryKey: ['colecao'] });
      qc.invalidateQueries({ queryKey: ['missoes'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}