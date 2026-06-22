import { z } from "zod";

export const adicionar = z.object({
  params: z.object({ cartaId: z.string() }),
});

export const remover = z.object({
  params: z.object({ cartaId: z.string() }),
});
