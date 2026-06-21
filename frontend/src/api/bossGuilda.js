import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';

export function useBossStatus() {
  return useQuery({
    queryKey: ['boss-guilda'],
    queryFn: () => api.get('/boss-guilda/status').then((r) => r.data),
  });
}

export function useAtacarBoss() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (cartasUsuarioIds) =>
      api.post('/boss-guilda/atacar', { cartasUsuarioIds }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.derrotou) {
        toast.sucesso(`Boss derrotado! Dano: ${data.danoCausado}`);
      } else {
        toast.info(`Dano causado: ${data.danoCausado}. HP restante: ${data.hpRestante}`);
      }
      qc.invalidateQueries({ queryKey: ['boss-guilda'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}