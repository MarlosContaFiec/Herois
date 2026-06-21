import { z } from 'zod';

export const comprar = z.object({
  params: z.object({ id: z.string() }),
});

export const pity = z.object({
  params: z.object({ id: z.string() }),
});

export const resgatar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    cartaId: z.string(),
  }),
});