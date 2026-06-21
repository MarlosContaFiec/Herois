import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePacotes, useComprarPacote, usePity } from '../api/pacotes';
import AnimatedPage from '../components/AnimatedPage';
import { SkeletonLista } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { cardBase, cardHover, pageTitle, pageHeader, btnPrimary, btnAmber, btnGhost, btnBase, gridCols3, textSecondary, fontSemibold, raridadeCores, badgeBase, progressTrack, progressBar } from '../styles/components';
import { IconPacotes, IconCheck, IconSucesso } from '../utils/icones';

export default function Pacotes() {
  const { data: pacotes, isLoading } = usePacotes();
  const comprar = useComprarPacote();
  const [cartasReveladas, setCartasReveladas] = useState(null);
  const [pacoteSel, setPacoteSel] = useState(null);
  const { data: pity } = usePity(pacoteSel);

  const handleComprar = (pacoteId) => {
    comprar.mutate(pacoteId, { onSuccess: (data) => setCartasReveladas(data.cartasRecebidas) });
  };

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Pacotes</h1></div>
      {pacoteSel && pity && (
        <div className={`${cardBase} p-4 mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${fontSemibold} text-sm text-slate-200`}>Pity — {pacotes?.find(p => p.id === pacoteSel)?.nome}</span>
            <span className="text-cyan-400 text-sm font-bold">{pity.aberturas}/100</span>
          </div>
          <div className={progressTrack}><div className={progressBar} style={{ width: `${(pity.aberturas / 100) * 100}%` }} /></div>
          {pity.resgatavel && <button className={`${btnAmber} ${btnBase} mt-3 text-xs flex items-center gap-1`}><IconCheck size={12} /> Resgatar carta grátis!</button>}
        </div>
      )}
      {isLoading ? <SkeletonLista count={4} /> : !pacotes?.length ? <EmptyState icone={IconPacotes} titulo="Nenhum pacote disponível" /> : (
        <div className={gridCols3}>
          {pacotes.map((pacote, i) => (
            <motion.div key={pacote.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`${cardBase} ${cardHover} p-5`}>
              <h3 className={`${fontSemibold} text-slate-200 mb-1`}>{pacote.nome}</h3>
              <p className={`${textSecondary} text-xs mb-3`}>{pacote.descricao}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className={`${badgeBase} bg-slate-600/30 text-slate-400 text-[10px]`}>C:{pacote.pesoComum}%</span>
                <span className={`${badgeBase} bg-emerald-600/30 text-emerald-400 text-[10px]`}>U:{pacote.pesoIncomum}%</span>
                <span className={`${badgeBase} bg-cyan-600/30 text-cyan-400 text-[10px]`}>R:{pacote.pesoRara}%</span>
                <span className={`${badgeBase} bg-purple-600/30 text-purple-400 text-[10px]`}>E:{pacote.pesoEpica}%</span>
                <span className={`${badgeBase} bg-amber-600/30 text-amber-400 text-[10px]`}>L:{pacote.pesoLendaria}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold">{pacote.custo} moedas</span>
                <span className={`${textSecondary} text-xs`}>{pacote.qtdCartas} cartas</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleComprar(pacote.id)} disabled={comprar.isPending} className={`${btnPrimary} flex-1 text-sm`}>{comprar.isPending ? 'Abrindo...' : 'Comprar'}</button>
                <button onClick={() => setPacoteSel(pacote.id === pacoteSel ? null : pacote.id)} className={`${btnGhost} text-xs px-3`}>Pity</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {cartasReveladas && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCartasReveladas(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl" onClick={(e) => e.stopPropagation()}>
              {cartasReveladas.map((carta, i) => {
                const raridade = raridadeCores[carta.carta.raridade] || raridadeCores.COMUM;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 40, rotateY: 180 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ delay: i * 0.15, type: 'spring', damping: 15 }} className={`${cardBase} p-4 text-center border ${raridade.border}`}>
                    <span className={`${badgeBase} ${raridade.badge} text-[10px] mb-2`}>{carta.carta.raridade}</span>
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{carta.carta.nome}</h4>
                    <p className="text-amber-400 text-xs mt-1">{carta.carta.poder} poder</p>
                    <p className="text-slate-600 text-[10px] mt-1 flex items-center justify-center gap-1">
                      {carta.tipo === 'NOVA' ? <><IconSucesso size={10} /> Nova</> : <><IconCheck size={10} /> +{carta.xpGanho} XP</>}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
            <button onClick={() => setCartasReveladas(null)} className={`${btnPrimary} absolute bottom-8`}>Fechar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}