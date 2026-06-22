import { z } from "zod";

const elementos = ["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];
const classes = ["GUERREIRO", "MAGO", "PATRULHEIRO", "CURANDEIRO", "LADINO"];
const raridades = ["COMUM", "INCOMUM", "RARA", "EPICA", "LENDARIA"];

export const criar = z.object({
  body: z.object({
    nome: z.string().min(1).max(100),
    descricao: z.string().max(500).optional(),
    imagem: z.string().optional(),
    elemento: z.enum(elementos),
    classe: z.enum(classes),
    raridade: z.enum(raridades),
  }),
});
