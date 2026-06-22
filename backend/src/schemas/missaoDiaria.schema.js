import { z } from "zod";

export const enfrentar = z.object({
  body: z.object({
    cartasUsuarioIds: z.array(z.string()).min(1).max(3),
  }),
});
