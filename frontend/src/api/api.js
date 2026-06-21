import { useMutation } from '@tanstack/react-query';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useRegistrar() {
  const { login } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) => api.post('/auth/registrar', dados).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso('Conta criada com sucesso!');
      login(data.token, data.usuario);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useLogin() {
  const { login } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: (dados) => api.post('/auth/login', dados).then((r) => r.data),
    onSuccess: (data) => {
      toast.sucesso('Bem-vindo de volta!');
      login(data.token, data.usuario);
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}