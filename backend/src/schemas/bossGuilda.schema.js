import { z } from 'zod';

export const atacar = z.object({
  body: z.object({
    cartasUsuarioIds: z.array(z.string()).min(1).max(3),
  }),
});