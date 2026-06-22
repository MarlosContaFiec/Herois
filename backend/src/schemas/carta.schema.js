import { z } from "zod";

const elementos = ["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];
const classes = ["GUERREIRO", "MAGO", "PATRULHEIRO", "CURANDEIRO", "LADINO"];
const raridades = ["COMUM", "INCOMUM", "RARA", "EPICA", "LENDARIA", "UNICA"];

export const criar = z.object({
  body: z.object({
    nome: z.string().min(1).max(100),
    descricao: z.string().max(500).optional(),
    imagem: z.string().optional(),
    elemento: z.enum(elementos),
    classe: z.enum(classes),
    raridade: z.enum(raridades),
    poder: z.number().int().min(10).max(600),
  }),
});

export const atualizar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    nome: z.string().min(1).max(100).optional(),
    descricao: z.string().max(500).optional(),
    imagem: z.string().optional(),
    elemento: z.enum(elementos).optional(),
    classe: z.enum(classes).optional(),
    raridade: z.enum(raridades).optional(),
    poder: z.number().int().min(10).max(600).optional(),
  }),
});

export const listar = z.object({
  query: z.object({
    elemento: z.enum(elementos).optional(),
    classe: z.enum(classes).optional(),
    raridade: z.enum(raridades).optional(),
    nome: z.string().optional(),
  }),
});

export const porId = z.object({
  params: z.object({ id: z.string() }),
});
