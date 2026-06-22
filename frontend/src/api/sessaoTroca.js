import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useToast } from "../context/ToastContext";

export function useSessaoAtiva(guildaId) {
  return useQuery({
    queryKey: ["sessao-troca", guildaId],
    queryFn: () =>
      api.get(`/sessao-troca/${guildaId}/ativa`).then((r) => r.data),
    enabled: !!guildaId,
    retry: false,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

export function useIniciarSessao() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (guildaId) =>
      api.post(`/sessao-troca/${guildaId}/iniciar`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessao-troca"] });
      toast.sucesso("Sessao de troca iniciada!");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useColocarVitrine() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ sessaoId, cartaUsuarioId, precoPedido }) =>
      api
        .post(`/sessao-troca/${sessaoId}/vitrine`, {
          cartaUsuarioId,
          precoPedido,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessao-troca"] });
      toast.sucesso("Carta colocada na vitrine!");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useFazerOferta() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      sessaoId,
      listagemId,
      tipoOferta,
      ofertaMoedas,
      cartasOfertadas,
    }) =>
      api
        .post(`/sessao-troca/${sessaoId}/oferta`, {
          listagemId,
          tipoOferta,
          ofertaMoedas: ofertaMoedas || undefined,
          cartasOfertadas: cartasOfertadas?.length
            ? cartasOfertadas
            : undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessao-troca"] });
      toast.sucesso("Oferta enviada!");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}

export function useResponderOferta() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ sessaoId, ofertaId, aceitar }) =>
      api
        .put(`/sessao-troca/${sessaoId}/oferta`, { ofertaId, aceitar })
        .then((r) => r.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessao-troca"] });
      queryClient.invalidateQueries({ queryKey: ["colecao"] });
      toast.sucesso(variables.aceitar ? "Oferta aceita!" : "Oferta rejeitada");
    },
    onError: (err) => toast.erro(err.response?.data?.erro || err.message),
  });
}
