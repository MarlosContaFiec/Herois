import { z } from 'zod';

export const criar = z.object({
  body: z.object({
    nome: z.string().min(1).max(100),
    qtdCartas: z.number().int().min(1).max(20),
    pesoComum: z.number().min(0).max(100),
    pesoIncomum: z.number().min(0).max(100),
    pesoRara: z.number().min(0).max(100),
    pesoEpica: z.number().min(0).max(100),
    pesoLendaria: z.number().min(0).max(100),
  }),
});

export const comprar = z.object({
  params: z.object({ id: z.string() }),
});