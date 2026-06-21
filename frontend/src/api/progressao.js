import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';

export function useProgressao() {
  return useQuery({
    queryKey: ['progressao'],
    queryFn: () => api.get('/progressao').then((r) => r.data),
  });
}

export function useDesbloqueios() {
  return useQuery({
    queryKey: ['desbloqueios'],
    queryFn: () => api.get('/progressao/desbloqueios').then((r) => r.data),
  });
}