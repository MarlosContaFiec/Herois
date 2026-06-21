import { z } from 'zod';

export const evoluir = z.object({
  params: z.object({ cartaUsuarioId: z.string() }),
});