import { z } from 'zod';

export const equipar = z.object({
  params: z.object({ id: z.string() }),
});