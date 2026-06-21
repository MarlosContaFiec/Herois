import { z } from 'zod';

export const comprarEscudo = z.object({
  body: z.object({
    quantidade: z.number().int().min(1).max(1).optional(),
  }),
});