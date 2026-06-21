import { motion } from 'framer-motion';
import { useProgressao } from '../api/progressao';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, textSecondary, fontSemibold, statCard, statValue, statLabel, gridCols3, badgeBase } from '../styles/components';
import { IconProgressao, IconNivel, IconMissoes, IconCartas, IconLock } from '../utils/icones';

export default function Progressao() {
  const { data, isLoading } = useProgressao();
  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Progressão</h1></div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={statCard}><IconNivel size={24} className="text-slate-500 mx-auto" /><div className={statValue}>{data?.usuario?.nivel || 0}</div><div className={statLabel}>Nível</div></div>
        <div className={statCard}><IconMissoes size={24} className="text-slate-500 mx-auto" /><div className={statValue}>{data?.estatisticas?.missoesCompletadas || 0}</div><div className={statLabel}>Missões</div></div>
        <div className={statCard}><IconCartas size={24} className="text-slate-500 mx-auto" /><div className={statValue}>{data?.estatisticas?.totalCartas || 0}</div><div className={statLabel}>Cartas</div></div>
      </div>
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Pacotes Desbloqueados</h2>
      <div className={gridCols3}>
        {data?.pacotesDesbloqueados?.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`${cardBase} p-4 border-emerald-500/30`}>
            <span className={`${badgeBase} bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center gap-1 w-fit`}><IconProgressao size={10} /> Desbloqueado</span>
            <h3 className={`${fontSemibold} text-slate-200 mt-2`}>{p.nome}</h3>
            <p className={`${textSecondary} text-xs`}>{p.descricao}</p>
          </motion.div>
        ))}
      </div>
      {data?.pacotesBloqueados?.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-200 mb-3 mt-8">Pacotes Bloqueados</h2>
          <div className={gridCols3}>
            {data.pacotesBloqueados.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`${cardBase} p-4 opacity-60`}>
                <span className={`${badgeBase} bg-slate-600/30 text-slate-500 text-[10px] flex items-center gap-1 w-fit`}><IconLock size={10} /> Bloqueado</span>
                <h3 className={`${fontSemibold} text-slate-400 mt-2`}>{p.nome}</h3>
                {p.condicao && <p className={`${textSecondary} text-xs mt-1`}>{p.condicao.minNivel && `Nível ${p.condicao.minNivel}`}{p.condicao.missoesCompletadas && ` ${p.condicao.missoesCompletadas} missões`}</p>}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </AnimatedPage>
  );
}