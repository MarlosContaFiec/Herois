import { z } from "zod";

export const registrar = z.object({
  body: z.object({
    nomeUsuario: z.string().min(3).max(30),
    email: z.string().email(),
    senha: z.string().min(6).max(100),
  }),
});

export const login = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(1),
  }),
});
