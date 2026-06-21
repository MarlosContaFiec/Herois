import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function useStreakStatus() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: () => api.get('/streak/status').then((r) => r.data),
  });
}

export function useResgatarStreak() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: () => api.post('/streak/resgatar').then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Streak resgatado: ${data.tipo === 'MOEDAS' ? `+${data.valor} moedas` : data.tipo}!`);
      qc.invalidateQueries({ queryKey: ['streak'] });
      qc.invalidateQueries({ queryKey: ['colecao'] });
      if (data.moedasTotal) {
        setUsuario((prev) => prev ? { ...prev, moedas: data.moedasTotal } : prev);
      }
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useComprarEscudo() {
  const qc = useQueryClient();
  const toast = useToast();
  const { setUsuario } = useAuth();

  return useMutation({
    mutationFn: () => api.post('/streak/escudo', {}).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso('Escudo comprado!');
      qc.invalidateQueries({ queryKey: ['streak'] });
      setUsuario((prev) => prev ? { ...prev, moedas: data.moedasRestantes } : prev);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}