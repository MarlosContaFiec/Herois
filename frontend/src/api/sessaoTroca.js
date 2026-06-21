import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useToast } from '../context/ToastContext';

export function useSessaoAtiva(guildaId) {
  return useQuery({
    queryKey: ['sessao-troca', guildaId],
    queryFn: () => api.get(`/sessao-troca/${guildaId}/ativa`).then((r) => r.data),
    enabled: !!guildaId,
  });
}

export function useIniciarSessao() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (guildaId) => api.post(`/sessao-troca/${guildaId}/iniciar`).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso('Sessão de troca iniciada! Duração: 30 minutos.');
      qc.invalidateQueries({ queryKey: ['sessao-troca'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useColocarVitrine() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ sessaoId, cartaUsuarioId, precoPedido }) =>
      api.post(`/sessao-troca/${sessaoId}/vitrine`, { cartaUsuarioId, precoPedido }).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso('Carta colocada na vitrine!');
      qc.invalidateQueries({ queryKey: ['sessao-troca'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useFazerOferta() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ sessaoId, ...dados }) =>
      api.post(`/sessao-troca/${sessaoId}/oferta`, dados).then((r) => r.data),
    onSuccess: () => {
      toast.sucesso('Oferta enviada!');
      qc.invalidateQueries({ queryKey: ['sessao-troca'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useResponderOferta() {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ sessaoId, ofertaId, aceitar }) =>
      api.put(`/sessao-troca/${sessaoId}/oferta`, { ofertaId, aceitar }).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso(data.status === 'ACEITA' ? 'Oferta aceita!' : 'Oferta rejeitada.');
      qc.invalidateQueries({ queryKey: ['sessao-troca'] });
      qc.invalidateQueries({ queryKey: ['colecao'] });
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}