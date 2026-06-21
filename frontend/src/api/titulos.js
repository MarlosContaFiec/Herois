import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';

export function useTitulos() {
  return useQuery({
    queryKey: ['titulos'],
    queryFn: () => api.get('/titulos').then((r) => r.data),
  });
}

export function useMeusTitulos() {
  return useQuery({
    queryKey: ['meus-titulos'],
    queryFn: () => api.get('/titulos/meus').then((r) => r.data),
  });
}

export function useEquiparTitulo() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api.put(`/titulos/${id}/equipar`).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(`Título "${data.tituloAtivo.nome}" equipado!`);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useDesequiparTitulo() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: () => api.delete('/titulos/equipar').then((r) => r.data),
    onSuccess: () => {
      toast.sucesso('Título desequipado!');
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}