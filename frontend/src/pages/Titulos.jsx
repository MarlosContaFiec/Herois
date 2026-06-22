import { motion } from "framer-motion";
import {
  useTitulos,
  useMeusTitulos,
  useEquiparTitulo,
  useDesequiparTitulo,
} from "../api/titulos";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnGhost,
  btnSm,
  gridCols3,
  textSecondary,
  fontSemibold,
  badgeBase,
  badgeCyan,
  badgeAmber,
  badgePink,
} from "../styles/components";
import { IconTitulos, IconMoedas, IconCheck } from "../utils/icones";

const tipoIcon = { SORTE: IconCheck, TEMPO: IconStreak, MOEDAS: IconMoedas };
const tipoBadges = { SORTE: badgeCyan, TEMPO: badgeAmber, MOEDAS: badgePink };

import { IconStreak } from "../utils/icones";
const tipoIcon2 = { SORTE: IconCheck, TEMPO: IconStreak, MOEDAS: IconMoedas };

export default function Titulos() {
  const { data: todos, isLoading } = useTitulos();
  const { data: meus } = useMeusTitulos();
  const equipar = useEquiparTitulo();
  const desequipar = useDesequiparTitulo();
  const idsMeus = new Set(meus?.map((t) => t.tituloId) || []);

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Títulos</h1>
        <p className={`${textSecondary} text-sm mt-1`}>
          Equipe um título para receber bônus passivos
        </p>
      </div>
      <div className="mb-6">
        <button
          onClick={() => desequipar.mutate()}
          className={`${btnGhost} text-sm`}
        >
          Desequipar título atual
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={gridCols3}>
          {todos?.map((titulo, i) => {
            const possui = idsMeus.has(titulo.id);
            const Icone = tipoIcon2[titulo.tipoBonus] || IconTitulos;
            return (
              <motion.div
                key={titulo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`${cardBase} ${cardHover} p-5 ${possui ? "border-cyan-500/30" : ""}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icone
                    size={24}
                    className={possui ? "text-cyan-400" : "text-slate-500"}
                  />
                  <div>
                    <h3 className={`${fontSemibold} text-slate-200 text-sm`}>
                      {titulo.nome}
                    </h3>
                    <span
                      className={`${badgeBase} ${tipoBadges[titulo.tipoBonus]} text-[10px]`}
                    >
                      {titulo.tipoBonus}
                    </span>
                  </div>
                </div>
                <p className={`${textSecondary} text-xs mb-3`}>
                  {titulo.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-bold">
                    +{Math.round(titulo.valorBonus * 100)}%
                  </span>
                  {titulo.trocavel && (
                    <span
                      className={`${badgeBase} bg-pink-500/20 text-pink-400 text-[10px]`}
                    >
                      Trocável
                    </span>
                  )}
                </div>
                {possui && (
                  <button
                    onClick={() => equipar.mutate(titulo.id)}
                    disabled={equipar.isPending}
                    className={`${btnPrimary} ${btnSm} w-full mt-3 flex items-center justify-center gap-1`}
                  >
                    <IconCheck size={12} /> Equipar
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
}
