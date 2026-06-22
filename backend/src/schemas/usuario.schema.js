import { z } from "zod";

export const atualizarPerfil = z.object({
  body: z
    .object({
      nomeUsuario: z.string().min(3).max(30).optional(),
      email: z.string().email().optional(),
      senhaAtual: z.string().min(6).optional(),
      novaSenha: z.string().min(6).optional(),
    })
    .refine((data) => !data.novaSenha || data.senhaAtual, {
      message: "Senha atual obrigatória para alterar senha",
      path: ["senhaAtual"],
    }),
});
