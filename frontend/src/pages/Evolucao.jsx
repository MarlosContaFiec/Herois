import { useColecao } from "../api/colecao";
import { useEvoluir } from "../api/evolucao";
import AnimatedPage from "../components/AnimatedPage";
import { SkeletonLista } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnAmber,
  btnSm,
  gridCols4,
  textSecondary,
  fontSemibold,
  raridadeCores,
  badgeBase,
  progressTrack,
  progressBar,
} from "../styles/components";
import { IconEvoluir, IconPoder } from "../utils/icones";
import { motion } from "framer-motion";

export default function Evolucao() {
  const { data: colecao, isLoading } = useColecao();
  const evoluir = useEvoluir();
  const sufixo = (cont) =>
    ["", " +", " ++", " +++", " #"][Math.min(cont, 4)] || " #";
  const evoluiveis = colecao?.filter((cu) => cu.nivel >= 10) || [];

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Evolução</h1>
        <p className={`${textSecondary} text-sm mt-1`}>
          Cartas no nível 10 podem evoluir para a próxima raridade
        </p>
      </div>
      {isLoading ? (
        <SkeletonLista count={4} />
      ) : !evoluiveis.length ? (
        <EmptyState
          icone={IconEvoluir}
          titulo="Nenhuma carta pronta"
          descricao="Level up suas cartas até o nível 10 para evoluir"
        />
      ) : (
        <div className={gridCols4}>
          {evoluiveis.map((cu, i) => {
            const raridade =
              raridadeCores[cu.carta.raridade] || raridadeCores.COMUM;
            return (
              <motion.div
                key={cu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${cardBase} ${cardHover} p-4`}
              >
                <div
                  className={`h-1.5 bg-gradient-to-r ${raridade.gradiente} rounded-full mb-3`}
                />
                <h3 className={`${fontSemibold} text-sm text-slate-200`}>
                  {cu.carta.nome}
                  {sufixo(cu.contagemEvoluida)}
                </h3>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <span
                    className={`${badgeBase} ${raridade.badge} text-[10px]`}
                  >
                    {cu.carta.raridade}
                  </span>
                  <span className={`${textSecondary} text-xs`}>
                    Nv.{cu.nivel}
                  </span>
                  <span
                    className={`${textSecondary} text-xs flex items-center gap-1`}
                  >
                    <IconPoder size={10} className="text-amber-400" />{" "}
                    {cu.carta.poder}
                  </span>
                </div>
                <div className={progressTrack}>
                  <div className={progressBar} style={{ width: "100%" }} />
                </div>
                <p className={`${textSecondary} text-[10px] mt-1`}>
                  Nível máximo atingido!
                </p>
                <button
                  onClick={() => evoluir.mutate(cu.id)}
                  disabled={evoluir.isPending}
                  className={`${btnAmber} w-full mt-3 text-sm flex items-center justify-center gap-1`}
                >
                  <IconEvoluir size={14} />{" "}
                  {evoluir.isPending ? "Evoluindo..." : "Evoluir"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
}
