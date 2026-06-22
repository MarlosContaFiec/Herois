import { motion } from "framer-motion";
import { useRanking, useMinhasEstatisticas } from "../api/ranking";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  pageTitle,
  pageHeader,
  textSecondary,
  fontSemibold,
  statCard,
  statValue,
  statLabel,
  badgeBase,
  badgeCyan,
  badgeAmber,
  badgePink,
} from "../styles/components";
import {
  IconRanking,
  IconPacotes,
  IconMissoes,
  IconBoss,
} from "../utils/icones";

function TabelaRanking({ titulo, dados, icone: Icone, corBadge }) {
  return (
    <div className={`${cardBase} p-5`}>
      <h3
        className={`${fontSemibold} text-slate-200 mb-3 flex items-center gap-2`}
      >
        <Icone size={16} /> {titulo}
      </h3>
      {dados?.length === 0 ? (
        <p className={`${textSecondary} text-xs`}>Nenhum dado esta semana</p>
      ) : (
        <div className="space-y-2">
          {dados?.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500"}`}
                >
                  {i + 1}º
                </span>
                <span className="text-sm text-slate-200">{r.usuario}</span>
              </div>
              <span className={`${badgeBase} ${corBadge} font-bold`}>
                {r.valor}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Ranking() {
  const { data: ranking, isLoading } = useRanking();
  const { data: minhas } = useMinhasEstatisticas();
  if (isLoading)
    return (
      <AnimatedPage>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AnimatedPage>
    );

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Ranking Semanal</h1>
        <p className={`${textSecondary} text-sm mt-1`}>{ranking?.premio}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={statCard}>
          <IconPacotes size={24} className="text-slate-500 mx-auto" />
          <div className={statValue}>{minhas?.pacotesAbertos || 0}</div>
          <div className={statLabel}>Pacotes Abertos</div>
        </div>
        <div className={statCard}>
          <IconMissoes size={24} className="text-slate-500 mx-auto" />
          <div className={statValue}>{minhas?.missoesCompletadas || 0}</div>
          <div className={statLabel}>Missões</div>
        </div>
        <div className={statCard}>
          <IconBoss size={24} className="text-slate-500 mx-auto" />
          <div className={statValue}>{minhas?.danoBossTotal || 0}</div>
          <div className={statLabel}>Dano Boss</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TabelaRanking
          titulo="Mais Pacotes Abertos"
          dados={ranking?.rankingPacotes}
          icone={IconPacotes}
          corBadge={badgeCyan}
        />
        <TabelaRanking
          titulo="Mais Missões"
          dados={ranking?.rankingMissoes}
          icone={IconMissoes}
          corBadge={badgeAmber}
        />
        <TabelaRanking
          titulo="Herói da Guilda"
          dados={ranking?.rankingBoss}
          icone={IconBoss}
          corBadge={badgePink}
        />
      </div>
    </AnimatedPage>
  );
}
