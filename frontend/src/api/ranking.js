import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';

export function useRanking() {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: () => api.get('/ranking').then((r) => r.data),
  });
}

export function useMinhasEstatisticas() {
  return useQuery({
    queryKey: ['minhas-estatisticas'],
    queryFn: () => api.get('/ranking/me').then((r) => r.data),
  });
}