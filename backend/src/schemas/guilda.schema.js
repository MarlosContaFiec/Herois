import { z } from "zod";

const tiposEntrada = ["AUTOMATICO", "PEDIDO", "SOMENTE_CONVITE"];

export const criar = z.object({
  body: z.object({
    nome: z.string().min(3).max(50),
    descricao: z.string().max(300).optional(),
    tipoEntrada: z.enum(tiposEntrada).optional(),
  }),
});

export const entrar = z.object({
  params: z.object({ id: z.string() }),
});

export const responderPedido = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    pedidoId: z.string(),
    aceitar: z.boolean(),
  }),
});

export const convidar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    usuarioId: z.string(),
  }),
});

export const expulsar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    usuarioId: z.string(),
  }),
});

export const promover = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    usuarioId: z.string(),
    papel: z.enum(["VICE", "MEMBRO"]),
  }),
});

export const agendar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    horarioFixo: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(),
    manual: z.boolean().optional(),
  }),
});
