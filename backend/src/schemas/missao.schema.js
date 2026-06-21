import { z } from 'zod';

export const listar = z.object({
  query: z.object({
    elemento: z.string().optional(),
  }),
});

export const enfrentar = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    cartasUsuarioIds: z.array(z.string()).min(1).max(3),
  }),
});