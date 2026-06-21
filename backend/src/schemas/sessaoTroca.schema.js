import { z } from 'zod';

export const iniciar = z.object({
  params: z.object({ id: z.string() }),
});

export const listar = z.object({
  params: z.object({ id: z.string() }),
});

export const listarCartas = z.object({
  params: z.object({ sessaoId: z.string() }),
});

export const colocarNaVitrine = z.object({
  params: z.object({ sessaoId: z.string() }),
  body: z.object({
    cartaUsuarioId: z.string(),
    precoPedido: z.number().int().min(0).optional(),
  }),
});

export const fazerOferta = z.object({
  params: z.object({ sessaoId: z.string() }),
  body: z.object({
    listagemId: z.string(),
    tipoOferta: z.enum(['MOEDAS', 'CARTA', 'PACOTE', 'TITULO']),
    ofertaMoedas: z.number().int().min(0).optional(),
    ofertaCartaId: z.string().optional(),
    ofertaPacoteId: z.string().optional(),
    ofertaTituloId: z.string().optional(),
  }),
});

export const responderOferta = z.object({
  params: z.object({ sessaoId: z.string() }),
  body: z.object({
    ofertaId: z.string(),
    aceitar: z.boolean(),
  }),
});