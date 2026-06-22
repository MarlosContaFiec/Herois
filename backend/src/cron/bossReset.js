import cron from "node-cron";
import prisma from "../utils/prisma.js";
import * as bossService from "../services/bossGuilda.service.js";

export function iniciarCronBoss() {
  cron.schedule(
    "0 21 * * *",
    async () => {
      console.log("[CRON] Reset do boss das 21h iniciado");

      try {
        const guildas = await prisma.guilda.findMany();

        for (const guilda of guildas) {
          try {
            const resultado = await bossService.distribuirRecompensas(
              guilda.id,
            );
            console.log(
              `[CRON] Guilda ${guilda.nome}: ${resultado.recompensas.length} jogadores recompensados`,
            );
            for (const r of resultado.recompensas) {
              console.log(
                `[CRON]   ${r.usuario}: +${r.moedas} moedas (posicao ${r.posicao})`,
              );
            }
          } catch (err) {
            console.log(`[CRON] Guilda ${guilda.nome}: ${err.message}`);
          }
        }

        console.log("[CRON] Reset do boss concluido");
      } catch (err) {
        console.error("[CRON] Erro no reset do boss:", err.message);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    },
  );

  console.log("[CRON] Boss reset agendado para 21:00 (America/Sao_Paulo)");
}
