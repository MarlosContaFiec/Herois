import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';

export function useMissaoDiaria() {
  return useQuery({
    queryKey: ['missao-diaria'],
    queryFn: () => api.get('/missao-diaria/status').then((r) => r.data),
  });
}

export function useEnfrentarDiaria() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartasUsuarioIds) =>
      api.post('/missao-diaria/enfrentar', { cartasUsuarioIds }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.resultado === 'VITORIA') {
        toast.sucesso(`Missão diária completa! +${data.recompensas?.moedas || 0} moedas`);
      } else {
        toast.erro('Derrota na missão diária!');
      }
      qc.invalidateQueries({ queryKey: ['missao-diaria'] });
      qc.invalidateQueries({ queryKey: ['colecao'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}